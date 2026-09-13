[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$ReleaseDirectory,

  [Parameter(Mandatory = $true)]
  [ValidateSet('x64', 'arm64')]
  [string]$Architecture,

  [Parameter(Mandatory = $true)]
  [string]$Version
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$temporaryRoot = if ($env:RUNNER_TEMP) { $env:RUNNER_TEMP } else { [System.IO.Path]::GetTempPath() }
$releaseDirectory = [System.IO.Path]::GetFullPath((Join-Path $projectRoot $ReleaseDirectory))
$bundleDirectory = Join-Path $releaseDirectory 'bundle'
$outputDirectory = Join-Path $bundleDirectory 'portable'
$layoutName = "open-video-downloader-zh-cn-windows-$Architecture"
$temporaryDirectory = Join-Path $temporaryRoot "open-video-downloader-zh-cn-portable-$Architecture-$([guid]::NewGuid())"
$layoutDirectory = Join-Path $temporaryDirectory $layoutName
$portableDirectory = Join-Path $layoutDirectory 'open-video-downloader-zh-cn-portable'
$archiveName = "open-video-downloader-zh-cn-v$Version-windows-$Architecture-portable.zip"
$archivePath = Join-Path $outputDirectory $archiveName
$extractionDirectory = Join-Path $temporaryRoot "open-video-downloader-zh-cn-portable-check-$Architecture-$([guid]::NewGuid())"
$mainExecutable = Join-Path $releaseDirectory 'open-video-downloader-zh-cn.exe'
$licenseSource = Join-Path $projectRoot 'licenses/3rdpartylicenses.txt'

function Copy-RequiredFile {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $true)]
    [string]$Destination
  )

  if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) {
    throw "缺少便携包所需文件：$Source"
  }

  $destinationDirectory = Split-Path -Parent $Destination
  New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
  Copy-Item -LiteralPath $Source -Destination $Destination -Force
}

try {
  if (-not (Test-Path -LiteralPath $mainExecutable -PathType Leaf)) {
    throw "找不到已构建的主程序：$mainExecutable"
  }

  if (Test-Path -LiteralPath $archivePath) {
    Remove-Item -LiteralPath $archivePath -Force
  }

  New-Item -ItemType Directory -Force -Path $portableDirectory | Out-Null
  New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

  Copy-RequiredFile -Source $mainExecutable -Destination (Join-Path $layoutDirectory 'open-video-downloader-zh-cn.exe')
  Copy-RequiredFile -Source (Join-Path $projectRoot 'LICENSE') -Destination (Join-Path $layoutDirectory 'LICENSE')
  Copy-RequiredFile -Source (Join-Path $projectRoot 'NOTICE') -Destination (Join-Path $layoutDirectory 'NOTICE')
  Copy-RequiredFile -Source $licenseSource -Destination (Join-Path $layoutDirectory 'resources/licenses/3rdpartylicenses.txt')

  Set-Content -LiteralPath (Join-Path $portableDirectory '.keep') -Value '此目录会保存便携版应用数据，请勿删除。' -NoNewline

  Compress-Archive -LiteralPath $layoutDirectory -DestinationPath $archivePath -Force

  Expand-Archive -LiteralPath $archivePath -DestinationPath $extractionDirectory -Force
  $verificationRoot = Join-Path $extractionDirectory $layoutName
  $requiredPaths = @(
    (Join-Path $verificationRoot 'open-video-downloader-zh-cn.exe'),
    (Join-Path $verificationRoot 'LICENSE'),
    (Join-Path $verificationRoot 'NOTICE'),
    (Join-Path $verificationRoot 'resources/licenses/3rdpartylicenses.txt'),
    (Join-Path $verificationRoot 'open-video-downloader-zh-cn-portable/.keep')
  )

  foreach ($requiredPath in $requiredPaths) {
    if (-not (Test-Path -LiteralPath $requiredPath -PathType Leaf)) {
      throw "便携包验证失败，缺少文件：$requiredPath"
    }
  }

  Write-Host "已创建并验证便携包：$archivePath"
} finally {
  if (Test-Path -LiteralPath $temporaryDirectory) {
    Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force
  }
  if (Test-Path -LiteralPath $extractionDirectory) {
    Remove-Item -LiteralPath $extractionDirectory -Recurse -Force
  }
}

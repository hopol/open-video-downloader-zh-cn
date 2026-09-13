#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "用法：$0 <Deb 目录> <预期架构> <预期版本>" >&2
  exit 2
fi

bundle_directory=$1
expected_architecture=$2
expected_version=$3
expected_package='open-video-downloader-zh-cn'

shopt -s nullglob
debian_packages=("$bundle_directory"/*.deb)

if [[ ${#debian_packages[@]} -ne 1 ]]; then
  echo "预期在 $bundle_directory 中恰好找到一个 Deb 包，实际找到 ${#debian_packages[@]} 个。" >&2
  printf '  %s\n' "${debian_packages[@]:-无}" >&2
  exit 1
fi

debian_package=${debian_packages[0]}
actual_package=$(dpkg-deb -f "$debian_package" Package)
actual_version=$(dpkg-deb -f "$debian_package" Version)
actual_architecture=$(dpkg-deb -f "$debian_package" Architecture)

if [[ $actual_package != "$expected_package" ]]; then
  echo "Deb Package 字段错误：预期 $expected_package，实际 $actual_package。" >&2
  exit 1
fi

if [[ $actual_version != "$expected_version" ]]; then
  echo "Deb Version 字段错误：预期 $expected_version，实际 $actual_version。" >&2
  exit 1
fi

if [[ $actual_architecture != "$expected_architecture" ]]; then
  echo "Deb Architecture 字段错误：预期 $expected_architecture，实际 $actual_architecture。" >&2
  exit 1
fi

package_contents=$(dpkg-deb -c "$debian_package")

echo "--- Deb 包内 usr/bin/ 文件 ---" >&2
grep 'usr/bin/' <<< "$package_contents" >&2 || echo "（usr/bin/ 目录为空）" >&2
echo "--- Deb 包内 usr/share/applications/ 文件 ---" >&2
grep 'usr/share/applications/' <<< "$package_contents" >&2 || echo "（usr/share/applications/ 目录为空）" >&2

for required_path in \
  './usr/bin/open-video-downloader-zh-cn' \
  './usr/share/applications/open-video-downloader-zh-cn.desktop'; do
  if ! grep -Fq "$required_path" <<< "$package_contents"; then
    echo "Deb 内容缺少必需路径：$required_path" >&2
    exit 1
  fi
done

printf '已验证 Deb：%s（包名 %s，版本 %s，架构 %s）。\n' \
  "$debian_package" "$actual_package" "$actual_version" "$actual_architecture"

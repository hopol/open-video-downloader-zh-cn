const repository = 'hopol/open-video-downloader-zh-cn';
const releasesUrl = `https://github.com/${repository}/releases`;
const latestReleaseUrl = `${releasesUrl}/latest`;

function getOS() {
  const { userAgent, platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.includes(platform)) return 'macOS';
  if (iosPlatforms.includes(platform)) return 'other';
  if (windowsPlatforms.includes(platform)) return 'Windows';
  if (/Android/.test(userAgent)) return 'other';
  if (/Linux/.test(platform)) return 'Linux';
  return 'other';
}

async function httpGet(url) {
  return await new Promise((resolve) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        resolve(xmlHttp.responseText);
      } else if (xmlHttp.readyState === 4 && xmlHttp.status != null) {
        resolve(null);
      }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
  });
}

function getAssetDownload(os, release) {
  const preferredExtensions = {
    Windows: ['.exe'],
    Linux: ['.AppImage', '.deb', '.rpm'],
  };
  const extensions = preferredExtensions[os];

  if (!extensions) return undefined;

  const asset = release.assets.find(candidate => extensions.some(extension => candidate.name.endsWith(extension)));
  return asset ? asset.browser_download_url : undefined;
}

function setOtherVersionsText(os) {
  const otherVersions = document.getElementById('other-versions');

  if (os === 'Windows') {
    otherVersions.innerHTML = '查看其他 Windows 或 Linux 安装包';
  } else if (os === 'Linux') {
    otherVersions.innerHTML = '查看其他 Linux 或 Windows 安装包';
  } else {
    otherVersions.innerHTML = '查看全部发布版本';
  }
}

function configureFallback(button, downloadType, downloadLink, text) {
  downloadType.innerHTML = text;
  button.addEventListener('click', () => {
    window.location.href = latestReleaseUrl;
  });
  downloadLink.setAttribute('href', latestReleaseUrl);
}

async function setDownloadButton() {
  const os = getOS();
  const button = document.getElementById('download-button');
  const downloadType = document.getElementById('download-type');
  const downloadLink = document.getElementById('download-link');

  setOtherVersionsText(os);

  const versionData = await httpGet(`https://api.github.com/repos/${repository}/releases/latest`);
  if (versionData == null || os === 'other') {
    configureFallback(button, downloadType, downloadLink, os === 'other' ? '前往发布页面选择安装包' : `适用于 ${os}`);
    return;
  }

  let release;
  try {
    release = JSON.parse(versionData);
  } catch (error) {
    void error;
    configureFallback(button, downloadType, downloadLink, `适用于 ${os}`);
    return;
  }

  const download = getAssetDownload(os, release);
  if (!download) {
    configureFallback(button, downloadType, downloadLink, `${release.tag_name}：前往发布页面选择安装包`);
    return;
  }

  downloadType.innerHTML = `${release.tag_name} · ${os}`;
  button.addEventListener('click', () => {
    window.location.href = download;
  });
  downloadLink.setAttribute('href', download);
}

(function () {
  void setDownloadButton();
  document.getElementById('hamburger').addEventListener('click', () => {
    const nav = document.getElementById('nav-list');
    const opened = nav.style.display !== 'none';
    nav.style.display = opened ? 'none' : 'block';
  });
}());

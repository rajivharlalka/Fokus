var contextMenus = {};

var showforPage = ["*://*.youtube.com/watch?*"];
contextMenus.createMenu = chrome.contextMenus.create(
  { title: "Remove recommendations", documentUrlPatterns: showforPage },
  function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
  }
);

chrome.contextMenus.onClicked.addListener(contextMenuHandler);

function contextMenuHandler(info, tab) {
  if (info.menuItemId === contextMenus.createMenu) {
    chrome.tabs.executeScript({
      file: "js/index.js",
    });
  }
}

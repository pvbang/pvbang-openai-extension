chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "myContextMenu",
    title: "PvBang OpenAI",
    contexts: ["all"] // Hiển thị menu chuột phải bất kỳ lúc nào
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "myContextMenu") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
          return selectedText;
        } else {
          return navigator.clipboard.readText();
        }
      }
    }, function(results) {
      if (!results || !results[0]) return;
      const textToUse = results[0].result || '';
      chrome.storage.local.set({ selectedText: textToUse }, function() {
        // Mở popup khi người dùng chọn menu chuột phải
        chrome.action.openPopup();
      });
    });
  }
});

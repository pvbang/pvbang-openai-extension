chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);
  chrome.action.openPopup();
});

chrome.runtime.onInstalled.addListener(function() {
  // Tạo context menu chính
  chrome.contextMenus.create({
    id: "pvbangAI",
    title: "Phan V. Bang AI",
    contexts: ["selection", "page"]
  });

  // Tạo các sub-menu cho từng tính năng
  chrome.contextMenus.create({
    id: "summary",
    parentId: "pvbangAI",
    title: "📝 Tóm tắt",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "translate",
    parentId: "pvbangAI",
    title: "🌐 Dịch sang tiếng Việt",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "analyze",
    parentId: "pvbangAI",
    title: "🔍 Phân tích",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "question",
    parentId: "pvbangAI",
    title: "❓ Hỏi đáp về nội dung",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "info",
    parentId: "pvbangAI",
    title: "💡 Tìm hiểu thông tin",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "separator",
    parentId: "pvbangAI",
    type: "separator",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "openAssistant",
    parentId: "pvbangAI",
    title: "🚀 Mở trợ lý AI",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "openAssistant") {
    // Chỉ mở popup
    chrome.action.openPopup();
    return;
  }

  // Xử lý các action cụ thể
  if (["summary", "translate", "analyze", "question", "info"].includes(info.menuItemId)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function() {
        const selectedText = window.getSelection().toString().trim();
        return selectedText || null;
      }
    }, function(results) {
      if (!results || !results[0] || !results[0].result) {
        // Không có text được chọn, chỉ mở popup
        chrome.action.openPopup();
        return;
      }

      const selectedText = results[0].result;
      
      // Lưu text và action vào storage
      chrome.storage.local.set({ 
        selectedText: selectedText,
        pendingAction: info.menuItemId,
        contextMenuClick: true
      }, function() {
        // Mở popup
        chrome.action.openPopup();
      });
    });
  }
});

// Lắng nghe khi popup được mở để xử lý action từ context menu
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getContextData") {
    chrome.storage.local.get(["selectedText", "pendingAction", "contextMenuClick"], function(result) {
      sendResponse(result);
      // Xóa dữ liệu sau khi đã lấy
      chrome.storage.local.remove(["pendingAction", "contextMenuClick"]);
    });
    return true; // Indicates that the response is asynchronous
  }
});


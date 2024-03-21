document.addEventListener('DOMContentLoaded', function () {
  const selectedTextElement = document.getElementById('selectedText');
  const translationResult = document.getElementById('translationResult');

  // Hàm để thực hiện việc dịch tự động khi tài liệu được tải xong
  function autoTranslate() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: function () {
            return window.getSelection().toString();
          }
        },
        function (results) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            translationResult.textContent = chrome.runtime.lastError;
          } else {
            const selectedText = results[0].result;
            if (selectedText.trim() === '') {
              // Nếu không có văn bản được chọn, đọc văn bản từ clipboard
              navigator.clipboard.readText().then((clipboardText) => {
                selectedTextElement.textContent = clipboardText;
                translateText(clipboardText); // Dịch tự động ngay sau khi đọc được văn bản từ clipboard
              }).catch((error) => {
                console.error('Error reading clipboard:', error);
                translationResult.textContent = 'Error reading clipboard';
              });
            } else {
              selectedTextElement.textContent = selectedText;
              translateText(selectedText); // Dịch tự động ngay sau khi lấy được văn bản được chọn
            }
          }
        }
      );
    });
  }

  // Gọi hàm tự động dịch ngay sau khi tài liệu được tải xong
  autoTranslate();

  // Hàm thực hiện dịch văn bản
  function translateText(text) {
    let formattedString = text.replace(/\n/g, ' ');
    translationResult.textContent = '';

    const apiKey = 'sk-';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestData = {
      "model": "gpt-4",
      "messages": [
        {
          "role": "user",
          "content": formattedString
        }
      ]
    };

    axios
      .post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })
      .then(function (response) {
        const translatedText = response.data.choices[0].message.content;
        console.log(response);
        console.log(translatedText);
        translationResult.textContent = translatedText;
        translationResult.style.overflowY = "auto"; // Thêm thuộc tính cuộn
        translationResult.style.maxHeight = "200px"; // Đặt chiều cao tối đa của phần tử
      })
      .catch(function (error) {
        translationResult.textContent = error;
        console.error('Error:', error);
      });
  }
});

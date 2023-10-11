document.addEventListener('DOMContentLoaded', function () {
  const selectedTextElement = document.getElementById('selectedText');
  const translateButton = document.getElementById('translateButton');
  const translationResult = document.getElementById('translationResult');

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
          selectedTextElement.textContent = results[0].result;
        }
      }
    );
  });

  translateButton.addEventListener('click', function () {
    const textSelect = selectedTextElement.textContent;
    console.log(textSelect);
    translationResult.textContent = '';

    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

    const requestData = {
      prompt: textSelect,
      max_tokens: 100
    };

    axios
      .post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })
      .then(function (response) {
        const translatedText = response.data.choices[0].text;
        translationResult.textContent = translatedText;
      })
      .catch(function (error) {
        translationResult.textContent = error;
        console.error('Error:', error);
      });
  });
});

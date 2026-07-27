// Configuration
const CONFIG = {
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Prompts for different features
const PROMPTS = {
  summary: `[ ## Nhiệm vụ ## ]: Tóm tắt văn bản sau ngắn gọn và súc tích bằng tiếng Việt:

{text}

[ ## Output Format ## ]:
Trả lời theo format markdown với:
## Tóm tắt chính
- Điểm chính 1
- Điểm chính 2  
- Điểm chính 3

## Kết luận
Kết luận tổng quát`,

  translate: `[ ## Nhiệm vụ ## ]:
- Dịch văn bản gốc một cách thông minh, tự nhiên và chính xác (Nếu là tiếng Việt thì dịch sang tiếng Anh. Nếu là ngôn ngữ khác thì dịch sang tiếng Việt).
- Nếu là tiếng Việt thì dịch sang tiếng Anh. Nếu là ngôn ngữ khác thì dịch sang tiếng Việt (ví dụ: tiếng Anh sang tiếng Việt, tiếng Pháp sang tiếng Việt, tiếng Trung sang tiếng Việt...).
- Viết lại văn bản gốc sao cho đúng ý, đúng ngữ pháp hơn (bằng ngôn ngữ gốc, không phải bản dịch).

[ ## Trả lời theo format markdown vớ ## ]:
## Bản dịch
- Văn bản dịch một cách thông minh, tự nhiên và chính xác.

## Văn bản gốc được viết lại
- Văn bản gốc được viết lại (bằng ngôn ngữ gốc, không phải bản dịch) sao cho tự nhiên, đúng ngữ pháp và ý nghĩa.

[ ## Văn bản gốc ## ]:
"{text}"`,

  analyze: `Phân tích văn bản sau từ nhiều góc độ bằng tiếng Việt:

{text}

[ ## Trả lời theo format markdown với ## ]:
## Phân tích tổng quan
- Chủ đề chính
- Mục đích 
- Đối tượng

## Phân tích chi tiết  
- Luận điểm chính
- Bằng chứng/ví dụ
- Cách thức trình bày
- Các thông tin khác / cần chú ý (nếu có)

## Đánh giá
- Điểm mạnh
- Điểm yếu
- Độ tin cậy

## Kết luận
Nhận định tổng thể`,

  code: `Phân tích và giải thích đoạn code sau như một chuyên gia bằng tiếng Việt:

{text}

[ ## Trả lời theo format markdown với ## ]:
## Mô tả chung
Giải thích tổng quan về code

## Phân tích từng phần
- Giải thích chi tiết từng dòng/khối code quan trọng
- Cách thức hoạt động
- Cách fix chi teiét từng bước (nếu có lỗi)
- Các thông tin khác (nếu cần thiết)

## Tối ưu hóa (nếu có)
\`\`\`
// Code được cải thiện
\`\`\`

## Lỗi thường gặp
Các lỗi có thể xảy ra và cách khắc phục`,

  question: `Suy nghĩ thật kỹ. Dựa vào Bối cảnh để làm theo Yêu cầu một cách chi tiết, logic, rõ ràng bằng tiếng Việt:

[ ## Bối cảnh ## ]: 
{context}

[ ## Yêu cầu ## ]: 
{text}

Trả lời theo format markdown rõ ràng và có cấu trúc.`,

  prompt: `Analyze the context and requirement below to create an optimized, clear, and effective prompt for LLMs in English:

[ ## Context ## ]: 
{context}

[ ## User Requirement ## ]: 
{text}

[ ## Task ## ]:
Create a professional prompt in English that:
1. Clearly defines the task/objective
2. Provides specific instructions and format requirements
3. Includes relevant context and constraints
4. Uses proper prompt engineering techniques
5. Is optimized for LLM understanding and performance

[ ## Output Format ## ]:
## Optimized Prompt
\`\`\`
[Your optimized English prompt here]
\`\`\`

## Prompt Analysis
- **Objective**: Clear description of what the prompt aims to achieve
- **Key Components**: Breaking down the essential parts
- **Prompt Engineering Techniques Used**: Specific techniques applied
- **Expected Output Quality**: What kind of response this prompt should generate

## Usage Tips
- Best practices for using this prompt
- Potential variations or modifications
- Common pitfalls to avoid`,

  quiz: `Phân tích câu hỏi trắc nghiệm sau và chỉ đưa ra đáp án chính xác:

{text}

[ ## Yêu cầu ## ]:
- Chỉ trả lời đáp án (ví dụ: A, B, C, D...)
- KHÔNG giải thích thêm
- Suy nghĩ thật kỹ trước khi chọn
- Nếu có nhiều đáp án đúng thì liệt kê theo thứ tự từ đúng nhất (ví dụ: A, C)

[ ## Đáp án ## ]:`
};

// DOM elements
let elements = {};
let currentText = '';
let currentAction = '';

// Test function for debugging
window.testGeminiAPI = async function(testPrompt = "Xin chào, bạn có thể trả lời không? Yes or No") {
  console.log('Testing Gemini API...');
  try {
    const response = await axios.post(
      CONFIG.GEMINI_API_URL,
      {
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': CONFIG.GEMINI_API_KEY
        }
      }
    );
    
    console.log('✅ API test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupEventListeners();
  loadSelectedText();
});

function initializeElements() {
  elements = {
    selectedTextContainer: document.getElementById('selectedTextContainer'),
    selectedText: document.getElementById('selectedText'),
    actionButtons: document.getElementById('actionButtons'),
    questionContainer: document.getElementById('questionContainer'),
    customQuestion: document.getElementById('customQuestion'),
    askButton: document.getElementById('askButton'),
    loadingContainer: document.getElementById('loadingContainer'),
    resultContainer: document.getElementById('resultContainer'),
    resultTitle: document.getElementById('resultTitle'),
    resultContent: document.getElementById('resultContent'),
    copyResult: document.getElementById('copyResult'),
    closeResult: document.getElementById('closeResult'),
    status: document.getElementById('status')
  };
}

function setupEventListeners() {
  // Action buttons
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', handleActionClick);
  });

  // Ask button
  elements.askButton.addEventListener('click', handleCustomQuestion);

  // Enter key in question input
  elements.customQuestion.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleCustomQuestion();
    }
  });

  // Text input change listener
  elements.selectedText.addEventListener('input', function() {
    currentText = this.value.trim();
  });

  // Result actions
  elements.copyResult.addEventListener('click', copyResultToClipboard);
  elements.closeResult.addEventListener('click', closeResult);
}

function loadSelectedText() {
  showLoading('Đang tải văn bản...');

  // Kiểm tra xem có dữ liệu từ context menu không
  chrome.runtime.sendMessage({action: "getContextData"}, function(response) {
    if (response && response.contextMenuClick && response.selectedText) {
      // Có dữ liệu từ context menu
      currentText = response.selectedText;
      handleLoadedText(currentText);
      
      // Nếu có pending action, thực hiện ngay
      if (response.pendingAction) {
        setTimeout(() => {
          const actionBtn = document.querySelector(`[data-action="${response.pendingAction}"]`);
          if (actionBtn) {
            actionBtn.click();
          }
        }, 500);
      }
      return;
    }

    // Không có dữ liệu từ context menu, thực hiện như cũ
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: function() {
            return window.getSelection().toString();
          }
        },
        function(results) {
          if (chrome.runtime.lastError) {
            handleTextFromClipboard();
          } else {
            const selectedText = results[0].result;
            if (selectedText.trim() === '') {
              handleTextFromClipboard();
            } else {
              handleLoadedText(selectedText);
            }
          }
        }
      );
    });
  });
}

function handleTextFromClipboard() {
  navigator.clipboard.readText().then((clipboardText) => {
    handleLoadedText(clipboardText);
  }).catch((error) => {
    console.error('Error reading clipboard:', error);
    showError('Không thể đọc văn bản từ clipboard');
    hideLoading();
  });
}

function handleLoadedText(text) {
  currentText = text.trim();
  hideLoading();
  
  // Luôn hiển thị textarea để user có thể nhập/chỉnh sửa
  elements.selectedTextContainer.style.display = 'block';
  elements.selectedTextContainer.classList.add('slide-in');
  
  if (currentText) {
    elements.selectedText.value = currentText;
    updateStatus('connected');
  } else {
    elements.selectedText.placeholder = 'Nhập hoặc dán văn bản cần xử lý...';
    updateStatus('disconnected');
  }
}

function showSelectedText(text) {
  elements.selectedText.value = text.length > 500 ? text.substring(0, 500) + '...' : text;
  elements.selectedTextContainer.style.display = 'block';
  elements.selectedTextContainer.classList.add('slide-in');
  currentText = elements.selectedText.value;
}

function handleActionClick(e) {
  const button = e.currentTarget;
  const action = button.getAttribute('data-action');
  
  // Reset previous selections
  document.querySelectorAll('.action-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  
  currentAction = action;

  if (action === 'question') {
    showQuestionInput();
  } else if (action === 'quiz') {
    // Handle quiz directly with selected text
    const textValue = elements.selectedText.value.trim();
    if (textValue) {
      processText(textValue, action);
    } else {
      showError('Vui lòng nhập câu hỏi trắc nghiệm cần trả lời.');
      elements.selectedTextContainer.style.display = 'block';
      elements.selectedText.focus();
    }
  } else {
    // Lấy text từ textarea
    const textValue = elements.selectedText.value.trim();
    if (textValue) {
      processText(textValue, action);
    } else {
      showError('Vui lòng nhập văn bản cần xử lý.');
      elements.selectedTextContainer.style.display = 'block';
      elements.selectedText.focus();
    }
  }
}

function showQuestionInput() {
  // Auto-fill question input with selected text as context
  const selectedTextValue = elements.selectedText.value.trim();
  if (selectedTextValue) {
    // Show the question input with context hint
    const contextHint = selectedTextValue.length > 100 
      ? selectedTextValue.substring(0, 100) + '...' 
      : selectedTextValue;
    elements.customQuestion.placeholder = `Nhập câu hỏi về: "${contextHint}"`;
  } else {
    elements.customQuestion.placeholder = 'Nhập câu hỏi của bạn...';
  }
  
  elements.questionContainer.style.display = 'block';
  elements.questionContainer.classList.add('slide-in');
  elements.customQuestion.focus();
}

function handleCustomQuestion() {
  const question = elements.customQuestion.value.trim();
  if (question) {
    // Always use selected text as context for questions
    const contextText = elements.selectedText.value.trim();
    if (contextText) {
      processText(question, 'question', contextText);
    } else {
      // If no context, still process the question
      processText(question, 'question', '');
    }
    elements.customQuestion.value = '';
    elements.questionContainer.style.display = 'none';
  }
}

function processText(text, action, context = '') {
  showLoading(`Đang ${getActionName(action)}...`);
  
  let prompt = PROMPTS[action];
  if (action === 'question' || action === 'prompt') {
    if (context) {
      prompt = prompt.replace('{context}', context);
      prompt = prompt.replace('{text}', text);
    } else {
      // Nếu không có context, chỉ xử lý yêu cầu đơn thuần
      if (action === 'prompt') {
        prompt = `Create an optimized, clear, and effective prompt for LLMs in English based on the following requirement:

[ ## User Requirement ## ]: 
${text}

[ ## Task ## ]:
Create a professional prompt in English that:
1. Clearly defines the task/objective
2. Provides specific instructions and format requirements
3. Uses proper prompt engineering techniques
4. Is optimized for LLM understanding and performance

[ ## Output Format ## ]:
## Optimized Prompt
\`\`\`
[Your optimized English prompt here]
\`\`\`

## Prompt Analysis
- **Objective**: Clear description of what the prompt aims to achieve
- **Key Components**: Breaking down the essential parts
- **Prompt Engineering Techniques Used**: Specific techniques applied
- **Expected Output Quality**: What kind of response this prompt should generate

## Usage Tips
- Best practices for using this prompt
- Potential variations or modifications
- Common pitfalls to avoid`;
      } else {
        prompt = `Trả lời câu hỏi sau chi tiết bằng tiếng Việt:

${text}

Trả lời theo format markdown rõ ràng và có cấu trúc.`;
      }
    }
  } else {
    prompt = prompt.replace('{text}', text);
  }
  
  callGeminiAPI(prompt, action);
}

function getActionName(action) {
  const names = {
    summary: 'tóm tắt',
    translate: 'dịch',
    analyze: 'phân tích',
    code: 'giải thích code',
    question: 'trả lời',
    prompt: 'tạo prompt',
    quiz: 'giải trắc nghiệm'
  };
  return names[action] || 'xử lý';
}

async function callGeminiAPI(prompt, action) {
  try {
    console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
    console.log('API URL:', CONFIG.GEMINI_API_URL);
    
    const requestData = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(
      CONFIG.GEMINI_API_URL,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': CONFIG.GEMINI_API_KEY
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    console.log('Gemini API Response:', response.data);

    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const result = response.data.candidates[0].content.parts[0].text;
      showResult(result, action);
      updateStatus('connected');
    } else {
      throw new Error('No valid response from Gemini API');
    }
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    let errorMessage = 'Có lỗi xảy ra khi xử lý yêu cầu.';
    
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      
      if (error.response.status === 429) {
        errorMessage = 'Đã vượt quá giới hạn API. Vui lòng thử lại sau.';
      } else if (error.response.status === 403) {
        errorMessage = 'API key không hợp lệ hoặc không có quyền truy cập.';
      } else if (error.response.status === 400) {
        errorMessage = 'Yêu cầu không hợp lệ. Vui lòng thử lại với văn bản khác.';
      } else if (error.response.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else {
        errorMessage = `Lỗi API: ${error.response.status} - ${error.response.statusText}`;
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
    } else {
      errorMessage = `Lỗi không xác định: ${error.message}`;
    }
    
    showError(errorMessage);
    updateStatus('disconnected');
  }
}

function showResult(content, action) {
  hideLoading();
  
  // Update result title
  const titles = {
    summary: 'Tóm tắt',
    translate: 'Bản dịch',
    analyze: 'Phân tích', 
    code: 'Giải thích Code',
    question: 'Trả lời',
    prompt: 'Prompt được tạo',
    quiz: 'Đáp án Trắc nghiệm'
  };
  
  // Reset title styling
  const { resultTitle } = elements;
  const titleSpan = resultTitle.querySelector('span');
  const titleIcon = resultTitle.querySelector('i');
  
  titleSpan.textContent = titles[action] || 'Kết quả';
  titleIcon.className = 'bx bx-check-circle';
  resultTitle.style.color = '#10b981'; // success color
  
  // Convert markdown to HTML and display
  const htmlContent = markdownToHtml(content);
  const resultClass = `result-${action}`;
  
  elements.resultContent.innerHTML = `
    <div class="markdown-content ${resultClass}">
      ${htmlContent}
    </div>
  `;
  
  elements.resultContainer.style.display = 'block';
  elements.resultContainer.classList.add('slide-in');
  
  // Scroll to result
  elements.resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // Unordered lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  if (!html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>') && !html.includes('<ul>') && !html.includes('<pre>')) {
    html = '<p>' + html + '</p>';
  }
  
  return html;
}

function showLoading(message = 'Đang xử lý...') {
  elements.loadingContainer.querySelector('span').textContent = message;
  elements.loadingContainer.style.display = 'block';
  elements.resultContainer.style.display = 'none';
}

function hideLoading() {
  elements.loadingContainer.style.display = 'none';
}

function showError(message) {
  hideLoading();
  
  // Reset result title styling
  const { resultTitle } = elements;
  const titleSpan = resultTitle.querySelector('span');
  const titleIcon = resultTitle.querySelector('i');
  
  titleSpan.textContent = 'Thông báo lỗi';
  titleIcon.className = 'bx bx-error-circle';
  resultTitle.style.color = '#ef4444'; // danger color
  
  elements.resultContent.innerHTML = `
    <div class="markdown-content">
      <div style="
        padding: 20px;
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border: 1px solid #fecaca;
        border-radius: 12px;
        border-left: 4px solid #ef4444;
      ">
        <h3 style="color: #dc2626; margin-top: 0;">⚠️ Lỗi xảy ra</h3>
        <p style="color: #991b1b; margin: 12px 0;"><strong>${message}</strong></p>
        
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #fecaca;">
          <h4 style="color: #dc2626; margin: 0 0 8px 0; font-size: 14px;">💡 Gợi ý khắc phục:</h4>
          <ul style="color: #7f1d1d; font-size: 13px; margin: 0; padding-left: 20px;">
            <li>Kiểm tra kết nối internet</li>
            <li>Thử lại sau vài giây</li>
            <li>Nhập văn bản ngắn hơn</li>
            <li>Kiểm tra API key trong console (F12)</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  elements.resultContainer.style.display = 'block';
  elements.resultContainer.classList.add('slide-in');
}

function copyResultToClipboard() {
  // Get text content without HTML tags
  const content = elements.resultContent.innerText || elements.resultContent.textContent;
  
  navigator.clipboard.writeText(content).then(() => {
    showNotification('Đã sao chép vào clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showNotification('❌ Không thể sao chép', 'error');
  });
}

function closeResult() {
  elements.resultContainer.style.display = 'none';
  elements.questionContainer.style.display = 'none';
  // Reset button states
  document.querySelectorAll('.action-btn').forEach(btn => btn.classList.remove('active'));
}

function updateStatus(status) {
  elements.status.className = status === 'connected' ? 'status connected' : 'status disconnected';
  elements.status.querySelector('i').className = status === 'connected' ? 'bx bx-wifi' : 'bx bx-wifi-off';
}

function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = message;
  
  const bgColor = type === 'success' ? '#10b981' : '#ef4444';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideInFromRight 0.3s ease-out;
    max-width: 300px;
  `;
  
  // Add animation keyframes if not exists
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInFromRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideInFromRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

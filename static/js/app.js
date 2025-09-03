// 純前端專屬碼生成器 - No Python 版本
let currentTaskId = null;
let generatedCodes = [];

// 翻譯系統現在從 i18n.js 載入
// translations 對象將從 i18n.js 提供

// 當前語言設定
let currentLanguage = 'zh';

// 語言切換函數
function switchLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  
  // 保存到 localStorage
  localStorage.setItem('language', lang);
  
  // 更新 URL 路徑結構
  updateUrlForLanguage(lang);
  
  // 更新所有文本
  updateAllTexts();
  
  // 更新隱私提示文字
  updatePrivacyText();
  
  // 更新格式預覽
  updateFormatPreview();
  
  // 控制格式預覽顯示（只在中文模式顯示）
  const formatPreview = document.getElementById('formatPreview');
  if (formatPreview) {
    formatPreview.style.display = (lang === 'zh') ? 'block' : 'none';
  }
  
  // 更新表單驗證訊息
  updateFormValidationMessages();
  
  // 更新語言切換器狀態
  updateLanguageSwitcher();
}

// 更新 URL 路徑結構
function updateUrlForLanguage(lang) {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const currentHash = window.location.hash;
  
  let newPath;
  if (lang === 'en') {
    if (currentPath === '/' || currentPath === '') {
      newPath = '/en';
    } else if (!currentPath.startsWith('/en')) {
      newPath = '/en' + currentPath;
    } else {
      newPath = currentPath;
    }
  } else {
    if (currentPath.startsWith('/en')) {
      newPath = currentPath.replace(/^\/en/, '') || '/';
    } else {
      newPath = currentPath;
    }
  }
  
  const newUrl = newPath + currentSearch + currentHash;
  if (newUrl !== window.location.pathname + currentSearch + currentHash) {
    window.history.replaceState({}, '', newUrl);
  }
}

// 更新語言切換器狀態
function updateLanguageSwitcher() {
  const langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.lang === currentLanguage) {
      option.classList.add('active');
    }
  });
}

// 更新所有文本
function updateAllTexts() {
  // 更新所有帶有 data-i18n 屬性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
  
  // 更新所有帶有 data-i18n-placeholder 屬性的元素
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.placeholder = translations[currentLanguage][key];
    }
  });
  
  // 更新所有帶有 data-i18n-title 屬性的元素
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.title = translations[currentLanguage][key];
    }
  });
  
  // 更新主標題
  const mainTitle = document.querySelector('h1');
  if (mainTitle && translations[currentLanguage] && translations[currentLanguage]['main_title']) {
    mainTitle.textContent = translations[currentLanguage]['main_title'];
  }
  
  // 更新副標題
  const subtitle = document.querySelector('.subtitle');
  if (subtitle && translations[currentLanguage] && translations[currentLanguage]['subtitle']) {
    subtitle.textContent = translations[currentLanguage]['subtitle'];
  }
}

// 更新隱私提示文字
function updatePrivacyText() {
  const privacyText = document.querySelector('.footer-note');
  if (privacyText && translations[currentLanguage] && translations[currentLanguage]['privacy_note']) {
    privacyText.textContent = translations[currentLanguage]['privacy_note'];
  }
}

// 更新格式預覽
function updateFormatPreview() {
  const formatPreview = document.getElementById('formatPreview');
  if (!formatPreview) return;
  
  // 簡單的格式預覽功能
  const prefix = document.getElementById('prefix')?.value || '';
  const suffix = document.getElementById('suffix')?.value || '';
  const prefixConnector = document.getElementById('prefix_connector')?.value || '';
  const suffixConnector = document.getElementById('suffix_connector')?.value || '';
  
  let preview = (prefix ? prefix + (prefixConnector || '') : '') + 
                'ABC123' + 
                (suffix ? (suffixConnector || '') + suffix : '');
  
  formatPreview.textContent = `預覽: ${preview}`;
}

// 更新版權年份
function updateCopyright() {
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
}

// DOM 元素
const generateBtn = document.getElementById('generateBtn');
const progressSection = document.getElementById('progressSection');
const resultsSection = document.getElementById('resultsSection');
const countInput = document.getElementById('count');
const codeLengthInput = document.getElementById('code_length');
const letterCountInput = document.getElementById('letter_count');
const digitCountInput = document.getElementById('digit_count');
const prefixInput = document.getElementById('prefix');
const suffixInput = document.getElementById('suffix');

// 表單驗證訊息更新
function updateFormValidationMessages() {
  if (!translations[currentLanguage]) return;
  
  const lang = translations[currentLanguage];
  
  // 產生數量驗證
  if (countInput) {
    countInput.oninvalid = function(e) {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) {
        e.target.setCustomValidity(lang.error_invalid_count || '請輸入 1 到 100,000 之間的數字');
      }
    };
    countInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 專屬碼長度驗證
  if (codeLengthInput) {
    codeLengthInput.oninvalid = function(e) {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) {
        e.target.setCustomValidity(lang.error_invalid_length || '請輸入 4 到 20 之間的數字');
      }
    };
    codeLengthInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 英文字母數量驗證
  if (letterCountInput) {
    letterCountInput.oninvalid = function(e) {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) {
        e.target.setCustomValidity(lang.error_invalid_letter_count || '英文字母數量不能超過專屬碼長度');
      }
    };
    letterCountInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 數字數量驗證
  if (digitCountInput) {
    digitCountInput.oninvalid = function(e) {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) {
        e.target.setCustomValidity(lang.error_invalid_digit_count || '數字數量不能超過專屬碼長度');
      }
    };
    digitCountInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 前綴驗證
  if (prefixInput) {
    prefixInput.oninvalid = function(e) {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) {
        e.target.setCustomValidity(lang.error_invalid_prefix || '前綴只能包含字母和數字');
      }
    };
    prefixInput.oninput = function(e) { this.setCustomValidity(''); };
  }
  
  // 後綴驗證  
  if (suffixInput) {
    suffixInput.oninvalid = function(e) {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) {
        e.target.setCustomValidity(lang.error_invalid_suffix || '後綴只能包含字母和數字');
      }
    };
    suffixInput.oninput = function(e) { this.setCustomValidity(''); };
  }
}

// 專屬碼生成邏輯
function generateRandomCode(length, letterCount = 0, digitCount = 0) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const allChars = letters + digits;
  
  let code = '';
  
  // 如果指定了字母和數字數量
  if (letterCount > 0 || digitCount > 0) {
    // 確保字母數量
    for (let i = 0; i < letterCount; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // 確保數字數量
    for (let i = 0; i < digitCount; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    // 填充剩餘長度
    const remaining = length - letterCount - digitCount;
    for (let i = 0; i < remaining; i++) {
      code += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // 隨機打亂
    code = code.split('').sort(() => Math.random() - 0.5).join('');
  } else {
    // 隨機生成
    for (let i = 0; i < length; i++) {
      code += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  }
  
  return code;
}

// 批量生成專屬碼
function generateCodes(count, length, letterCount, digitCount, prefix, suffix, prefixConnector, suffixConnector) {
  const codes = new Set();
  const batchSize = 1000;
  let generated = 0;
  
  return new Promise((resolve) => {
    function generateBatch() {
      const startTime = Date.now();
      const currentBatchSize = Math.min(batchSize, count - generated);
      
      for (let i = 0; i < currentBatchSize; i++) {
        let attempts = 0;
        let code;
        
        do {
          const baseCode = generateRandomCode(length, letterCount, digitCount);
          code = (prefix ? prefix + (prefixConnector || '') : '') + 
                 baseCode + 
                 (suffix ? (suffixConnector || '') + suffix : '');
          attempts++;
        } while (codes.has(code) && attempts < 100);
        
        codes.add(code);
      }
      
      generated += currentBatchSize;
      
      // 更新進度
      const progress = Math.round((generated / count) * 100);
      updateProgress(progress, generated, count);
      
      if (generated < count) {
        // 下一批
        setTimeout(generateBatch, 10);
      } else {
        // 完成
        resolve(Array.from(codes));
      }
    }
    
    generateBatch();
  });
}

// 更新進度顯示
function updateProgress(percentage, current, total) {
  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');
  const estimateText = document.querySelector('.estimate-text');
  
  if (progressBar) {
    progressBar.style.width = percentage + '%';
  }
  
  if (progressText) {
    const lang = translations[currentLanguage] || translations['zh'];
    progressText.textContent = `${lang.progress_generating || '生成進度'}: ${current}/${total} (${percentage}%)`;
  }
  
  if (estimateText) {
    const remaining = total - current;
    const rate = current / 1; // 假設 1 秒生成 current 數量
    const estimate = Math.ceil(remaining / (rate || 1000));
    const lang = translations[currentLanguage] || translations['zh'];
    estimateText.textContent = `${lang.estimated_time || '預估剩餘時間'}: ${estimate} ${lang.seconds || '秒'}`;
  }
}

// 顯示結果
function displayResults(codes) {
  generatedCodes = codes;
  
  // 顯示前 50 個作為預覽
  const previewList = document.getElementById('previewList');
  if (previewList) {
    previewList.innerHTML = '';
    const previewCodes = codes.slice(0, 50);
    previewCodes.forEach(code => {
      const li = document.createElement('li');
      li.textContent = code;
      previewList.appendChild(li);
    });
  }
  
  // 更新統計
  const totalCount = document.getElementById('totalCount');
  const previewCount = document.getElementById('previewCount');
  
  if (totalCount) totalCount.textContent = codes.length;
  if (previewCount) previewCount.textContent = Math.min(50, codes.length);
  
  // 顯示結果區域
  resultsSection.classList.add('show');
  
  // 隱藏進度區域
  progressSection.classList.remove('show');
  
  // 重置按鈕
  resetGenerateButton();
}

// 重置生成按鈕
function resetGenerateButton() {
  if (generateBtn) {
    generateBtn.disabled = false;
    const lang = translations[currentLanguage] || translations['zh'];
    generateBtn.textContent = lang.generate_button || '開始生成';
  }
}

// 下載 CSV
function downloadCSV() {
  if (generatedCodes.length === 0) return;
  
  const csvContent = 'code\n' + generatedCodes.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `codes_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 顯示警告訊息
function showAlert(message, type = 'info') {
  // 這裡可以實現一個簡單的警告訊息顯示
  alert(message);
}

// 表單提交處理
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = {
    count: parseInt(formData.get('count')),
    code_length: parseInt(formData.get('code_length')),
    letter_count: parseInt(formData.get('letter_count')) || 0,
    digit_count: parseInt(formData.get('digit_count')) || 0,
    prefix: formData.get('prefix') || '',
    suffix: formData.get('suffix') || '',
    prefix_connector: formData.get('prefix_connector') || '',
    suffix_connector: formData.get('suffix_connector') || ''
  };
  
  // 驗證
  if (data.count < 1 || data.count > 100000) {
    showAlert('數量必須在 1 到 100,000 之間');
    return;
  }
  
  if (data.code_length < 4 || data.code_length > 20) {
    showAlert('專屬碼長度必須在 4 到 20 之間');
    return;
  }
  
  if (data.letter_count + data.digit_count > data.code_length) {
    showAlert('字母和數字的總數不能超過專屬碼長度');
    return;
  }
  
  // 開始生成
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<div class="loading-spinner"></div> <span>生成中...</span>';
  
  // 顯示進度
  progressSection.classList.add('show');
  resultsSection.classList.remove('show');
  
  try {
    const codes = await generateCodes(
      data.count,
      data.code_length,
      data.letter_count,
      data.digit_count,
      data.prefix,
      data.suffix,
      data.prefix_connector,
      data.suffix_connector
    );
    
    displayResults(codes);
  } catch (error) {
    showAlert('生成過程中發生錯誤: ' + error.message);
    resetGenerateButton();
  }
}

// 主題切換
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    if (themeToggle) themeToggle.textContent = '🌚 深色模式';
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    if (themeToggle) themeToggle.textContent = '🌞 淺色模式';
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 恢復主題設定
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.textContent = '🌞 淺色模式';
  }
  
  // 恢復語言設定
  const savedLanguage = localStorage.getItem('language') || 'zh';
  switchLanguage(savedLanguage);
  
  // 更新版權年份
  updateCopyright();
  
  // 綁定事件
  const form = document.getElementById('generatorForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  const languageSwitch = document.getElementById('languageSwitch');
  if (languageSwitch) {
    languageSwitch.addEventListener('click', function(e) {
      if (e.target.classList.contains('lang-option')) {
        const lang = e.target.dataset.lang;
        switchLanguage(lang);
      }
    });
  }
  
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadCSV);
  }
});
document.addEventListener('astro:page-load', function() {
  const codeBlocks = document.querySelectorAll('pre.astro-code, pre[data-language]');
  
  codeBlocks.forEach((pre) => {
    // 如果已经处理过，跳过
    if (pre.querySelector('.copy-code-btn') || pre.dataset.processed === 'true') {
      return;
    }
    pre.dataset.processed = 'true';
    
    const codeElement = pre.querySelector('code');
    if (!codeElement) return;
    
    // 处理亮色/暗色模式代码块样式
    applyCodeTheme(pre, codeElement);
    
    // 创建复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '📋';
    copyBtn.title = '复制代码';
    
    copyBtn.addEventListener('click', async () => {
      try {
        const codeText = codeElement.textContent || codeElement.innerText;
        await navigator.clipboard.writeText(codeText);
        copyBtn.innerHTML = '✔️';
        copyBtn.title = '已复制';
        setTimeout(() => {
          copyBtn.innerHTML = '📋';
          copyBtn.title = '复制代码';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        copyBtn.innerHTML = '❌';
        setTimeout(() => {
          copyBtn.innerHTML = '📋';
        }, 2000);
      }
    });
    
    pre.appendChild(copyBtn);
    addLineNumbers(pre, codeElement);
  });
  
  // 监听主题切换
  document.addEventListener('themechange', function() {
    document.querySelectorAll('pre.astro-code').forEach((pre) => {
      const codeElement = pre.querySelector('code');
      if (codeElement) {
        applyCodeTheme(pre, codeElement);
      }
    });
  });
});

function applyCodeTheme(pre, codeElement) {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    // 暗色模式 - GitHub Dark 风格
    pre.style.backgroundColor = '#24292e';
    pre.style.color = '#e1e4e8';
    codeElement.style.color = '#e1e4e8';
    
    codeElement.querySelectorAll('span').forEach((span) => {
      const inlineColor = span.style.color;
      if (inlineColor) {
        span.style.color = convertToDarkColor(inlineColor);
      }
    });
  } else {
    // 亮色模式 - GitHub Light 风格
    pre.style.backgroundColor = '#ffffff';
    pre.style.color = '#24292f';
    codeElement.style.color = '#24292f';
    
    codeElement.querySelectorAll('span').forEach((span) => {
      const inlineColor = span.style.color;
      if (inlineColor) {
        const newColor = convertToLightColor(inlineColor);
        span.style.color = newColor;
      }
    });
  }
}

function convertToLightColor(darkColor) {
  // 扩展的 GitHub Dark -> GitHub Light 颜色映射
  const colorMap = {
    // 基础颜色
    '#000000': '#24292f',
    '#ffffff': '#24292f',
    
    // GitHub Dark 主题颜色
    '#6a737d': '#656d76',  // comment
    '#f97583': '#cf222e',   // keyword
    '#b392f0': '#8250df',   // function
    '#e1e4e8': '#24292f',   // punctuation, this
    '#ffab70': '#116329',   // variable
    '#79b8ff': '#005cc5',   // number
    '#9ecbff': '#05a36a',   // string
    '#c678dd': '#8250df',   // class
    '#e6c07b': '#d97706',   // built-in
    '#98c379': '#05a36a',   // string
    
    // One Dark Pro 主题颜色
    '#56d364': '#05a36a',   // string
    '#f78c6c': '#cf222e',   // keyword
    '#89ddff': '#005cc5',   // number
    '#c3e88d': '#05a36a',   // string
    '#ffcb6b': '#d97706',   // number
    '#bb86fc': '#8250df',   // function
    '#7c818c': '#656d76',   // comment
    '#3b4252': '#24292f',   // punctuation
    '#434d58': '#374151',   // punctuation
    '#d8dee9': '#24292f',   // text
    '#88c0d0': '#005cc5',   // property
    '#bf616a': '#cf222e',   // keyword
    '#d3869b': '#cf222e',   // keyword
    '#ebcb8b': '#d97706',   // constant
    '#a3be8c': '#05a36a',   // string
    
    // 更多常见暗色主题颜色
    '#e5c07b': '#d97706',   // number
    '#d19a66': '#d97706',   // number
    '#61afef': '#005cc5',   // number
    '#e06c75': '#cf222e',   // keyword
    '#98c379': '#05a36a',   // string
    '#c678dd': '#8250df',   // function
    '#56b6c2': '#005cc5',   // property
    '#6c7086': '#656d76',   // comment
    '#73c0de': '#005cc5',   // number
    '#c9d1d9': '#24292f',   // text
    '#484f58': '#374151',   // punctuation
    
    // 十六进制小写变体
    '#6A737D': '#656d76',
    '#F97583': '#cf222e',
    '#B392F0': '#8250df',
    '#E1E4E8': '#24292f',
    '#FFAB70': '#116329',
    '#79B8FF': '#005cc5',
    '#9ECBFF': '#05a36a',
  };
  
  const normalizedColor = darkColor.toLowerCase().replace(/\s/g, '');
  
  if (colorMap[normalizedColor]) {
    return colorMap[normalizedColor];
  }
  
  // 如果颜色比较亮，转为深色
  const hex = normalizedColor.replace('#', '');
  if (hex.length === 6) {
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 128) {
      const factor = brightness > 200 ? 0.3 : 0.4;
      const nr = Math.max(20, Math.round(r * factor));
      const ng = Math.max(20, Math.round(g * factor));
      const nb = Math.max(20, Math.round(b * factor));
      return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
    }
  }
  
  return '#24292f';
}

function convertToDarkColor(lightColor) {
  const colorMap = {
    '#656d76': '#6a737d',
    '#cf222e': '#f97583',
    '#8250df': '#b392f0',
    '#24292f': '#e1e4e8',
    '#116329': '#ffab70',
    '#005cc5': '#79b8ff',
    '#05a36a': '#9ecbff',
    '#d97706': '#e6c07b',
  };
  
  const normalizedColor = lightColor.toLowerCase().replace(/\s/g, '');
  
  if (colorMap[normalizedColor]) {
    return colorMap[normalizedColor];
  }
  
  return '#e1e4e8';
}

function addLineNumbers(pre, codeElement) {
  const lines = codeElement.textContent.split('\n');
  const lineCount = lines.length;
  
  const lineNumbers = document.createElement('span');
  lineNumbers.className = 'line-numbers';
  
  let lineNumbersHTML = '';
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersHTML += `<span class="line-number">${i}</span>\n`;
  }
  lineNumbers.innerHTML = lineNumbersHTML.trim();
  
  pre.insertBefore(lineNumbers, codeElement);
  pre.classList.add('has-line-numbers');
}

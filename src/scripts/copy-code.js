document.addEventListener('astro:page-load', function() {
  // 查找所有带有 class 包含 "astro-code" 的 <pre> 标签
  const codeBlocks = document.querySelectorAll('pre.astro-code, pre[data-language]');
  
  codeBlocks.forEach((pre) => {
    // 如果已经有复制按钮，跳过
    if (pre.querySelector('.copy-code-btn')) {
      return;
    }
    
    // 创建复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '📋';
    copyBtn.title = '复制代码';
    
    // 添加点击事件
    copyBtn.addEventListener('click', async () => {
      const codeElement = pre.querySelector('code');
      if (!codeElement) return;
      
      try {
        // 获取代码文本内容
        const codeText = codeElement.textContent || codeElement.innerText;
        
        // 复制到剪贴板
        await navigator.clipboard.writeText(codeText);
        
        // 显示复制成功状态
        copyBtn.innerHTML = '✔️';
        copyBtn.title = '已复制';
        
        // 2秒后恢复原状
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
    
    // 将按钮添加到 <pre> 内部
    pre.appendChild(copyBtn);
  });
});

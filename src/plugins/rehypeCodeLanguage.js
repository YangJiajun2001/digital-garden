// 语言名称映射表
const languageNames = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'cpp': 'C++',
  'c': 'C',
  'csharp': 'C#',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'PHP',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart',
  'scala': 'Scala',
  'bash': 'Bash',
  'shell': 'Shell',
  'cmd': 'Command',
  'batch': 'Batch',
  'powershell': 'PowerShell',
  'sql': 'SQL',
  'html': 'HTML',
  'css': 'CSS',
  'json': 'JSON',
  'yaml': 'YAML',
  'xml': 'XML',
  'markdown': 'Markdown',
  'text': 'Text',
  'diff': 'Diff',
  'git': 'Git',
  'dockerfile': 'Dockerfile',
  'makefile': 'Makefile',
  'toml': 'TOML',
  'ini': 'INI',
  'properties': 'Properties'
};

// 获取语言显示名称
function getLanguageName(className) {
  if (className.startsWith('language-')) {
    const lang = className.replace('language-', '').toLowerCase();
    return languageNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }
  return null;
}

export const rehypeCodeLanguage = () => {
  return (tree) => {
    // 遍历 AST 树
    const visit = (node) => {
      if (node.type === 'element') {
        // 检查是否是代码块容器 (pre 元素)
        if (node.tagName === 'pre') {
          // 查找子元素中的 code 元素
          const codeElement = node.children.find(
            (child) => child.type === 'element' && child.tagName === 'code'
          );
          
          if (codeElement) {
            // 从 code 元素的 class 中获取语言信息
            const codeClass = codeElement.properties?.className;
            if (codeClass && codeClass.length > 0) {
              for (const className of codeClass) {
                const langName = getLanguageName(className);
                if (langName) {
                  // 创建语言标签元素
                  const langLabel = {
                    type: 'element',
                    tagName: 'span',
                    properties: {
                      className: ['code-lang-label']
                    },
                    children: [
                      {
                        type: 'text',
                        value: langName
                      }
                    ]
                  };
                  
                  // 将语言标签添加到 pre 元素的子元素开头
                  node.children.unshift(langLabel);
                  break;
                }
              }
            }
          }
        }
        
        // 递归访问子节点
        node.children.forEach(visit);
      }
    };
    
    visit(tree);
  };
};

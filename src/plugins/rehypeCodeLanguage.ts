import type { Plugin } from 'unified';
import type { Root, Element, Literal } from 'hast';

// 语言名称映射表
const languageNames: Record<string, string> = {
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
function getLanguageName(className: string): string | null {
  if (className.startsWith('language-')) {
    const lang = className.replace('language-', '').toLowerCase();
    return languageNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }
  return null;
}

export const rehypeCodeLanguage: Plugin<[], Root> = () => {
  return (tree) => {
    console.log('rehype-code-language plugin called');
    
    // 遍历 AST 树
    const visit = (node: Root | Element | Literal) => {
      if (node.type === 'element') {
        // 检查是否是代码块容器 (pre 元素)
        if (node.tagName === 'pre') {
          // 查找子元素中的 code 元素
          const codeElement = node.children.find(
            (child) => child.type === 'element' && (child as Element).tagName === 'code'
          ) as Element | undefined;
          
          if (codeElement) {
            // 从 code 元素的 class 中获取语言信息
            const codeClass = codeElement.properties?.className as string[] | undefined;
            if (codeClass && codeClass.length > 0) {
              for (const className of codeClass) {
                const langName = getLanguageName(className);
                if (langName) {
                  // 创建语言标签元素
                  const langLabel: Element = {
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

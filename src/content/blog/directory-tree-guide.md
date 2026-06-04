---
title: "别再手动敲目录了！教你一键导出项目文件树"
description: "分享几个一键导出目录树的快捷方法，让你秒变效率达人"
pubDate: "2026-06-04"
status: "evergreen"
tags: ["技术", "工具", "效率"]
---

写技术博客、分享开源项目或者写 README 的时候，我们经常需要展示项目的文件目录结构。你还在一个个手动敲那些缩进和符号吗？不仅费时费力，还极容易对不齐。今天分享几个一键导出目录树的快捷方法，让你秒变效率达人！

## 方法一：使用命令行（最快、最原生态）

无论你用什么系统，系统本身都自带了生成目录树的命令，打开终端即可使用。

### Windows 系统：`tree` 命令

打开命令提示符（CMD）或 PowerShell，`cd` 进入到你想导出的项目文件夹，输入：

```cmd
tree /f
```

- `/f` 的作用是显示文件夹里的**文件**。如果不加 `/f`，只显示文件夹名称。
- **导出到文件**：如果想把结果保存下来，输入以下命令，目录树就会自动保存到 `tree.txt` 文件中：

```cmd
tree /f > tree.txt
```

### Mac / Linux 系统：`tree` 命令

Mac 和 Linux 默认没有自带这个命令，但可以一键安装（强烈推荐安装，开发必备）：

- Mac 安装（需安装 Homebrew）：`brew install tree`
- Linux 安装：`sudo apt install tree`

安装后，在终端进入目标文件夹，输入：

```bash
tree
```

同样，导出到文件使用重定向符：

```bash
tree > tree.txt
```

**进阶技巧**：如果项目层级太深，只想展示前两级目录，可以使用 `-L` 参数：

```bash
tree -L 2 > tree.txt
```

---

## 方法二：VS Code 插件（最灵活、开发者首选）

如果你写代码用的是 VS Code，直接装插件是最方便的。不仅能一键生成，还能自定义格式、排除特定文件，生成后直接复制到剪贴板。

**推荐插件**：`Tree Generator` 或 `Project Tree`

**使用方法**（以 Tree Generator 为例）：

1. 在 VS Code 扩展商店搜索 `Tree Generator` 并安装。
2. 在项目根目录右键 -> 选择 `Tree Generator: Generate Tree`（或使用快捷键 `Ctrl+Shift+C`）。
3. 目录树会自动复制到你的剪贴板，直接去博客里 `Ctrl+V` 粘贴即可，非常丝滑！

---

## 方法三：Node.js 全局工具（精细化控制）

如果你是前端开发者，可以使用 npm 包来生成。它的最大优势是可以非常精细地控制**要排除哪些文件夹**（比如万恶的 `node_modules`）。

1. 全局安装 `tree-cli`：

```bash
npm install -g tree-cli
```

2. 在项目目录下运行（忽略 `node_modules` 和 `.git` 文件夹）：

```bash
tree -I "node_modules|.git"
```

3. 导出为文件：

```bash
tree -I "node_modules|.git" > tree.txt
```

---

## 核心痛点解决：如何隐藏干扰文件？

你可能会发现，用原生命令导出的目录树经常长这样：

```text
├── src
├── node_modules  👈 几千个文件瞬间刷屏！
├── .git
├── package.json
└── README.md
```

网上那些大佬分享的干净目录树，都是把 `node_modules`、`dist`、`.git` 这些干扰文件过滤掉的。怎么做到的？

- **Windows**：原生的 `tree` 命令**不支持**排除特定文件夹。建议使用上面提到的 **VS Code 插件**，或者安装 Node.js 后使用 `tree-cli`。
- **Mac/Linux**：使用 `-I` 参数（Ignore 的意思），多个文件夹用 `|` 隔开：

```bash
tree -I "node_modules|dist|.git"
```

---

## 锦上添花：如何生成高颜值的目录树？

有时候你会看到别人的目录树不是干巴巴的文本，文件夹和文件前面还有漂亮的彩色小图标（如 📁 和 📄），这通常有几种做法：

1. **截图法（最简单）**：在 VS Code 中，装上 `Material Icon Theme` 这类图标插件，你的文件树自带漂亮图标，直接截图发博客，效果拉满。

2. **代码美化工具**：将生成的纯文本目录树复制到 [Carbon](https://carbon.now.sh/) 等代码截图工具中，生成一张具有代码高亮风格的精美图片。

3. **手搓 Emoji**：在生成的文本基础上，手动加上 Emoji，比如：

```text
📁 src
├── 📄 index.html
└── 📁 assets
```

---

## 总结

| 方法 | 适用人群 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| **系统命令 `tree`** | 偶尔需要、不想装插件 | 系统自带，速度快 | Win 不支持排除指定文件夹 |
| **VS Code 插件** | 常写博客的开发者 | 一键复制，可排除文件 | 需安装 VS Code 插件 |
| **Node.js `tree-cli`** | 前端开发者 | 精细化控制过滤规则 | 需安装 Node 环境 |

下次写博客，别再手动敲目录啦，选一个适合自己的方法一键生成吧！如果你有其他更好用的工具，欢迎在评论区交流~
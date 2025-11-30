# kebab-rename

> 一鍵把檔名轉成 kebab-case

[← 回到 Muripo HQ](https://tznthou.github.io/muripo-hq/)

## TL;DR

批次將檔名轉換成 kebab-case。處理空格、CamelCase、snake_case、特殊符號，一個指令搞定。

## Demo

```
$ kebab-rename /tmp/my-folder

🔍 掃描中...

📁 /tmp/my-folder

  📄 CamelCaseFile.ts    →  camel-case-file.ts
  📄 IMPORTANT_FILE.md   →  important-file.md
  📄 My Document.txt     →  my-document.txt
  📄 Photo (1).jpg       →  photo-1.jpg
  📄 snake_case_name.py  →  snake-case-name.py

找到 5 個需要重新命名的項目。

💡 這是預覽模式。加上 --yes 或 -y 來實際執行重新命名。
```

## How to Run

```bash
# 方法 1: 直接用 npx（推薦）
npx kebab-rename ./my-folder

# 方法 2: 全域安裝
npm install -g kebab-rename
kebab-rename ./my-folder
```

## Usage

```bash
# 預覽模式（預設，不實際改名）
kebab-rename ./my-folder

# 實際執行
kebab-rename ./my-folder --yes
kebab-rename ./my-folder -y

# 遞迴處理子目錄
kebab-rename ./my-folder -r -y

# 只處理特定副檔名
kebab-rename ./my-folder --ext .jpg,.png -y

# 查看說明
kebab-rename --help
```

## 轉換規則

| 原本 | 轉換後 |
|------|--------|
| `My Document.txt` | `my-document.txt` |
| `CamelCaseFile.ts` | `camel-case-file.ts` |
| `snake_case_name.py` | `snake-case-name.py` |
| `Photo (1).jpg` | `photo-1.jpg` |
| `IMPORTANT_FILE.md` | `important-file.md` |
| `XMLParser.js` | `xml-parser.js` |
| `中文檔案.txt` | `中文檔案.txt` |

## 安全機制

- 預設是預覽模式，不會實際改名
- 跳過隱藏檔（.開頭）
- 跳過 `node_modules`、`.git` 等目錄
- 檔名衝突時自動加數字後綴

## License

MIT

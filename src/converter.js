import path from 'node:path';

const SUPPORTED_STYLES = new Set(['kebab', 'camel']);

function splitIntoTokens(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .replace(/[^a-zA-Z0-9\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function tokensToStyle(tokens, style) {
  if (tokens.length === 0) {
    return 'unnamed';
  }

  if (style === 'camel') {
    return tokens
      .map((token, index) => (index === 0 ? token : token.charAt(0).toUpperCase() + token.slice(1)))
      .join('');
  }

  // 預設 kebab-case
  return tokens.join('-');
}

export function toKebabCase(filename) {
  return convertFilename(filename, 'kebab');
}

export function toCamelCase(filename) {
  return convertFilename(filename, 'camel');
}

export function convertFilename(filename, style = 'kebab') {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  if (!name || !SUPPORTED_STYLES.has(style)) return filename;

  const tokens = splitIntoTokens(name);
  const converted = tokensToStyle(tokens, style);

  return converted + ext.toLowerCase();
}

/**
 * 檢查檔名是否需要轉換
 * @param {string} filename - 原始檔名
 * @param {string} style - 目標命名風格
 * @returns {boolean} 是否需要轉換
 */
export function needsConversion(filename, style = 'kebab') {
  const converted = convertFilename(filename, style);
  return converted !== filename;
}

/**
 * 處理檔名衝突，加上數字後綴
 * @param {string} filename - 目標檔名
 * @param {Set<string>} existingNames - 已存在的檔名集合
 * @param {string} style - 目標命名風格（kebab 或 camel）
 * @returns {string} 不衝突的檔名
 */
export function resolveConflict(filename, existingNames, style = 'kebab') {
  if (!existingNames.has(filename)) {
    return filename;
  }

  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  let counter = 1;
  let newName;

  do {
    // camelCase: myFile1.txt, kebab-case: my-file-1.txt
    newName = style === 'camel' ? `${name}${counter}${ext}` : `${name}-${counter}${ext}`;
    counter++;
  } while (existingNames.has(newName));

  return newName;
}

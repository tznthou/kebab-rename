import path from 'node:path';

/**
 * 將檔名轉換成 kebab-case
 * @param {string} filename - 原始檔名（含副檔名）
 * @returns {string} kebab-case 檔名
 */
export function toKebabCase(filename) {
  // 分離檔名和副檔名
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  // 如果檔名為空，直接返回
  if (!name) return filename;

  let kebab = name
    // CamelCase 拆分：MyFileName → My File Name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    // 連續大寫後接小寫：XMLParser → XML Parser
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // 底線轉空格
    .replace(/_/g, ' ')
    // 點轉空格（但不是副檔名的點）
    .replace(/\./g, ' ')
    // 移除特殊符號，保留字母、數字、空格、中日韓文字
    .replace(/[^a-zA-Z0-9\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, ' ')
    // 多個空格合併
    .replace(/\s+/g, ' ')
    // 去頭尾空格
    .trim()
    // 空格轉連字號
    .replace(/\s/g, '-')
    // 轉小寫
    .toLowerCase()
    // 清理可能的連續連字號
    .replace(/-+/g, '-')
    // 清理開頭結尾的連字號
    .replace(/^-|-$/g, '');

  // 如果轉換後為空，保留原名（可能是純符號檔名）
  if (!kebab) {
    kebab = 'unnamed';
  }

  return kebab + ext.toLowerCase();
}

/**
 * 檢查檔名是否需要轉換
 * @param {string} filename - 原始檔名
 * @returns {boolean} 是否需要轉換
 */
export function needsConversion(filename) {
  const converted = toKebabCase(filename);
  return converted !== filename;
}

/**
 * 處理檔名衝突，加上數字後綴
 * @param {string} filename - 目標檔名
 * @param {Set<string>} existingNames - 已存在的檔名集合
 * @returns {string} 不衝突的檔名
 */
export function resolveConflict(filename, existingNames) {
  if (!existingNames.has(filename)) {
    return filename;
  }

  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  let counter = 1;
  let newName;

  do {
    newName = `${name}-${counter}${ext}`;
    counter++;
  } while (existingNames.has(newName));

  return newName;
}

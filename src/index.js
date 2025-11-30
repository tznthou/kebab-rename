import fs from 'node:fs';
import path from 'node:path';
import { toKebabCase, needsConversion, resolveConflict } from './converter.js';

// 預設忽略的目錄
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  '.next',
  '__pycache__',
  'venv',
  '.venv',
]);

/**
 * 掃描目錄，取得需要重新命名的檔案清單
 * @param {string} targetDir - 目標目錄
 * @param {Object} options - 選項
 * @param {boolean} options.recursive - 是否遞迴
 * @param {string[]} options.extensions - 只處理特定副檔名
 * @returns {Array<{oldPath: string, newPath: string, oldName: string, newName: string}>}
 */
export function scanDirectory(targetDir, options = {}) {
  const { recursive = false, extensions = [] } = options;
  const results = [];
  const existingNames = new Map(); // dir -> Set of names

  function scan(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      console.error(`無法讀取目錄: ${dir} (${err.message})`);
      return;
    }

    // 收集該目錄下的所有檔名（用於衝突檢測）
    if (!existingNames.has(dir)) {
      existingNames.set(dir, new Set(entries.map((e) => e.name)));
    }
    const dirNames = existingNames.get(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // 跳過隱藏檔
      if (entry.name.startsWith('.')) {
        continue;
      }

      if (entry.isDirectory()) {
        // 跳過忽略的目錄
        if (IGNORED_DIRS.has(entry.name)) {
          continue;
        }

        // 目錄本身也可以重新命名
        if (needsConversion(entry.name)) {
          const newName = resolveConflict(toKebabCase(entry.name), dirNames);
          const newPath = path.join(dir, newName);
          results.push({
            oldPath: fullPath,
            newPath,
            oldName: entry.name,
            newName,
            isDirectory: true,
          });
          // 更新追蹤的名稱
          dirNames.add(newName);
        }

        // 遞迴處理子目錄
        if (recursive) {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        // 檢查副檔名過濾
        if (extensions.length > 0) {
          const ext = path.extname(entry.name).toLowerCase();
          if (!extensions.includes(ext)) {
            continue;
          }
        }

        // 檢查是否需要轉換
        if (needsConversion(entry.name)) {
          const newName = resolveConflict(toKebabCase(entry.name), dirNames);
          const newPath = path.join(dir, newName);
          results.push({
            oldPath: fullPath,
            newPath,
            oldName: entry.name,
            newName,
            isDirectory: false,
          });
          // 更新追蹤的名稱
          dirNames.add(newName);
        }
      }
    }
  }

  scan(targetDir);

  // 按照路徑深度排序（深的先處理，避免父目錄改名後路徑失效）
  results.sort((a, b) => {
    const depthA = a.oldPath.split(path.sep).length;
    const depthB = b.oldPath.split(path.sep).length;
    return depthB - depthA;
  });

  return results;
}

/**
 * 執行重新命名
 * @param {Array} renameList - scanDirectory 的結果
 * @returns {{success: number, failed: number, errors: string[]}}
 */
export function executeRename(renameList) {
  let success = 0;
  let failed = 0;
  const errors = [];

  for (const item of renameList) {
    try {
      fs.renameSync(item.oldPath, item.newPath);
      success++;
    } catch (err) {
      failed++;
      errors.push(`${item.oldPath}: ${err.message}`);
    }
  }

  return { success, failed, errors };
}

/**
 * 格式化輸出
 */
export function formatPreview(renameList, targetDir) {
  if (renameList.length === 0) {
    return `\n📁 ${targetDir}\n\n  ✓ 所有檔名都已經是 kebab-case，不需要變更。\n`;
  }

  let output = `\n📁 ${targetDir}\n\n`;

  const maxOldLen = Math.max(...renameList.map((r) => r.oldName.length));

  for (const item of renameList) {
    const icon = item.isDirectory ? '📂' : '📄';
    const oldPadded = item.oldName.padEnd(maxOldLen);
    output += `  ${icon} ${oldPadded}  →  ${item.newName}\n`;
  }

  output += `\n找到 ${renameList.length} 個需要重新命名的項目。\n`;

  return output;
}

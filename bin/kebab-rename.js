#!/usr/bin/env node

import { program } from 'commander';
import path from 'node:path';
import { scanDirectory, executeRename, formatPreview } from '../src/index.js';

program
  .name('kebab-rename')
  .description('一鍵把檔名轉成 kebab-case')
  .version('1.0.0')
  .argument('[directory]', '目標目錄', '.')
  .option('-r, --recursive', '遞迴處理子目錄')
  .option('-y, --yes', '直接執行（不需確認）')
  .option('-d, --dry-run', '只預覽，不實際執行（預設行為）')
  .option('-e, --ext <extensions>', '只處理特定副檔名，逗號分隔（如: .jpg,.png）')
  .action((directory, options) => {
    const targetDir = path.resolve(directory);

    // 解析副檔名選項
    const extensions = options.ext
      ? options.ext.split(',').map((e) => (e.startsWith('.') ? e.toLowerCase() : `.${e.toLowerCase()}`))
      : [];

    // 掃描目錄
    console.log('\n🔍 掃描中...');
    const renameList = scanDirectory(targetDir, {
      recursive: options.recursive,
      extensions,
    });

    // 顯示預覽
    console.log(formatPreview(renameList, targetDir));

    // 如果沒有需要重新命名的檔案，直接結束
    if (renameList.length === 0) {
      process.exit(0);
    }

    // 判斷是否執行
    if (options.yes) {
      // 直接執行
      console.log('🚀 執行重新命名...\n');
      const result = executeRename(renameList);

      if (result.success > 0) {
        console.log(`✅ 成功重新命名 ${result.success} 個項目`);
      }
      if (result.failed > 0) {
        console.log(`❌ 失敗 ${result.failed} 個項目:`);
        result.errors.forEach((err) => console.log(`   ${err}`));
      }
    } else {
      // 提示使用者
      console.log('💡 這是預覽模式。加上 --yes 或 -y 來實際執行重新命名。');
      console.log('   範例: kebab-rename --yes');
      console.log('   範例: kebab-rename ./my-folder -r -y\n');
    }
  });

program.parse();

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binPath = path.resolve(__dirname, '..', 'bin', 'kebab-rename.js');

function withTempDir(callback) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kebab-rename-'));
  try {
    return callback(tempDir);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('kebab-rename CLI', () => {
  it('ignores --yes when --dry-run is set', () => {
    withTempDir((dir) => {
      const sourceFile = path.join(dir, 'My File.txt');
      const renamedFile = path.join(dir, 'my-file.txt');
      fs.writeFileSync(sourceFile, 'demo');

      const output = execFileSync('node', [binPath, dir, '--yes', '--dry-run'], { encoding: 'utf8' });

      assert.ok(fs.existsSync(sourceFile));
      assert.ok(!fs.existsSync(renamedFile));
      assert.ok(output.includes('已啟用 dry-run'));
    });
  });

  it('trims whitespace when parsing extension filters', () => {
    withTempDir((dir) => {
      const jpgFile = path.join(dir, 'My Image.JPG');
      const pngFile = path.join(dir, 'Another File.png');
      const txtFile = path.join(dir, 'notes.txt');

      fs.writeFileSync(jpgFile, 'jpg');
      fs.writeFileSync(pngFile, 'png');
      fs.writeFileSync(txtFile, 'txt');

      const output = execFileSync('node', [binPath, dir, '--ext', '.jpg, .png'], { encoding: 'utf8' });

      assert.ok(output.includes('my-image.jpg'));
      assert.ok(output.includes('another-file.png'));
      assert.ok(!output.includes('notes.txt'));
    });
  });

  it('shows CLI version matching package.json', () => {
    const versionOutput = execFileSync('node', [binPath, '--version'], { encoding: 'utf8' }).trim();
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'));

    assert.equal(versionOutput, packageJson.version);
  });
});

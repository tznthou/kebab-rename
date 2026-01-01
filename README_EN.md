# Kebab Rename

> One-click file renaming to kebab-case, now with camelCase support too

[<- Back to Muripo HQ](https://tznthou.github.io/muripo-hq/) | [中文](README.md)

---

## Why "kebab"?

**kebab-case** is a standard naming convention in programming that looks like this:

```
my-file-name
```

Why is it called kebab (shish kebab)? Because words are strung together with hyphens `-`, looking like pieces of meat on a skewer:

```
  my - file - name

  ---------------  <- skewer
```

### The Programming Naming Zoo

| Naming Style | Example | Looks Like |
|--------------|---------|------------|
| **kebab-case** | `my-file-name` | Shish kebab |
| **snake_case** | `my_file_name` | Snake (underscores lie flat like a snake) |
| **camelCase** | `myFileName` | Camel (uppercase letters form humps) |
| **PascalCase** | `MyFileName` | Big Camel (first letter also capitalized) |

### Why Use kebab-case?

- **URL friendly**: Browsers don't encode `-`, so `my-file` looks better than `my%20file`
- **High readability**: `my-long-file-name` is much clearer than `mylongfilename`
- **Industry convention**: CSS classes, HTML attributes, and CLI parameters all use this style

---

## Features

- **Smart conversion**: Automatically handles CamelCase, snake_case, spaces, and special characters
- **Custom style**: Choose between kebab-case or camelCase output
- **Preview first**: Default mode shows what will change without executing
- **Safety mechanisms**: Automatically skips `.git`, `node_modules`, and other sensitive directories
- **Conflict handling**: Automatically adds numeric suffixes when filenames collide
- **Preserves Chinese**: Chinese filenames remain unchanged
- **Think Hard mode**: `kebab-rename-safe` provides detailed analysis, backup, and rollback features

---

## Quick Start

No installation needed, just one command:

```bash
npx kebab-rename ./your-folder
```

### Want extra safety? Use Think Hard mode

```bash
npx kebab-rename-safe ./your-folder -r
```

Provides detailed statistics, automatic backup, double confirmation, and rollback anytime!

---

## Installation

### Method 1: Run directly with npx (Recommended)

No installation required:

```bash
npx kebab-rename ./my-folder
```

### Method 2: Global installation

```bash
npm install -g kebab-rename
kebab-rename ./my-folder
```

---

## Usage Examples

### Demo Output

```
$ npx kebab-rename /tmp/my-folder

Scanning...

/tmp/my-folder

  CamelCaseFile.ts    ->  camel-case-file.ts
  IMPORTANT_FILE.md   ->  important-file.md
  My Document.txt     ->  my-document.txt
  Photo (1).jpg       ->  photo-1.jpg
  snake_case_name.py  ->  snake-case-name.py

Found 5 items to rename.

This is preview mode. Add --yes or -y to actually execute the rename.
```

### Common Use Cases

#### "I just want to see what will change"

```bash
npx kebab-rename ./my-folder
```

Default is preview mode, safe to run.

#### "I'm ready to rename!"

```bash
npx kebab-rename ./my-folder --yes
# or shorthand
npx kebab-rename ./my-folder -y
```

#### "Process subdirectories too"

```bash
npx kebab-rename ./my-folder -r -y
```

#### "Only rename image files"

```bash
npx kebab-rename ./my-folder --ext .jpg,.png -y
```

---

## Conversion Rules

| Before | After |
|--------|-------|
| `My Document.txt` | `my-document.txt` |
| `CamelCaseFile.ts` | `camel-case-file.ts` |
| `snake_case_name.py` | `snake-case-name.py` |
| `Photo (1).jpg` | `photo-1.jpg` |
| `IMPORTANT_FILE.md` | `important-file.md` |
| `XMLParser.js` | `xml-parser.js` |
| `Chinese-file.txt` | `Chinese-file.txt` |

---

## CLI Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Actually execute the rename (without it, preview only) |
| `-r, --recursive` | Recursively process subdirectories |
| `-e, --ext <extensions>` | Only process specific extensions, comma-separated (e.g., `.jpg,.png`) |
| `-s, --style <style>` | Target naming style: `kebab` (default) or `camel` |
| `-d, --dry-run` | Preview mode (default behavior, can be omitted) |
| `-h, --help` | Show help |
| `-V, --version` | Show version |

---

## Safety Mechanisms

- **Default preview**: Files are never touched without `--yes`
- **Skip hidden files**: Files starting with `.` are not processed
- **Skip sensitive directories**: `node_modules`, `.git`, `dist`, `build`, etc.
- **Conflict protection**: Automatically adds numeric suffix when target filename exists

---

## Think Hard Mode: kebab-rename-safe

When you need to **execute batch renaming more carefully**, use `kebab-rename-safe`:

```
+======================================+
|     Think Hard Before Rename         |
+======================================+
```

### Features

| Feature | Description |
|---------|-------------|
| **Detailed statistics** | Shows file/directory counts, extension distribution |
| **Auto backup** | Records complete path mapping before execution |
| **Double confirmation** | Requires typing `yes` to execute, prevents accidents |
| **Rollback** | `--undo` can restore the last operation |

### Usage

#### Preview and confirm

```bash
kebab-rename-safe ./my-folder -r
```

Example output:

```
Scanning...
  MyTestFile.txt     ->  my-test-file.txt
  SomeComponent.tsx  ->  some-component.tsx
  MyFolder           ->  my-folder

=== Think Hard: Detailed Analysis ===

Change Statistics:
   Directories: 1
   Files: 2
   Total: 3 items

Extension Distribution:
   .txt: 1
   .tsx: 1

Target Style: kebab-case

Creating backup record...
   Saved to: .kebab-rename-history/2025-12-04_12-00-00.json

About to rename 3 items

Type 'yes' to confirm, or press Enter to cancel:
>
```

#### Use camelCase style

```bash
kebab-rename-safe ./my-folder -r -s camel
```

#### Skip confirmation (still creates backup)

```bash
kebab-rename-safe ./my-folder -r -f
```

#### Rollback last operation

```bash
kebab-rename-safe --undo
```

#### View operation history

```bash
kebab-rename-safe --history
```

### CLI Options (kebab-rename-safe)

| Option | Description |
|--------|-------------|
| `-r, --recursive` | Recursively process subdirectories |
| `-s, --style <style>` | Target naming style: `kebab` (default) or `camel` |
| `-e, --ext <extensions>` | Only process specific extensions, comma-separated |
| `-f, --force` | Skip confirmation and execute directly (still creates backup) |
| `--undo` | Rollback last operation |
| `--history` | Show operation history |
| `-h, --help` | Show help |

### Backup and Rollback Mechanism

- Backups are stored in the `.kebab-rename-history/` directory
- Each execution creates a JSON file recording complete path mappings
- Rollback restores files in depth order to ensure subdirectory files are correctly restored
- History is automatically cleared after successful rollback

---

## License

[MIT](LICENSE)

---

## Author

Tzu-Chao - [tznthou@gmail.com](mailto:tznthou@gmail.com)

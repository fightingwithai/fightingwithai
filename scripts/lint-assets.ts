#!/usr/bin/env npx tsx

import fs from "fs";
import { globSync } from "glob";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";

/**
 * Asset Linter - Detects incorrect asset references that cause 404s in production
 * and enforces image optimization patterns.
 *
 * Common issues this catches:
 * 1. Direct /src/ paths in HTML link tags (should use import statements)
 * 2. Raw <img> tags in .astro files (should use astro:assets <Image>)
 * 3. Markdown/MDX images referencing /public-root assets (prefer <Image>)
 */

const RULES: Record<
  string,
  {
    pattern: RegExp;
    message: string;
    severity: "error" | "warning";
    fix: string;
    include?: RegExp[];
  }
> = {
  "no-src-link-tags": {
    pattern: /<link[^>]*href=["']\/src\/[^"']*["'][^>]*>/gi,
    message:
      "Direct /src/ paths in <link> tags will 404 in production. Use import statements instead.",
    severity: "error",
    fix: 'Move to frontmatter: import "../styles/your-file.css"',
  },
  "no-src-script-tags": {
    pattern: /<script[^>]*src=["']\/src\/[^"']*["'][^>]*>/gi,
    message:
      "Direct /src/ paths in <script> tags will 404 in production. Use import statements instead.",
    severity: "error",
    fix: "Move to frontmatter or use proper module imports",
  },
  "no-raw-img-tags-in-astro": {
    pattern: /<img\s[^>]*>/gi,
    message:
      "Raw <img> tags bypass optimization. Use astro:assets <Image> with imported assets.",
    severity: "error",
    fix: "Import image from src/assets and render with <Image src={asset} ... />",
    include: [/\.astro$/],
  },
  "no-raw-img-tags-in-mdx": {
    pattern: /<img\s[^>]*>/gi,
    message:
      "Raw <img> tags bypass optimization. Use astro:assets <Image> with imported assets.",
    severity: "error",
    fix: "Import image from src/assets and render with <Image src={asset} ... />",
    include: [/\.mdx$/],
  },
  "no-public-images-in-markdown": {
    pattern: /!\[[^\]]*\]\(\/[^)]+\.(?:png|jpe?g|webp|gif)\)/gi,
    message:
      "Markdown references a /public image. This bypasses optimization.",
    severity: "warning",
    fix: "Move image to src/assets, convert to MDX, import it, and use <Image>",
    include: [/\.mdx?$/],
  },
};

type Issue = {
  file: string;
  line: number;
  rule: string;
  message: string;
  severity: "error" | "warning";
  fix: string;
  match: string;
};

class AssetLinter {
  errors: Issue[] = [];
  warnings: Issue[] = [];
  processedFiles = 0;

  async lint(): Promise<void> {
    console.log(`${CYAN}🔍 Asset Reference Linter${RESET}\n`);

    const patterns = [
      "src/**/*.astro",
      "src/**/*.html",
      "src/**/*.jsx",
      "src/**/*.tsx",
      "src/**/*.md",
      "src/**/*.mdx",
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      files.push(...globSync(pattern));
    }

    if (files.length === 0) {
      console.log(`${YELLOW}No files found to lint${RESET}`);
      return;
    }

    console.log(`Found ${files.length} files to check...\n`);

    for (const file of files) {
      await this.lintFile(file);
    }

    this.printResults();
  }

  async lintFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      this.processedFiles++;

      for (const [ruleName, rule] of Object.entries(RULES)) {
        let match: RegExpExecArray | null;
        rule.pattern.lastIndex = 0;

        while ((match = rule.pattern.exec(content)) !== null) {
          if (rule.include && Array.isArray(rule.include)) {
            const included = rule.include.some((re: RegExp) =>
              re.test(filePath)
            );
            if (!included) continue;
          }

          const lineNumber = this.getLineNumber(content, match.index);
          const issue: Issue = {
            file: filePath,
            line: lineNumber,
            rule: ruleName,
            message: rule.message,
            severity: rule.severity,
            fix: rule.fix,
            match: match[0].trim(),
          };

          if (rule.severity === "error") {
            this.errors.push(issue);
          } else {
            this.warnings.push(issue);
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${RED}Error reading ${filePath}: ${message}${RESET}`);
    }
  }

  getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split("\n").length;
  }

  printResults(): void {
    console.log(`\n${CYAN}📊 Results${RESET}`);
    console.log(`Files: ${this.processedFiles}`);
    console.log(`Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}\n`);

    if (this.errors.length > 0) {
      console.log(`${RED}❌ Errors:${RESET}`);
      for (const error of this.errors) {
        console.log(`\n${RED}Error${RESET} in ${error.file}:${error.line}`);
        console.log(`  Rule: ${error.rule}`);
        console.log(`  Issue: ${error.message}`);
        console.log(`  Found: ${YELLOW}${error.match}${RESET}`);
        console.log(`  Fix: ${GREEN}${error.fix}${RESET}`);
      }
      console.log("");
    }

    if (this.warnings.length > 0) {
      console.log(`${YELLOW}⚠️ Warnings:${RESET}`);
      for (const warning of this.warnings) {
        console.log(
          `\n${YELLOW}Warning${RESET} in ${warning.file}:${warning.line}`
        );
        console.log(`  Rule: ${warning.rule}`);
        console.log(`  Issue: ${warning.message}`);
        console.log(`  Found: ${YELLOW}${warning.match}${RESET}`);
        console.log(`  Fix: ${GREEN}${warning.fix}${RESET}`);
      }
      console.log("");
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${GREEN}✅ No asset reference issues found!${RESET}`);
    }

    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

const linter = new AssetLinter();
linter.lint().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${RED}Fatal error: ${message}${RESET}`);
  process.exit(1);
});

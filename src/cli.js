#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const { downloadFolder } = require("./services/githubService");

program
  .name("gigagit")
  .description("Download GitHub repos/folders easily")
  .version("1.0.0");

program
  .command("download")
  .requiredOption("-r, --repo <repo>", "GitHub repository e.g., user/repo")
  .requiredOption("-p, --path <path>", "Folder path inside repo")
  .option("-t, --types <types>", "Comma-separated file types")
  .option("--minSize <minSize>", "Minimum file size in bytes")
  .option("--maxSize <maxSize>", "Maximum file size in bytes")
  .option("-o, --output <output>", "Output zip filename", "output.zip")
  .action(async (options) => {
    try {
      const types = options.types ? options.types.split(",") : null;
      const minSize = options.minSize ? Number(options.minSize) : null;
      const maxSize = options.maxSize ? Number(options.maxSize) : null;

      const buffer = await downloadFolder(options.repo, options.path, { types, minSize, maxSize });
      fs.writeFileSync(path.resolve(options.output), buffer);
      console.log(`✅ Downloaded and saved to ${options.output}`);
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  });

program.parse();

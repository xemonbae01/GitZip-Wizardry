const express = require("express");
const archiver = require("archiver");
const { downloadFolder } = require("../services/githubService");

const router = express.Router();

router.get("/download", async (req, res) => {
  try {
    const repo = req.query.repo;
    const path = req.query.path;
    const types = req.query.types ? req.query.types.split(",") : null;
    const maxSize = req.query.maxSize ? Number(req.query.maxSize) : null;
    const minSize = req.query.minSize ? Number(req.query.minSize) : null;

    const zipBuffer = await downloadFolder(repo, path, { types, maxSize, minSize });

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${repo.replace("/", "_")}.zip"`
    });

    res.send(zipBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/multiDownload", async (req, res) => {
  try {
    const repoList = req.query.repos.split(",");
    const pathList = req.query.paths.split(",");

    const types = req.query.types ? req.query.types.split(",") : null;
    const maxSize = req.query.maxSize ? Number(req.query.maxSize) : null;
    const minSize = req.query.minSize ? Number(req.query.minSize) : null;

    const archive = archiver("zip", { zlib: { level: 9 } });
    const bufferChunks = [];

    archive.on("data", (data) => bufferChunks.push(data));

    for (const repo of repoList) {
      for (const path of pathList) {
        const zip = await downloadFolder(repo, path, { types, maxSize, minSize });
        archive.append(zip, { name: `${repo.replace("/", "_")}_${path}.zip` });
      }
    }

    await archive.finalize();

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=multi_download.zip"
    });

    res.send(Buffer.concat(bufferChunks));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
    

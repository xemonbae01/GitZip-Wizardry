const express = require("express");
const path = require("path");
const githubRouter = require("./routes/github");

const app = express();

app.use(express.json());

app.use("/api/github", githubRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../tetroxide/ui.html"));
});

app.use("/static", express.static(path.join(__dirname, "../tetroxide")));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Git Down backend running on port ${PORT}`);
});

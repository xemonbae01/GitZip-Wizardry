const express = require("express");
const path = require("path");
const githubRouter = require("./routes/github");

const app = express();

app.use(express.json());

app.use("/api/github", githubRouter);

app.use("/static", express.static(path.join(__dirname, "tetroxide")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "tetroxide/ui.html"));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "tetroxide/404.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Git Down backend running on port ${PORT}`);
});

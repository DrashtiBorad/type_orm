import "reflect-metadata";
import express from "express";
const app = express();
const port = 3003;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server started Successfully." });
});

app.listen(port, () => {
  console.log(`server started at ${port}`);
});

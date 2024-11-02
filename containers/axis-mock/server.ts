import * as path from "node:path";

import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 6001;

// Axis camera credentials (for simulation purposes)
//const axisUsername = process.env.AXIS_USERNAME ?? "alveus";
//const axisPassword = process.env.AXIS_PASSWORD ?? "secret";

// Middleware to check authentication
//app.use((req, res, next) => {
//  const auth = req.headers["authorization"];
//  if (!auth) {
//    res.status(401).json({ error: "Unauthorized" });
//    return;
//  }
//
//  const [username, password] = Buffer.from(String(auth.split(" ")[1]), "base64")
//    .toString()
//    .split(":");
//  if (username !== axisUsername || password !== axisPassword) {
//    res.status(401).json({ error: "Unauthorized" });
//    return;
//  }
//
//  next();
//});

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

app.get("/axis-cgi/com/ptz.cgi", (req, res) => {
  console.log("PTZ request ", req.query);

  const query = req.query.query;
  if (query === "position") {
    // Mock response with PTZ values
    res.send(`pan=0\ntilt=0\nzoom=0\nautofocus=on\nfocus=0\nbrightness=0`);
    return;
  }

  res.status(400).send("Invalid query");
});

// Mock endpoint for image
app.get("/axis-cgi/jpg/image.cgi", (req, res) => {
  const imagePath = path.join(__dirname, "mock-image.jpg"); // Adjust path if necessary
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Failed to send image:", err);
      res.status(500).end();
      return;
    }

    console.log("Image sent successfully");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Mock Axis server running at http://localhost:${port}`);
});

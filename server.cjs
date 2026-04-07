const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 8080;

// ================= HOME =================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>subussy</title>

<style>
body {
  margin: 0;
  overflow: hidden;
  font-family: monospace;
  background: black;
  color: #00ff00;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
  max-width: 600px;
}

h1 {
  font-size: 52px;
  text-shadow: 0 0 15px #00ff00;
}

input {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #00ff00;
  background: black;
  color: #00ff00;
}

button {
  margin-top: 12px;
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: #00ff00;
  color: black;
  cursor: pointer;
}

button:hover {
  box-shadow: 0 0 15px #00ff00;
}

a {
  color: #00ff00;
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  border: 1px solid #00ff00;
  border-radius: 10px;
  text-decoration: none;
}
</style>
</head>

<body>

<canvas id="matrix"></canvas>

<div class="container">
  <h1>subussy</h1>

  <form method="GET" action="/proxy">
    <input name="url" placeholder="Enter URL (example.com)">
    <button type="submit">Enter</button>
  </form>

  <a href="/apps">Open Apps</a>
</div>

<script>
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) drops[i] = 1;

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#00ff00";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(draw, 33);
</script>

</body>
</html>
  `);
});

// ================= APPS =================
app.get("/apps", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Apps</title>

<style>
body {
  margin: 0;
  font-family: monospace;
  background: black;
  color: #00ff00;
  text-align: center;
}

h1 {
  margin-top: 30px;
  font-size: 42px;
  text-shadow: 0 0 15px #00ff00;
}

.grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin: auto;
}

.app {
  width: 130px;
  margin: 15px;
  padding: 15px;
  border: 1px solid #00ff00;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;
}

.app:hover {
  box-shadow: 0 0 20px #00ff00;
  transform: scale(1.08);
}

.app img {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}

a {
  color: #00ff00;
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  border: 1px solid #00ff00;
  border-radius: 10px;
  text-decoration: none;
}
</style>
</head>

<body>

<h1>Apps</h1>

<div class="grid">

  <div class="app" onclick="go('https://www.youtube.com')">
    <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png">
    <div>YouTube</div>
  </div>

  <div class="app" onclick="go('https://discord.com')">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png">
    <div>Discord</div>
  </div>

  <div class="app" onclick="go('https://www.nvidia.com/geforce-now')">
    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968705.png">
    <div>GeForce</div>
  </div>

  <div class="app" onclick="go('https://poki.com')">
    <img src="https://cdn-icons-png.flaticon.com/512/833/833314.png">
    <div>Poki</div>
  </div>

  <!-- YOUR CUSTOM APP -->
  <div class="app" onclick="go('https://sites.google.com/view/ultimatetestgame/primary')">
    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png">
    <div>Subussy Games</div>
  </div>

</div>

<a href="/">← Back</a>

<script>
function go(url) {
  window.location.href = "/proxy?url=" + url;
}
</script>

</body>
</html>
  `);
});

// ================= PROXY (UNCHANGED CORE) =================
app.get("/proxy", async (req, res) => {
  let url = req.query.url;

  if (!url) return res.send("No URL");

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  try {
    const response = await fetch(url);
    let text = await response.text();

    text = text.replace(/(href|src)="\/(.*?)"/g, (match, attr, path) => {
      return attr + '="/proxy?url=' + url + '/' + path + '"';
    });

    res.send(text);
  } catch (err) {
    res.send("Error loading site: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
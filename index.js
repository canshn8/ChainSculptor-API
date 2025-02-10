const express = require("express");
const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("deneme");
});

// Sunucuyu başlat ve hata kontrolü yap
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
    console.error("❌ Server error:", err.message);
});

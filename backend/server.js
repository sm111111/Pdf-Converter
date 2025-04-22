const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


const _dirname = path.resolve()


const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `pdf-${Date.now()}.pdf`);
    },
});

const upload = multer({ storage });


app.post("/upload", upload.single("pdf"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file found" });
    }

    res.json({ message: "File uploaded successfully", filePath: req.file.path });
});


app.get("/upload/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});


app.get("/uploads", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read uploads" });
        }
        res.json({ files });
    });
});

app.use(express.static(path.join(_dirname, "/frontend/dist")))

app.get('*', (req, res) => {
    res.send(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

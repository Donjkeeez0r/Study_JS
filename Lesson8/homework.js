const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3000;

const MIME_TYPES = {
    ".html": "text/html",
    "css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpeg": "image/jpeg",
    ".json": "application/json",
    ".mp4": "video/mp4",
}

const server = http.createServer((request, response) => {
    let url;

    if (request.url === '/') {
        url = "/index.html";
    } else {
        url = request.url;
    };

    const filePath = path.join(__dirname, "public", url);

    const extname = path.extname(filePath);

    const contentType = MIME_TYPES[extname] || "text/plain";

    const fileStream = fs.createReadStream(filePath);

    response.setHeader("Content-Type", contentType);

    fileStream.pipe(response);

    fileStream.on("error", (err) => {
        response.statusCode = 404;
        response.end();
    });
});

server.listen(PORT);
console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
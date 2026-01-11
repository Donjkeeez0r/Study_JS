// //Lesson 8

// const path = require("node:path");

// // используем без promise для доступа к Stream
// const fs = require("node:fs");

// // Создаем читающий поток через createReadStream, 
// // в скобках указываем путь к файлу, 
// // второй - объект
// // highWaterMark - кусочек файла (указывем на сколько кусков разбивается файл)
// const stream = fs.createReadStream(
//     path.join(__dirname, "big.txt"),
//     {
//         // читаем по 1 Кб
//         // зависит от ресурсов, с которыми работаем
//         highWaterMark: 1024
//     }
// );

// let counter = 0;

// // читаем наши куски (чанки)
// // привязываемся к событию 
// // (в скобках название события на которое подписываемся)
// // chunk - данные, которые присылаются в событии
// // data вызывается пока обрабатывается файл
// stream.on('data', (chunk) => {
//     counter++;
//     console.log(`Получен кусок #${counter}`);
//     console.log(chunk);
//     console.log(`Размер ${chunk.length} байт`);
// });

// // файл закончился
// stream.on("end", () => {
//     console.log(`Чтение файла завершено. Всего кусков: ${counter}`);
// });


// сервер который будет отдавать файлы
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3000;

// словарь для сервера, объект с полями ключ-значение
const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".json": "application/json",
    ".mp4": "video/mp4",
};

const server = http.createServer((request, response) => {
    // определение запроса 
    console.log(`Запрос: ${request.url}`);

    let url;

    if (request.url === '/') {
        url = "/index.html";
    } else {
        url = request.url;
    }

    // формируем путь к файлу на диске
    const filePath = path.join(__dirname, "public", url);

    // определяем расширение файла (.html, .css, ...)
    const extname = path.extname(filePath);

    // вывод расширения файла
    console.log(extname);

    // формирование правильного заголовка (автоматически)
    const contentType = MIME_TYPES[extname] || "text/plain";

    console.log(contentType);

    // создание потока чтения наших файлов
    const fileStream = fs.createReadStream(filePath);

    // сразу ставим правильный заголовок
    response.setHeader("Content-Type", contentType);

    // создание крана, который соединяет озеро и кран
    // из озера берем информацию и даем эту информацию пользователю
    fileStream.pipe(response);

    // обрабатываем ошибки
    fileStream.on('error', (err) => {
        response.statusCode = 404;
        response.end();
    })
});

server.listen(PORT);
console.log(`Сервер был запущен на адресе http://localhost:${PORT}`);
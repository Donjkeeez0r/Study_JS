//Lesson7

// импорт модуля
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs/promises');

// __dirname - показывает путь к исполняемому файлу
// "..." - составляет правильный путь к файлу index.html
// const fullPath = path.join(__dirname, "index.html");

// console.log(fullPath);


const PORT = 3000;

// стрелочная функция, которая отправляет страницы
const sendFile = async (fileName, response, statusCode) => {
    const fullPath = path.join(__dirname, "public", `${fileName}.html`);

    // страница
    const page = await fs.readFile(fullPath, 'utf-8');

    response.statusCode = statusCode;
    response.end(page);
};


const server = http.createServer(async (request, response) => {
    //делаем html-хедер для страницы
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // изменяемая переменная для страниц
    //let filePath;

    // страницы сайта
    if (request.url === '/') {
        // путь к файлу index через директорию public
        //filePath = path.join(__dirname, "public", "index.html");
        await sendFile("index", response, 200);
    } else if (request.url === '/about') {
        //filePath = path.join(__dirname, "public", "about.html");
        await sendFile("about", response, 200);
    } else {
        //filePath = path.join(__dirname, "public", "404.html");
        await sendFile("404", response, 404);
        //response.statusCode = 404;
    }

    // читаем файл
    //const fileContent = await fs.readFile(filePath, 'utf-8');

    // возвращаем звпрос, т.е. результат
    //response.end(fileContent);

});

server.listen(PORT);
console.log(`Сервер был запущен по адресу http://localhost:${PORT}`);





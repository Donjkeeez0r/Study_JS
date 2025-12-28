//Lesson 6. Первый http сервер

// импортируем модуль http для сервера
const http = require("http");

// переменная для порта
const PORT = 3000;



// создание сервера
// const server = http.createServer((request, response) => {
//     // request - письмо от браузера (запрос)
//     // response - бланк для нашего ответа  (ответ на запрос от браузера)
    
//     console.log("Кто-то зашел к нам на сервер");
    
//     // вывод запроса, метода и адреса
//     console.log(request.method, request.url);

//     // формируем response (ответ)
//     // writeHead - функция, которая принимает в себя статус-код и статус-месседж
//     // charset - для русского языка
//     response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

//     // формируем body (тело) для ответа
//     // записали, что мы конкретно возвращаем (ответ от сервера)
//     response.write("Привет, это мой первый сервер на Node.js");
    
//     // заканчиваем наш ответ, отдаем его браузеру и клиенту
//     response.end();
// });


const server = http.createServer(async (request, response) => {
    // ставим заголовок к нашему ответу для запроса клиента
    // первый аргумент -> Content-Type -> название заголовка (хедера)
    // второй аргумент -> значение этого заголовка
    response.setHeader("Content-Type", "text/plain; charset=utf-8");


    if (request.url === '/') {
        // главная страница сайта
        response.statusCode = 200;

        // возвращаем контент клиенту
        response.write("Главная страница сайта");

        // чтобы сервер не завис и клиент получил ответ
        response.end();
    } else if (request.url === '/about') {
        // страница о нас
        response.statusCode = 200;
        response.write("Это стартовая страница нашего файлообменника");
        response.end();
    } else if (request.url === '/stats') {
        // получаем данные через fetch у API
        const data = await fetch("https://gusic.xyz/");

        // для обработки JSON объект через json (разархивируем данные из JSON)
        const jsonData = await data.json();

        // если будут другие данные, например json, пищем опять контент
        response.setHeader("Content-Type", "application/json; charset=utf-8");

        response.statusCode = 200;

        //response.write(`Запрос успешно был выполнен и мы получили кол-во серверов: ${jsonData.servers}`);
        
        // выводим уже сам объект JSON, переводя его в строку через stringify
        response.write(JSON.stringify(jsonData));
        response.end();
    } else {
        response.statusCode = 404;
        response.write("Такой страницы не существует");
        response.end();
    }
});


// запуск сервера, передаем порт через listen
server.listen(PORT);
console.log("Сервер был успешно запущен");
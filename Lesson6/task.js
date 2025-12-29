const http = require("http");
const PORT = 3000;

const server = http.createServer((request, response) => {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");

    if (request.url === "/") {
        response.statusCode = 200;
        response.write("Привет, меня зовут Даниил.\n");
        response.write("Мой гитхаб - https://github.com/Donjkeeez0r");
        response.end();
    } else if (request.url === "/api/info") {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json; charset=utf-8");

        const JSONstring = {
            "serverName": "MyPC",
            "version": "1.0.0",
            "status": "working",
        };

        response.write(JSON.stringify(JSONstring));
        response.end();
    } else {
        response.statusCode = 404;
        response.write("Такой страницы не существует");
        response.end();
    }
});

server.listen(PORT);
console.log("Сервер запущен!");
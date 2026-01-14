// Lesson9
const http = require("node:http");
const PORT = 3000;

const server = http.createServer(async (request, response) => {

    // обработка GET запроса (то есть получаем главную страницу)
    if (request.method === 'GET' && request.url === '/') {
        
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = 200;
        
        // создаем форму
        // отдаем POST запрос 
        response.end(`
            <form action="/save" method="POST">
                <input name="username" placeholder="Ваше имя" />
                <button type="submit">Отправить</button>
            </form>    
        `);
    }

    // обработка метода POST и страницы /save
    // обработка нажатие кнопки на страницу /index
    else if (request.method === 'POST' && request.url === '/save') {
        // массив для хранения chunk
        const body = [];

        // получаем кусочки
        // событие data - получение данных из формы
        // данные делятся на чанки (кусочки), которые потом склеются
        request.on('data', (chunk) => {
            body.push(chunk);
            //console.log(`Прилетел кусочек данных: ${chunk}`);
        });

        request.on('end', () => {
            
            // работаем с буффером
            // соединяем в один список наш массив, этот массив потом можем превратить в строку

            // Пример:
            // chunk1 + chunk2 ... хранятся в body=[chunk1, chunk2, ...]
            // для соединения chunk в одну строку -> concat + toString
            const parsedBody = Buffer.concat(body).toString('utf-8');

            // декодируем информация
            const decodedString = decodeURIComponent(parsedBody);

            // работаем со страницой
            // изменяем страницу с данными, которые отправили
            // пример (при отправки данных, открывается другая страница)
            console.log(`Полное тело запроса: ${decodedString}`);

            response.setHeader('Content-Type', 'text/plain; charset=utf-8');
            response.statusCode = 200;

            response.end(`Данные получены. Вы прислали: ${decodedString}`);
        });
    }
    // работа с API
    else if (request.method === 'GET' && 
        (request.url === '/servers' || request.url === '/users')) {
        
        const data = await fetch('https://gusic.xyz/stats');

        // из JSON достаем объект
        const jsonData = await data.json(); // { servers: ..., users: ... }
        
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = 200;

        if (request.url === '/servers') {
            response.end(
                `<h1>Количество серверов на данный момент ${jsonData.servers}</h1>`
            );
        } else if (request.url === '/users') {
            response.end(`
                <h1>Количество пользователей на данный момент ${jsonData.users}</h1>`
            );
        }
    }
});

server.listen(PORT);
console.log(`Сервер был запущен по адресу http://localhost:${PORT}`);
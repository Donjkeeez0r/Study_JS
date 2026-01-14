const http = require("node:http");
const PORT = 3000;

const server = http.createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/') {
        
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = 200;

        response.end(`
            <form action="/save" method="POST">
                <input name="username" placeholder="Ваше имя" />
                <button type="submit">Отправить</button>
            </form>    
        `);
    } else if (request.method === 'GET' && request.url === '/weather') {
        const data = await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=20.28&current_weather=true');
        const jsonData = await data.json();

        //console.log(`Данные в jsonData:`, jsonData);

        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = 200;

        response.end(`
            <p>Текущая температура в Белграде: ${jsonData.current_weather.temperature} градуса.</p>
            <p>Текущая скорость ветра в Белграде: ${jsonData.current_weather.windspeed} м.с.</p>
        `);
    } else if (request.method === 'POST' && request.url === '/save') {
        const body = [];

        request.on('data', (chunk) => {
            body.push(chunk);
        })

        request.on('end', () => {

            const parsedBody = Buffer.concat(body).toString('utf-8');
            const decodedBody = decodeURIComponent(parsedBody);


            console.log(`Тело запроса: ${decodedBody}`);
            response.setHeader('Content-Type', 'text/plain; charset=utf-8');
            response.statusCode = 200;
            response.end(`Данные получены. Вы прислали - ${decodedBody}`);
        })
    }
});

server.listen(PORT);
console.log(`Сервер был запущен по адресу: http://localhost:${PORT}`);
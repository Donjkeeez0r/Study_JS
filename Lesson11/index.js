const path = require("node:path");
const http = require("node:http");
const fs = require("node:fs/promises");

const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, "public", "uploads");

// 

// Верхняя булка: Граница (Boundary) и Заголовки (Имя файла, тип).
// Начинка: Сама картинка (файл) - бинарные данные
// Нижняя булка: Граница конца
// Комбинация символов для работы с пустой строкой - \r\n\r\n

const sendFile = async (filePath, response, contentType) => {
    try {
        // читаем путь к нашему файлу
        const data = await fs.readFile(filePath);

        // ставим Content-Type через setHeader
        response.setHeader("Content-Type", contentType);
        response.statusCode = 200;

        // отправляем запрос
        response.end(data);
    } catch (err) {
        response.statusCode = 404;
        response.end("Not Found");
    }
};

const server = http.createServer(async (request, response) => {
    // Разрешаем CORS (механизм безопасности) и JSON (для удобства)
    // Отключение фильтрация нашего файла
    // Доверие нашему сайту и разрешение читать файлы
    response.setHeader("Access-Control-Allow-Origin", "*"); // для работы с файлами

    // 1. ОТДАЕМ HTML (Главная страница)
    if (request.method === 'GET' && request.url === '/') {
        await sendFile(
            path.join(__dirname, "public", "index.html"), 
            response, 
            "text/html; charset=utf-8"
        );
    }

    // 2. API: СПИСОК ФАЙЛОВ (получение файлов из папки)
    else if (request.method === 'GET' && request.url === '/api/files') {
        try {
            // Читаем папку uploads
            // recursive - создание папки, если ее нет
            await fs.mkdir(UPLOAD_DIR, { recursive: true });

            // читаем директорию
            const files = await fs.readdir(UPLOAD_DIR);
            

            // файлы которые в нашей папке, отдаем их в JSON
            response.setHeader("Content-Type", "application/json");

            // переводим JSON к строке и передаем все файлы которые в папке
            response.end(JSON.stringify(files));
        } catch (err) {
            response.statusCode = 404;
            response.end(JSON.stringify({ error: "Ошибка чтения папки" }));
        }
    }

    // 3. СКАЧИВАНИЕ ФАЙЛОВ (Отдача статики из uploads)
    else if (request.method === 'GET' && request.url.startsWith('/uploads/')) {
        // url выглядит как /uploads/видео.mp4
        
        // decodeURI - декодируем URL (чтобы русские буквы работали)
        // replace(ищем для замены, на что заменить)
        // достаем только название файла (video.mp, text.txt, ...)
        const fileName = decodeURI(request.url.replace('/uploads/', '')); 

        // получаем путь к нашему файлу на пк
        //home/user/Lesson11/public/uploads/video.mp4
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // отправляем файл на загрузку
        await sendFile(filePath, response, "application/octet-stream");
    }

    // 4. ЗАГРУЗКА ФАЙЛА
    else if (request.method === 'POST' && request.url === '/upload') {
        console.log("Загрузка файла...");
        
        // массив для чанков
        const chunks = [];
        
        // подписываемся на 'data' и в этом ивенте объединяем все чанки
        request.on('data', (chunk) => chunks.push(chunk));
        
        // когда файл загружен (ивент end)
        request.on('end', async () => {
            // объединяем буффер по кусочкаи (склеимвание всего буффера в один файл)
            // здесь хранится целый файл
            const fullBuffer = Buffer.concat(chunks);

            // Достаем имя и расширение файла из буффера: 
            
            // обращаемся к запросу который пришел от браузера
            // headers - заголовки, которые браузер отправил нам (хранятся в объекте)
            // boundary - граница откуда файл начинается
            // WebKit - инструмент обработки файла (браузер делает)
            // значения после webkit - индивидуальные значения каждого файла
            
            // contentType придет в таком виде: multipart...; boundary=----WebKit...Tg34gfczx
            const contentType = request.headers['content-type']; 

            // если файл не содержит contentType или отсутствует boundary -> ошибка
            if (!contentType || !contentType.includes('boundary=')) {
                response.statusCode = 400;
                return response.end("Нет boundary");
            }

            // собираем файл из буффера:

            // 1. получили границу из буффера (split разбивает строку на 2 элемента)
            // разбиваем после ключевого значения (boundary)
            // boundary = [multipart..., ----WebKit....] -> 
            // берем только 1 элемент (обращаемся только к WebKit) -> 
            // добавляем (--) всегда для работы с файлом, это отделение
            // в итоге boundary = ----WebKit...
            const boundary = Buffer.from(`--${contentType.split('boundary=')[1]}`);
            
            // 2. получаем буфферное значение из набора символов для работы с пустой строкой
            // создаем буффер из комбинации (что будем вырезать)
            const doubleNewline = Buffer.from('\r\n\r\n'); // переводим строку в формат буффера

            // Пример функции Buffer.from()
            // Buffer { 0x, 6f, 7e} !== '\r\n\r\n'
            // Buffer { 0x, 6f, 7e} === Buffer { 0x, 6f, 7e}


            // 3. возвращаем индекс, на котором месте находится doubleNewline
            const headersEndIndex = fullBuffer.indexOf(doubleNewline);
            
            if (headersEndIndex === -1) return response.end("Ошибка парсинга");
            

            // Достаем имя файла из полного буффера
            // subarray - обрезает от 1 числа (включительно) до 2 числа (не включительно)
            // headersSection - обрезаем все лишнее (структуру файла) и 
            // получаем первые 3 строки из полного буффера (название и расширение файла)
            const headersSection = fullBuffer.subarray(0, headersEndIndex).toString();
            
            // через регулярное выражение ищем название файла
            // fileNameMatch - массив, который хранит
            // 1 - то что нашел
            // 2 - то что нужно вырезать (имя файла)
            // 3 - остальное
            const fileNameMatch = headersSection.match(/filename="(.+?)"/);

            // получаем только имя файла
            // защита пути через basename -> 
            // возвращает путь к нашему файлу одинаково для всех систем
            const originalName = path.basename(fileNameMatch[1]); 

            // Достаем тело:
            // + 4 так как пустая строка весит 4 байта
            const fileStart = headersEndIndex + 4;

            // boundary - буффер из браузера который мы получили
            // ищем начало следующей границы нашего файла
            // index0f - ищем boundary, начиная с индекса fileStart
            const fileEnd = fullBuffer.indexOf(boundary, fileStart);

            // обращаемся к полному буфферу
            // достаем тело нашего файла (обрезали начало и конец заголовка)
            const fileData = fullBuffer.subarray(fileStart, fileEnd - 2);

            // Сохраняем
            try {
                // создаем папку, если она не создана
                await fs.mkdir(UPLOAD_DIR, { recursive: true });

                // загружаем в папку наш файл
                // путь файла - home/user/Lesson11/public/uploads/name.txt
                // fileData - начинка самого файла
                await fs.writeFile(path.join(UPLOAD_DIR, originalName), fileData);
                
                response.statusCode = 200;
                response.end("Сохранено");
            } catch (err) {
                console.error(err);
                response.statusCode = 500;
                response.end("Ошибка сохранения");
            }
        });
    } 
    
    // 5. УДАЛЕНИЕ ФАЙЛА
    else if (request.method === 'DELETE' && request.url.startsWith('/api/files/')) {
        // url выглядит как /api/files/video.mp4
        // basename(request.url) -> video.mp4.
        // ЗАЩИТА: Оставляем только имя, убираем слэши и точки
        const safeFileName = path.basename(request.url);

        // получаем директорию нашего файла
        const filePath = path.join(UPLOAD_DIR, safeFileName);

        try {
            // fs.unlink - это команда "Удалить файл"
            await fs.unlink(filePath);
            
            response.statusCode = 200;
            response.end("Файл удален");
        } catch (err) {
            console.error(err);
            // Если файла нет или ошибка доступа
            response.statusCode = 404;
            response.end("Ошибка удаления файла");
        }
    } else {
        response.statusCode = 404;
        response.end("Ничего не найдено");
    }
});

server.listen(PORT);
console.log(`Сервер был запущен по адресу - http://localhost:${PORT}`)
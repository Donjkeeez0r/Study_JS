//Lesson 5


/*
wait - функция
ms - аргумент (через скок мс выполнится функция)
возвращаем Promice - класс, который принимает функцию resolve
resolve - функция, которую вызовет Promice после тайм-аута
Promice - оболочка, которая ждет ответа от нас
*/

// это просто имитация задержки, чтобы понять await
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processFile = async () => {
    try {
        console.log("Загрузка...");

        // ждем выполнение функции resolve, а resolve выполнится после тайм-аута 
        await delay(2000);

        console.log("Подключение к БД");

        await delay (3000);

        // создание ошибки
        const dataBase = "Connected";

        if (dataBase !== "disConnected") {
            throw new Error("БД не подключена!");
        }

        console.log("Успех!");
    
    // обработчик ошибок
    } catch (error) {
        console.log(error);
    }
};

processFile();



/*
name - название файла
size - размер файла
Promice - класс - обещание что мы что-то вернем, после того, как что-то выполнится
*/

// сами создаем задержку, так будет редко
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// функция по обращению к сервису (вместо искусственной задержки)
// import { request } from "undici";

// const getData = async () => {
    
//     // благодаря await мы ждем, пока получим результат await, и только потом мы сможем с этими данными работать
//     const data = await request("https://youtube.com/video/124543435"); // получим данные (просмотры, лайки и тд)
    

// }




/*

const uploadFile = async (name, size) => {
    console.log(`Началась загрузка файла: ${name} (${size} MB)`);

    // искусственная задержка
    await delay(size * 10);

    /* 
    Как будет в будущем:
    1) http-api-request -> задержка по пингу
    2) после получения результата
    3) const data = await request('https://...')
    4) после этого будем работать с данными, которые мы получили


    console.log(`Файл был загружен`);
};

// функция загружает файлы по очереди, т.е. сначала Cat.jpg, затем Dog.png
// const runCloud = async () => {
//     console.log("Облако было запущено!");

//     await uploadFile("Cat.jpg", 200);
//     await uploadFile("Dog.png", 500);

//     console.log("Загрузка завершена.");
// };


// загрзука начинается одновременно
const runCloud = async () => {
    console.log("Облако было запущено!");

    // all - функция, которая принимает массив, в который мы записываем элементы, которые хотим загрузить
    // файлы будут скачиваться ассинхроно (паралелльно)
    await Promise.all(
        [
            uploadFile("Cat.jpg", 200), 
            uploadFile("Dog.png", 500)
        ]
    );

    console.log("Загрузка завершена.");
};

runCloud();*/



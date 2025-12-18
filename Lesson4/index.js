// Lesson 4

/* Разница между function и стрелочными функциями
const user = {
    
    // методы объекта
    name: "Alex",
    
    // функция внутри объекта 
    // (будет undefined, из-за того что function берет свое окружение)
    sayHiStandart: function() {
        setTimeout(function() {
            console.log(this.name);
        }, 1000);
    },


    sayHiArrow: function() {
        setTimeout(() => {
            console.log(this.name);
        }, 1000);
     }

};

user.sayHiStandart();
user.sayHiArrow();*/


// const formatSize = (bytes) => {
//     if (bytes < 1024) {
//         return `${bytes} B`;
//     }

//     const mbytes = (bytes / 1024 / 1024).toFixed(2);

//     return `${mbytes} MB`;
// };

// const filesSize = [500, 500000000, 5000000];

// for (const fileSize of filesSize) {
//     console.log(formatSize(fileSize));
// };


// const usdToRub = (usd) => {

//     const odd = (a, b) => a * b;

//     if (usd > 300) {
//         return odd(usd, 85);
//     } else if (usd > 1000) {
//         return odd(usd, 90);
//     }

//     return odd(usd, 80);
// }

// console.log(usdToRub(1001));

/*
Проверить возвраст участника внутри функции, если 
возраст больше 18, то вернуть строку, что человек совершеннолетний
иначе вернуть строку что человек еще маленький
*/

const checkAge = (age) => {
    if (age >= 18) {
        console.log("Человек совершеннолетний");
    }
    else {
        console.log("Человек не совершеннолетний.");
    }
};


checkAge(21);
checkAge(15);


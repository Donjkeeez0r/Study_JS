const usdToRub = (usd) => {
    
    if (usd > 1000) {
        return `Внесено ${usd} в usd.` + ` Получено ${usd * 90} в rub.` + ` По курсу 90`;
    } else if (usd > 100) {
        return `Внесено ${usd} в usd.` + ` Получено ${usd * 85} в rub.` + ` По курсу 85`;
    }
    
    return `Внесено ${usd} в usd.` + ` Получено ${usd * 80} в rub.` + ` По курсу 80`;
};

console.log(usdToRub(101));
console.log(usdToRub(1001));
console.log(usdToRub(50));

console.log("");

const euroToRub = (euro) => {

    if (euro > 1000) {
        return `Внесено ${euro} в euro.` + ` Получено ${euro * 100} в euro.` + ` По курсу 100`;
    } else if (euro > 500) {
        return `Внесено ${euro} в euro.` + ` Получено ${euro * 97} в euro.` + ` По курсу 97`;
    }

    return `Внесено ${euro} в euro.` + ` Получено ${euro * 94} в euro.` + ` По курсу 94`; 
}

console.log(euroToRub(1001));
console.log(euroToRub(501));
console.log(euroToRub(32));

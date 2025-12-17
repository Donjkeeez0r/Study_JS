const pinCodes = ["1111", "5678", "1234", "9999", "543654", "33544"];
const myPin = "1234";

for (const pin of pinCodes) {
    if (myPin === pin) {
        console.log("Пин-код найден!");
        break;
    }
    else {
        console.log("Неверный пин.");
    }
};

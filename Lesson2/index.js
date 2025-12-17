let totalPrice = 5000;
let accountBalance = 4000;
const isVip = false;

if (isVip) {
    totalPrice *= 0.9
}

if (accountBalance >= totalPrice) {
    console.log("Успешно! Покупка сделана");
} else {
    console.log("Недостаточно средств");
}
function getOrderNumber() {
    const now = new Date()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    let orderCode = now.getFullYear().toString() + month.toString() + day + hour;
    return orderCode;
}

console.log(getOrderNumber());
console.log('123123123'.slice(0,6));



quantidade = document.getElementById("quantity");

function add() {
    console.log(quantidade.value, "valur");
    number = parseInt(quantidade.value)+1;
    number > 9 ? number = 9: number=number;
    quantidade.value = number;
}

function less() {
    console.log(quantidade.value, "valur");
    number = parseInt(quantidade.value)-1;
    if (number < 1) {
        number = 1;
    }
    quantidade.value = number;
}

document.getElementById("plus_btn").onclick = add;
document.getElementById("less_btn").onclick = less;
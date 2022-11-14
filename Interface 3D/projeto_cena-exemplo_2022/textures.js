var textures = ["models/textures/Wood028_2K_Color.png", "models/textures/wood1.jpg", "models/textures/wood2.jpg"]
console.log("txt0: ", sessionStorage.getItem("texture"));

document.getElementById("texture_0").onclick = function () {
    sessionStorage.setItem("texture", 0);
    console.log(0);
}

document.getElementById("texture_1").onclick = function () {
    sessionStorage.setItem("texture", 1);
    console.log(1);
}

document.getElementById("texture_2").onclick = function () {
    sessionStorage.setItem("texture", 2);
    console.log(2);
}
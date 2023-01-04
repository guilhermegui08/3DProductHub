light_dark_switch = document.getElementById("darkModeSelector");

var darkMode = sessionStorage.getItem("darkMode");
if (darkMode == null) {
    darkMode = false;
    sessionStorage.setItem("darkMode", darkMode);
} else {
    darkMode = darkMode == "true";
}
light_dark_switch.checked = darkMode;

checkDarkMode();

document.onkeydown = function(e) {
    var key_press = e.key;
    if (key_press == "d") {
        light_dark_switch.checked = !light_dark_switch.checked;
        reverseDarkMode();
        //alert("rever")
    }
}

light_dark_switch.onclick = function() {
    reverseDarkMode();
    return 0;
  }

  function reverseDarkMode() {
    console.log("reversing");
    if (!light_dark_switch.checked) {
        darkMode = false;    
    } else {
        darkMode = true;
    }   
    checkDarkMode();
    
}

function checkDarkMode() {
    console.log("dark_mode: ", darkMode);
    sessionStorage.setItem("darkMode", darkMode);
    btns = document.getElementsByTagName('button');
    console.log(btns);
    var btns = [document.getElementById("texture_0"), document.getElementById("texture_1"), document.getElementById("texture_2")];
    var products = []

    if (darkMode) {
        var text_color = "#fff";
        var backgroundColor = "#586062";
        var btn_color = "#a1b1a7";
        var header = "assets/imagens/header_dark.svg";
        var page = "assets/imagens/page_dark.svg";
        var prodct1 = "assets/imagens/product1_dark.svg";
        for(var i = 0; i < 6; i++) {
            products.push("assets/imagens/product" + (i+1) + "_dark.svg");
        }
        document.getElementById("sun").style.fill = "rgb(161, 177, 167)";
        document.getElementById("moon").style.fill = "rgb(161, 177, 167)";
    } else {
        var text_color = "#000";
        var backgroundColor = "#EAE7D6";
        var btn_color = "#436e99";
        var header = "assets/imagens/header.svg";
        var page = "assets/imagens/page.svg";
        var prodct1 = "assets/imagens/product1.svg";
        for(var i = 0; i < 6; i++) {
            products.push("assets/imagens/product" + (i+1) + ".svg");
        }
        document.getElementById("sun").style.fill = "rgb(67, 110, 153)";
        document.getElementById("moon").style.fill = "rgb(67, 110, 153)";
    }
    document.getElementById("header").src = header;
    document.getElementById("body").style.backgroundColor = backgroundColor;
    document.getElementById("body").style.color = text_color;
    document.getElementById("page").src = page;
    for(var i = 0; i < 6; i++) {
        document.getElementById("produto"+(i+1)).src = products[i];
    }
}

function setDay() {
    darkMode = false; //a função checkDarkmode vai inverter
    checkDarkMode();
}

function setNight() {
    darkMode = true; //a função checkDarkmode vai inverter
    checkDarkMode();
}
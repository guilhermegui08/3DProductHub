document.getElementById("btn_pos_inicial").onclick = function() {
    camera.position.x = -5;
    camera.position.y = 8;
    camera.position.z = 13;
    camera.lookAt(0,2,0);
}


document.getElementById("btn_frente").onclick = function() {
    camera.position.x = 0;
    camera.position.y = 4;
    camera.position.z = 13;
    camera.lookAt(0,0,0);
}


document.getElementById("btn_lado").onclick = function() {
    camera.position.x = 20;
    camera.position.y = 4;
    camera.position.z = 0;
    camera.lookAt(0,0,0);
}
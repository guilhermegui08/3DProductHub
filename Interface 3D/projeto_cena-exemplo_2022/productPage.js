var width = window.innerWidth*0.28125;
var height = width;//window.innerHeight*0.581270182992465;
var textures = ["assets/models/textures/Wood028_2K_Color.png", "assets/textures/Wood_024_basecolor.jpg", "assets/textures/Wood_022_basecolor.jpg"];
var normals = ["assets/textures/Wood_024_normal.jpg", "assets/textures/Wood_024_normal.jpg", "assets/textures/Wood_022_normal.jpg"];
var roughnesses = ["assets/textures/Wood_024_roughness.jpg", "assets/textures/Wood_024_roughness.jpg", "assets/textures/Wood_022_roughness.jpg"];
var madeiras = ["Carvalho Escurecido", "Nogueira", "Acácia"]

light_dark_switch = document.getElementById("darkModeSelector");

var darkMode = sessionStorage.getItem("darkMode");
if (darkMode == null) {
    darkMode = false;
    sessionStorage.setItem("darkMode", darkMode);
} else {
    darkMode = darkMode == "true";
}
light_dark_switch.checked = darkMode;
var scene = new THREE.Scene()
scene.background = new THREE.Color(0xE5E5DA)
checkDarkMode(); //cena veio para trás pq esta função latera fundo da cena

texture = sessionStorage.getItem("texture");
if (texture == null) {
    texture = 0;
    sessionStorage.setItem("texture", texture);
}
console.log("init: ", texture);


var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 )
var renderer = new THREE.WebGLRenderer({canvas : document.getElementById("canvas")});
var controls = new THREE.OrbitControls(camera, renderer.domElement);
document.getElementById("loading-screen").style.display = "block";
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 29;
controls.autoRotateSpeed = -1;


/*var axes = new THREE.AxesHelper(10)
scene.add(axes)
var grid = new THREE.GridHelper()
scene.add(grid)*/

var candidatos = [];


renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 4;
renderer.setSize( width, height )
renderer.shadowMap.enabled = true

var relogio = new THREE.Clock();
var misturador = new THREE.AnimationMixer(scene);
var initmap;

camera.position.x = -5
camera.position.y = 8
camera.position.z = 13
camera.lookAt(0,2,0)

var GavetaBaixo, GavetaCima, portaDir, portaEsq;
var pmremGenerator = new THREE.PMREMGenerator(renderer=renderer);
new THREE.RGBELoader()
	.setDataType( THREE.UnsignedByteType )
	.load( 'assets/HDR/hdr.hdr', function ( texture ) {

		const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

		scene.environment = envMap;

		texture.dispose();
		pmremGenerator.dispose();
    

	} );

new THREE.GLTFLoader().load(
    'assets/models/TV_animado_sala.gltf',
    function ( gltf ) {
    scene.add( gltf.scene );
    controls.autoRotate = true;
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("canvas").style.zIndex = "0";
    setInterval(check_visibility,1);
    scene.traverse( function(x) {
        if (x.isMesh) {
            x.castShadow = true;
            x.receiveShadow = true;			
        }
        //candidatos = scene.getObjectByName("rack").children;
        if(x.name.includes("drawer") || x.name.includes("door")) {
            candidatos.push(x); // adiciona o elemento x ao vetor botoes    
            console.log(x.name);  
        }
    })
    initmap = scene.getObjectByName("rack").material.map;
    var clip = THREE.AnimationClip.findByName( gltf.animations, 'AbreGavetaBaixo' );
    GavetaBaixo = misturador.clipAction( clip );
    GavetaBaixo.setLoop(THREE.LoopOnce);
    GavetaBaixo.clampWhenFinished = true;

    var clip = THREE.AnimationClip.findByName( gltf.animations, 'AbreGavetaCima' );
    GavetaCima = misturador.clipAction( clip );
    GavetaCima.setLoop(THREE.LoopOnce);
    GavetaCima.clampWhenFinished = true;

    var clip = THREE.AnimationClip.findByName( gltf.animations, 'portaDireirtaAbrir' );
    portaDir = misturador.clipAction( clip );
    portaDir.setLoop(THREE.LoopOnce);
    portaDir.clampWhenFinished = true;

    var clip = THREE.AnimationClip.findByName( gltf.animations, 'portaEsquerdaAbrir' );
    portaEsq = misturador.clipAction( clip );
    portaEsq.setLoop(THREE.LoopOnce);
    portaEsq.clampWhenFinished = true;
    apply();
    
}
)

var gavetaBaixoAbrir = true;
var gavetaCimaAbrir = true;
var portaDirAbrir = true;
var portaEsqAbrir = true;
var darkMode = false;


document.onkeydown = function(e) {
    var key_press = e.key;
    if (key_press == "d") {
        light_dark_switch.checked = !light_dark_switch.checked;
        reverseDarkMode();
        //alert("rever")
    }
}


let raycaster = new THREE.Raycaster()
let rato = new THREE.Vector2()

document.getElementById("canvas").onclick = function (event) {
    event.preventDefault();
    var rect = event.target.getBoundingClientRect();
    rato.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    console.log("MouseX:",rato.x)
    rato.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    console.log("MouseY:",rato.y)
    pegarPrimeiro(); //identifica o Primeiro Objeto em
  };

  light_dark_switch.onclick = function() {
    reverseDarkMode();
    return 0;
  }

function portaDireita(){
    if (portaDirAbrir) {
        portaDirAbrir = false;
        portaDir.paused = false;
        portaDir.timeScale = 1;
        portaDir.play();
    } else {
        portaDirAbrir = true;
        portaDir.timeScale = -1;
        portaDir.paused = false;
        portaDir.play();
    }
}

function portaEsquerda(){
    if (portaEsqAbrir) {
        portaEsqAbrir = false;
        portaEsq.paused = false;
        portaEsq.timeScale = 1;
        portaEsq.play();
    } else {
        portaEsqAbrir = true;
        portaEsq.timeScale = -1;
        portaEsq.paused = false;
        portaEsq.play();
    }
}

function gavetaCima(){
    if (gavetaCimaAbrir) {
        gavetaCimaAbrir = false;
        GavetaCima.paused = false;
        GavetaCima.timeScale = 1;
        GavetaCima.play();
    } else {
        gavetaCimaAbrir = true;
        GavetaCima.timeScale = -1;
        GavetaCima.paused = false;
        GavetaCima.play();
    }
}

function gavetaBaixo(){
    if (gavetaBaixoAbrir) {
        gavetaBaixoAbrir = false;
        GavetaBaixo.paused = false;
        GavetaBaixo.timeScale = 1;
        //GavetaBaixo.reset();
        GavetaBaixo.play();
    } else {
        gavetaBaixoAbrir = true;
        GavetaBaixo.timeScale = -1;
        GavetaBaixo.paused = false;
        //GavetaBaixo.reset();
        GavetaBaixo.play();
    }
}

function pegarPrimeiro() {
    controls.autoRotate = false;
    raycaster.setFromCamera(rato, camera);
    console.log(rato);    
    var intersetados = raycaster.intersectObjects(candidatos, true);
    console.log("intersected: ", intersetados);
    if (intersetados.length > 0) {
        // fazer o que houver a fazer com o primeiro interesetado
        var parent;
        /*for (var i = 0; i < intersetados.length; i++) {

            parent = intersetados[i].object.parent.name;
        }*/
        if (intersetados[0].object.name == "Plane") {
            help();
            return;
        }
        parent = intersetados[0].object.parent.name;
        switch (parent) {
            case "drawerDown":
                gavetaBaixo();
                break;
            case "drawerUp":
                gavetaCima();
                break;
            case "doorRight":
                portaDireita();
                break;
            case "doorLeft":
                portaEsquerda();
                break;
            default:
                console.log(parent, "error");
        }
    }
    console.log("raicaster")
}


addLights()
animate()


function animate() {
    requestAnimationFrame( animate );
    controls.update();
    misturador.update( relogio.getDelta() );
    checkTexture();
    renderer.render( scene, camera );
}

function addLights(){
    const lightAmb = new THREE.AmbientLight( 0xffffff, 1); 
    scene.add( lightAmb );

    const lightDir = new THREE.DirectionalLight( 0xE5E5DA, 1 );
    lightDir.position.set(8,15,10)
    lightDir.castShadow = true;
    const d = 20;
    lightDir.shadow.camera.left = -d; // Define o Cone de Projeção das Sombras
    lightDir.shadow.camera.right = d; // Define o Cone de Projeção das Sombras
    lightDir.shadow.camera.top = d; // Define o Cone de Projeção das Sombras
    lightDir.shadow.camera.bottom = -d; // Define o Cone de Projeção das Sombras
    lightDir.shadow.camera.far = 50; // Define o Cone de Projeção das Sombras
    lightDir.shadow.bias = -0.02; //Para Corrigir Glitches Visuais
    /*const dlHelper = new THREE.DirectionalLightHelper(lightDir, 1, 0xFF0000);
    scene.add(dlHelper);*/
    scene.add( lightDir );
}



function checkTexture() {
    if (texture != sessionStorage.getItem("texture")) {
        texture = sessionStorage.getItem("texture");
        apply();
    }
    
}
var txt;
function apply() {
    var loader = new THREE.TextureLoader();
     txt = loader.load(textures[texture]);
     txt.encoding = THREE.sRGBEncoding
     txt.wrapS = THREE.RepeatWrapping;
     txt.wrapT = THREE.RepeatWrapping;
     map = loader.load(normals[texture]);
     roughness_map = loader.load(roughnesses[texture]);
        var m = new THREE.MeshStandardMaterial({map: txt, normalMap: map, roughnessMap: roughness_map}); //, color: {r: 1, g: 1, b: 1}
        m.roughness = 0.5;
        m.map.repeat = {x: 4, y: 4}
        //m.map.offset = {x: 0, y: -3};
        m.side = 2;
        console.log(m.map.matrix)
        m.map.flipY = initmap.flipY;
        var rack = scene.getObjectByName("rack");
        rack.material = m;
        /*for (var i = 0; i < rack.children.length; i++) {
            rack.children[i].material = m;
        }*/
        
        //m.map = initmap;
        document.getElementById("madeira_id").innerHTML = '<h4 class="text-left" style="display: inline;" id="madeira_id"></h4>' + madeiras[texture] + '</h4>';
        scene.getObjectByName("Cube017_1").material = m;
        scene.getObjectByName("Cube012_1").material = m;
        scene.getObjectByName("Cube015_1").material = m;
        scene.getObjectByName("Cube009_1").material = m;
        scene.getObjectByName("Cube006").material = m;
        scene.getObjectByName("Cube006_1").material = m;
        document.getElementById("movel1").src = "assets/imagens/movel" + (parseInt(texture)+1) + "_1.png";
        document.getElementById("movel2").src = "assets/imagens/movel" + (parseInt(texture)+1) + "_2.png";
        document.getElementById("movel3").src = "assets/imagens/movel" + (parseInt(texture)+1) + "_3.png";

       
}


function check_visibility() {
    max_distance = 49
    if (/*(camera.rotation.z > 2) || (camera.rotation.z < -0.25)*/ camera.position.x < -8  || camera.position.z < -2 ) {
        for (i = 1; i < 5; i++) {
            scene.getObjectByName("parede" + i).visible = false;
        }
        //scene.getObjectByName("chão").visible = false;  
    } else {
        for (i = 1; i < 5; i++) {
            scene.getObjectByName("parede" + i).visible = true;
        }
    }

    if (camera.rotation.x > 0 ) {
        scene.getObjectByName("chão").visible = false;  
        return;  
    } else {
        scene.getObjectByName("chão").visible = true; 
    }
}


/*dark mode and light mode*/


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

    if (darkMode) {
        scene.background = new THREE.Color(0x2a2e2f);
        var text_color = "#fff";
        var backgroundColor = "#586062";
        var btn_color = "#a1b1a7";
        var header = "assets/imagens/header_dark.svg";
        var desc_produto = "assets/imagens/descricao_produto_dark.svg";
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove("wood_btn");
            btns[i].classList.add("wood_btn_dark");
        };
        var path = "assets/imagens/path_dark.svg";
        document.getElementById("sun").style.fill = "rgb(161, 177, 167)";
        document.getElementById("moon").style.fill = "rgb(161, 177, 167)";
    } else {
        var text_color = "#000";
        var backgroundColor = "#EAE7D6";
        var btn_color = "#436e99";
        var header = "assets/imagens/header.svg";
        var desc_produto = "assets/imagens/descricao_produto.svg";
        scene.background = new THREE.Color(0xE5E5DA);
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove("wood_btn_dark");
            btns[i].classList.add("wood_btn");
        };
        var path = "assets/imagens/path.svg";
        document.getElementById("sun").style.fill = "rgb(67, 110, 153)";
        document.getElementById("moon").style.fill = "rgb(67, 110, 153)";
    }
    document.getElementById("header").src = header;
    document.getElementById("descricao_produto").src = desc_produto;
    document.getElementById("body").style.backgroundColor = backgroundColor;
    document.getElementById("body").style.color = text_color;
    document.getElementById("quantity").style.backgroundColor = btn_color;
    document.getElementById("less_btn").style.backgroundColor = btn_color;
    document.getElementById("plus_btn").style.backgroundColor = btn_color;
    document.getElementById("add_cart_btn").style.backgroundColor = btn_color;
    document.getElementById("btn_fullscreen").style.backgroundColor = btn_color;
    document.getElementById("loading-screen").style.color = text_color;
    document.getElementById("path").src = path;
}

function setDay() {
    darkMode = false; //a função checkDarkmode vai inverter
    checkDarkMode();
}

function setNight() {
    darkMode = true; //a função checkDarkmode vai inverter
    checkDarkMode();
}
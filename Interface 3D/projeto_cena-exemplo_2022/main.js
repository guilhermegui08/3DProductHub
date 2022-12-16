var width = 800;
var height = 600;
var textures = ["assets/models/textures/Wood028_2K_Color.png", "assets/models/textures/wood1.jpg", "assets/models/textures/wood2.jpg"]

texture = sessionStorage.getItem("texture");
if (texture == null) {
    texture = 0;
    sessionStorage.setItem("texture", texture);
}
console.log("init: ", texture);

var scene = new THREE.Scene()
scene.background = new THREE.Color(0xE5E5DA)
var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 )
var renderer = new THREE.WebGLRenderer({canvas : document.getElementById("canvas")});
var controls = new THREE.OrbitControls(camera, renderer.domElement);
document.getElementById("loading-screen").style.display = "block";
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 29;


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
    document.getElementById("loading-screen").style.display = "none";
    setInterval(check_visibility,1);
    scene.traverse( function(x) {
        if (x.isMesh) {
            x.castShadow = true;
            x.receiveShadow = true;			
        }
        candidatos = scene.getObjectByName("rack").children;
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
        if (darkMode) {
            darkMode = false;
            scene.background = new THREE.Color(0xE8E8E8);
        } else {
            darkMode = true;
            scene.background = new THREE.Color(0x1a1a25);
        }
    }
}


let raycaster = new THREE.Raycaster()
let rato = new THREE.Vector2()

window.onclick = function(evento) {
    rato.x = (evento.clientX / width) * 2 - 1
    rato.y = -(evento.clientY / height) * 2 + 1
    // invocar raycaster
    pegarPrimeiro();
}

function pegarPrimeiro() {
    raycaster.setFromCamera(rato, camera)
    console.log(rato);
    var intersetados = raycaster.intersectObjects(candidatos, true);
    if (intersetados.length > 0) {
        var parent;
        parent = intersetados[0].object.parent.name;
        console.log("inter: ", intersetados);
        console.log(parent);
        switch (parent) {
            case "drawerDown":
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
                break;
            case "drawerUp":
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
                break;
            case "doorRight":
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
                break;
            case "doorLeft":
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
                break;
            default:
                console.log("error");
        }
    }
    console.log("raicaster")
    checkTexture();
}


addLights()
animate()


function animate() {
    requestAnimationFrame( animate );
    misturador.update( relogio.getDelta() );
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
    //txt.minFilter = THREE.LinearMipMapLinearFilter;
        var m = new THREE.MeshStandardMaterial({map: txt}); //, color: {r: 1, g: 1, b: 1}
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
        scene.getObjectByName("Cube017_1").material = m;
        scene.getObjectByName("Cube012_1").material = m;
        scene.getObjectByName("Cube015_1").material = m;
        scene.getObjectByName("Cube009_1").material = m;
        scene.getObjectByName("Cube006").material = m;
        scene.getObjectByName("Cube006_1").material = m;
       
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
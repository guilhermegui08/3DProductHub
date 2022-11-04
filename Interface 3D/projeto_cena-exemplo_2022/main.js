var width = 800;
var height = 600;

var scene = new THREE.Scene()
scene.background = new THREE.Color(0xE5E5DA)
var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 )
var renderer = new THREE.WebGLRenderer({canvas : document.getElementById("canvas")});
var controls = new THREE.OrbitControls(camera, renderer.domElement)

/*var axes = new THREE.AxesHelper(10)
scene.add(axes)*/
var grid = new THREE.GridHelper()
scene.add(grid)

var candidatos = [];

renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 4;
renderer.setSize( width, height )
renderer.shadowMap.enabled = true

var relogio = new THREE.Clock();
var misturador = new THREE.AnimationMixer(scene);

camera.position.x = -5
camera.position.y = 8
camera.position.z = 13
camera.lookAt(0,2,0)

var GavetaBaixo, GavetaCima, portaDir, portaEsq;

new THREE.GLTFLoader().load(
    'models/TV_animado.gltf',
    function ( gltf ) {
    scene.add( gltf.scene );

    scene.traverse( function(x) {
        if (x.isMesh) {
            x.castShadow = true;
            x.receiveShadow = true;			
        }
        if(x.name.includes("drawer") || x.name.includes("door")) {
            candidatos.push(x); // adiciona o elemento x ao vetor botoes    
            console.log(x.name);  
        }
    })
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
            scene.background = new THREE.Color(0xE5E5DA);
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
}


addLights()
animate()

function animate() {
    requestAnimationFrame( animate );
    misturador.update( relogio.getDelta() );
    renderer.render( scene, camera );
}

function addLights(){
    const lightAmb = new THREE.AmbientLight( 0xffffff, 0.5); 
    scene.add( lightAmb );

    const lightDir = new THREE.DirectionalLight( 0xE5E5DA, 1 );
    lightDir.position.set(2,8,10)
    /*const dlHelper = new THREE.DirectionalLightHelper(lightDir, 1, 0xFF0000);
    scene.add(dlHelper);*/
    scene.add( lightDir );
}


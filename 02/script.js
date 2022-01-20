// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

let camera, scene, raycaster, renderer
const mouse = new THREE.Vector2()
window.addEventListener( 'click', onClick, false);
window.addEventListener( 'resize',() => {
                        renderer.setSize(window.innerWidth,window.innerHeight);
                        camera.aspect = window.innerWidth/window.innerHeight;
                        camera.updateProjectionMatrix;
})

const model = 'covid.3dm'
var material = new THREE.MeshLambertMaterial({color:'#741919'})

init()
animate()

function init() {

    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#3b1111')
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    camera.position.y = - 100

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    const controls = new OrbitControls( camera, renderer.domElement )

    const directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.position.set( 0, 0, 2 )
    directionalLight.castShadow = true
    directionalLight.intensity = 2

    const directionalLight2 = new THREE.DirectionalLight( 0xffffff )
    directionalLight.position.set( 0, -2, 0 )
    directionalLight.castShadow = true
    directionalLight.intensity = 1


    scene.add( directionalLight )
    scene.add( directionalLight2 )
    raycaster = new THREE.Raycaster()

    const loader = new Rhino3dmLoader()
    loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

   
    //for(let i=0; i<10;i++){
    loader.load( model, function ( object ) {

        document.getElementById('loader').remove()
        document.getElementById('intro').remove()

        object.traverse( function (child) { 
            if (child.isMesh) {
                child.material = material
                child.position.set(0,10,0)
      
            }
        }, false)


        scene.add( object )
        //console.log( object )

    } )
    //}


    
}

    function onClick( event ) {

    console.log( `click! (${event.clientX}, ${event.clientY})`)

	// calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    
    raycaster.setFromCamera( mouse, camera )

	// calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children, true )

    for (let i=0; i< intersects.length;i++){

      intersects [i].object.material.color.set("#3d3d3d")  
    }

    /*if (container) container.remove()

    // reset object colours
    scene.traverse((child, i) => {
        if (child.isMesh) {
            child.material.color.set( 'white' )
        }
    });

    if (intersects.length > 0) {

        // get closest object
        const object = intersects[0].object
        console.log(object) // debug

        object.material.color.set( 'yellow' )

    
        
    }*/

}

function animate() {

    requestAnimationFrame( animate )
    renderer.render( scene, camera )

}

import * as AFRAME from 'aframe';
import { threeSceneStore } from '../stores/threeScene';

export default function globRender() {
    const threeSceneAPI = threeSceneStore()
    const cubeSize = 1;
    const cubeGeo = new AFRAME.THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new AFRAME.THREE.MeshPhongMaterial({ color: '#8AC' });
    const cube = new AFRAME.THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(0, 0, -5)
    // let controls: OrbitControls;
    console.log('update!')

    const ringGeometry = new AFRAME.THREE.RingGeometry(10, 20, 30, 10); // 内半径为 10，外半径为 20
    const ringMaterial = new AFRAME.THREE.MeshPhongMaterial({ color: 'red',wireframe: true });
    const cylinderHeight = 10; 
    ringGeometry.applyMatrix4(new AFRAME.THREE.Matrix4().makeTranslation(0, cylinderHeight, cylinderHeight));
    const ring = new AFRAME.THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(0, 0, -5)
    function animate() {
        if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
            requestAnimationFrame(animate);
            ring.rotation.x += 0.01;
            ring.rotation.y += 0.01;
            threeSceneAPI.render();
            // controls.update();
        }
    }
    if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
        console.log('update!!')
        // controls = new OrbitControls(threeSceneAPI.camera, threeSceneAPI.renderer.domElement);
        threeSceneAPI.addEntity(ring);
        animate();
    }
}


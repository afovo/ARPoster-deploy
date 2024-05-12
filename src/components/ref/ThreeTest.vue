<template>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, watch } from 'vue'
import { threeSceneStore } from '../../stores/threeScene';
const threeSceneAPI = threeSceneStore()
const cubeSize = 1;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(0, 0, -5)
// let controls: OrbitControls;
const props = defineProps({
    ready: Boolean
})
watch(() => props.ready, (newValue) => {
    console.log('update!')
    if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
        console.log('update!!')
        // controls = new OrbitControls(threeSceneAPI.camera, threeSceneAPI.renderer.domElement);
        threeSceneAPI.addEntity(cube);
        animate();
    }
}, { deep: true });

function animate() {
    if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        threeSceneAPI.render();
        // controls.update();
    }
}


</script>

<style scoped>
#three {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
</style>../../stores/threeScene
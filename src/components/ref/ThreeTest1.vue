<template>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, watch } from 'vue'
import { threeSceneStore } from '../../stores/threeScene';
const threeSceneAPI = threeSceneStore()
const cubeSize = 0.5;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
const mesh = new THREE.Mesh(cubeGeo, cubeMat);
const props = defineProps({
    ready: Boolean
})
watch(() => props.ready, (newValue) => {
    console.log('update!')
    if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
        console.log('update!!')
        threeSceneAPI.addEntity(mesh);
        animate();
    }
}, { deep: true });

function animate() {
    if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
        requestAnimationFrame(animate);
        mesh.position.y += 0.01
        if (mesh.position.y > 5) {
            mesh.position.y = -1
        }
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        threeSceneAPI.render();
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
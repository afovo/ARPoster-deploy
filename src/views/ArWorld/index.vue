<template>
    <div class="main">
        <div class="arjs-loader" v-if="!isMounted">
            Loading, please wait...
        </div>
        <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" 
        renderer="antialias: true; logarithmicDepthBuffer: true; colorManagement: true; sortObjects: true;" v-else>
            <a-nft type='nft' url='/imageMarkers/demo/demo' smooth='true' smoothCount='10' smoothTolerance='0.01'
                smoothThreshold='5' maxDistance="50">
                <a-entity id="count" rotation="270 0 0" scale="50 50 50" position="80 40 -150"></a-entity>
                <!-- <a-image src="/assets/comp1.jpg" scale="280 200 1" position="120 40 -250" rotation="270 0 0" opacity="0.8"></a-image> -->
            </a-nft>
            <a-nft type='nft' url='/imageMarkers/demo/glob' smooth='true' smoothCount='10000' smoothTolerance='10000'
                smoothThreshold='50000' maxDistance="5000" size="0.01">
                <!-- <a-entity id="test" rotation="0 0 0"
                    animation="property: rotation; to: 0 360 0; dur: 4000; loop: true; easing:linear;"></a-entity> -->
                <a-entity gltf-model="/models/glob.glb" scale="40 40 40" position="120 5 -150"></a-entity>
                <!-- <a-gltf-model src="/models/glob.glb" scale="50 50 50" position="120 10 -150" rotation="0 0 0" animation="property: rotation; to: 0 360 0; dur: 4000; loop: true; easing:linear;"></a-gltf-model> -->
            </a-nft>
            <a-nft type='nft' url='/imageMarkers/demo/major' smooth='true' smoothCount='100' smoothTolerance='0.01'
                smoothThreshold='500' maxDistance="50">
                <a-image src="/assets/major.png" scale="180 150 1" position="80 40 -150" rotation="270 0 0"
                    opacity="0.7" navigate-on-click></a-image>
            </a-nft>
            <!-- <a-marker preset="hiro" cursor="rayOrigin: mouse" raycaster="objects: a-box">
                <a-box position="0 0.5 0" color-randomizer></a-box>
            </a-marker> -->
            <!-- <a-nft type='nft' url='/imageMarkers/demo/demo1' smooth='true' smoothCount='10' smoothTolerance='0.01'
                smoothThreshold='5'>
                <a-entity gltf-model="/models/fish/fish.gltf" scale="15 15 15" position="80 10 -150"></a-entity>
            </a-nft> -->
            <!-- <a-entity gltf-model="/models/fish/fish.gltf" look-at="[gps-camera]" scale="15 15 15" position="80 10 -150"></a-entity> -->
            <!-- <a-entity gps-camera></a-entity> -->
            <a-entity camera></a-entity>
        </a-scene>
    </div>
</template>

<script setup>
import { THREE } from 'aframe';
import entityRender from '@/util/demo';
import { ref, onMounted, nextTick } from 'vue'
import { threeSceneStore } from '@/stores/threeScene';
const threeSceneAPI = threeSceneStore()
let isMounted = ref(false)

onMounted(async () => {
    // await import('https://aframe.io/releases/1.0.0/aframe.min.js');
    // await import('https://raw.githack.com/jeromeetienne/AR.js/2.2.2/aframe/build/aframe-ar.min.js')
    // await import('@ar-js-org/ar.js/aframe/build/aframe-ar-location-only.js');
    // await import('https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js')
    await import('@ar-js-org/ar.js/aframe/build/aframe-ar-nft.js');
    isMounted.value = true;
    // nextTick(() => {
    //     let ascene = document.querySelector('a-scene');
    //     console.log('ascene:', ascene);
    //     threeSceneAPI.setAll(ascene.object3D, ascene.camera, ascene.renderer)
    //     threeSceneAPI.setEntity(document.querySelector('#test'), 5);
    //     threeSceneAPI.setEntity(document.querySelector('#count'), 2);
    //     entityRender();
    // })
    // const sceneEl = document.querySelector('a-scene')
    // sceneEl.addEventListener('loaded',()=>{
    //     sceneEl.camera = new THREE.PerspectiveCamera();
    // })
    // navigator.geolocation.getCurrentPosition((position) => {
    //     console.log(position.coords)
    //     let test = document.querySelector('a-text')
    //     test.setAttribute('gps-entity-place', `latitude: ${position.coords.latitude}; longitude: ${position.coords.longitude};`)
    //     console.log(test.gpsEntityPlace)
    // });
})
</script>

<style lang='scss' scoped>
.main {
    height: 100%;
    width: 100%;
    overflow: hidden;

    .arjs-loader {
        height: 100%;
        width: 100%;
        text-align: center;
    }
}
</style>
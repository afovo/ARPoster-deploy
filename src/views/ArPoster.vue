<template>
    <div class="main">
        <div ref="cursor_ring" v-show="show_cursor" class="pulsating-circle"></div>
        <div class="arjs-loader" v-if="!isMounted">
            Loading, please wait...
        </div>
        <a-scene class="z-1" embedded arjs="sourceType: webcam; debugUIEnabled: false;"
            renderer="antialias: true; logarithmicDepthBuffer: true; colorManagement: true; sortTransparentObjects: true;"
            v-else>
            <a-nft type='nft' url='/imageMarkers/poster1-comp1' smooth='true' smoothCount='100' smoothTolerance='0.01'
                    smoothThreshold='500' maxDistance="50" cursor="rayOrigin: mouse">
                    <a-gltf-model src="https://ar-poster-1314867896.cos.ap-guangzhou.myqcloud.com/models/Fox.glb"></a-gltf-model>
                    <!-- <a-image v-else-if="model.type == 2" :src="model.model_url"></a-image> -->
            </a-nft>
            <!-- <a-entity v-for="component in components">
                <a-nft v-for="model in component.models" type='nft' :url='component.marker_url' smooth='true' smoothCount='100' smoothTolerance='0.01'
                    smoothThreshold='500' maxDistance="50" cursor="rayOrigin: mouse">
                    <a-gltf-model v-if="model.type == 1" :src="model.model_url"></a-gltf-model>
                </a-nft>
            </a-entity> -->
        </a-scene>
    </div>
</template>

<script setup>
//用研究生培养界面作为demo演示编辑器
import { THREE } from 'aframe';
import entityRender from '@/util/demo';
import { ref, onMounted, nextTick } from 'vue';
import { threeSceneStore } from '@/stores/threeScene';
import { modelStore } from '@/stores/model';
import { useRoute } from 'vue-router';
const route = useRoute()
const threeSceneAPI = threeSceneStore()
const modelApi = modelStore()
let isMounted = ref(false)
let cursor_ring = ref()
let show_cursor = ref(false)
const components = ref([])
var bind = function bind(fn, ctx /* , arg1, arg2 */) {
    return (function (prependedArgs) {
        return function bound() {
            // Concat the bound function arguments with those passed to original bind
            var args = prependedArgs.concat(Array.prototype.slice.call(arguments, 0));
            return fn.apply(ctx, args);
        };
    })(Array.prototype.slice.call(arguments, 2));
};
onMounted(async () => {
    let pid = route.params.id
    console.log(pid)
    modelApi.getModelListByPID(pid).then((res) => {
        components.value = res.data
        console.log(components.value)
    })

    await import('@ar-js-org/ar.js/aframe/build/aframe-ar-nft.js');
    isMounted.value = true

    nextTick(() => {
        let ascene = document.querySelector('a-scene');
        // threeSceneAPI.setAll(ascene.object3D, ascene.camera, ascene.renderer)
        // threeSceneAPI.setEntity(document.querySelector('#test'), 5);
        // threeSceneAPI.setEntity(document.querySelector('#count'), 2);
        // entityRender();
        ascene.addEventListener('click', (event) => {
            cursor_ring.value.style.left = event.pageX + 'px'
            cursor_ring.value.style.top = event.pageY + 'px'
            show_cursor.value = true
            setTimeout(() => {
                show_cursor.value = false
            }, 800)
        })
        ascene.addEventListener('touchstart', (event) => {
            cursor_ring.value.style.left = event.pageX + 'px'
            cursor_ring.value.style.top = event.pageY + 'px'
            show_cursor.value = true
            setTimeout(() => {
                show_cursor.value = false
            }, 800)
        })


        let markers = document.querySelectorAll("[cursor]");
        console.log(markers)
        markers.forEach((marker) => {
            console.log(marker.components.cursor);
            console.log(marker.hasLoaded);
            //replace the curosr.onMouseMove function
            let cursorComponent = marker.components.cursor;
            cursorComponent.onMouseMove = (function () {
                console.warn("Cursor.onMouseMove is modified");
                var direction = new THREE.Vector3();
                var mouse = new THREE.Vector2();
                var origin = new THREE.Vector3();
                var rayCasterConfig = { origin: origin, direction: direction };
                return function (evt) {
                    var bounds = this.canvasBounds;
                    var camera = this.el.sceneEl.camera;
                    var left;
                    var point;
                    var top;

                    camera.parent.updateMatrixWorld();
                    // Calculate mouse position based on the canvas element
                    if (evt.type === "touchmove" || evt.type === "touchstart") {
                        // Track the first touch for simplicity.
                        point = evt.touches.item(0);
                    } else {
                        point = evt;
                    }

                    left = point.clientX - bounds.left;
                    top = point.clientY - bounds.top;
                    mouse.x = (left / bounds.width) * 2 - 1;
                    mouse.y = -(top / bounds.height) * 2 + 1;
                    origin.setFromMatrixPosition(camera.matrixWorld);
                    let matrix = new THREE.Matrix4();

                    //The only part we want to modify is the direction calculations
                    direction
                        .set(mouse.x, mouse.y, 0.5)
                        .applyMatrix4(matrix.invert(camera.projectionMatrix))
                        .applyMatrix4(camera.matrixWorld)
                        .sub(origin)
                        .normalize();

                    this.el.setAttribute("raycaster", rayCasterConfig);
                    if (evt.type === "touchmove") {
                        evt.preventDefault();
                    }
                };
            })();

            //bind the context
            cursorComponent.onMouseMove = bind(
                cursorComponent.onMouseMove,
                cursorComponent
            );
            cursorComponent.updateMouseEventListeners();
        })
    })

});

AFRAME.registerComponent('hyperlink', {
    multiple: true,
    schema: { type: 'string', default: '' },
    init: function () {
        var el = this.el;
        console.log(el)
        const url = this.data
        el.addEventListener('click', function () {
            window.open(url, '_blank');
        });
    }
});
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

.pulsating-circle {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 100;
    transform: translateX(-50%) translateY(-50%);
    width: 30px;
    height: 30px;

    &:before {
        content: '';
        position: relative;
        display: block;
        width: 300%;
        height: 300%;
        box-sizing: border-box;
        margin-left: -100%;
        margin-top: -100%;
        border-radius: 45px;
        background-image: radial-gradient(circle, #01a4e9, transparent);
        animation: pulse-dot 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 0 8px rgba(0, 0, 0, .3);
        animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;
    }
}

@keyframes pulse-dot {
    0% {
        transform: scale(.8);
    }

    50% {
        transform: scale(1);
    }

    100% {
        transform: scale(.8);
    }
}
</style>
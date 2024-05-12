<template>
  <div class="main">
      <div ref="cursor_ring" v-show="show_cursor" class="pulsating-circle"></div>
      <div class="arjs-loader" v-if="!isMounted">
          Loading, please wait...
      </div>
      <a-scene class="z-1" embedded arjs="sourceType: webcam; debugUIEnabled: false;"
          renderer="antialias: true; logarithmicDepthBuffer: true; colorManagement: true; sortTransparentObjects: true;"
          v-else>
          <a-entity light="type: directional; color: #EEE; intensity: 0.5" position="-1 1 0"></a-entity>
          <!-- 1 -->
          <a-nft type='nft' url='/imageMarkers/demo/major' smooth='true' smoothCount='100' smoothTolerance='0.01'
              smoothThreshold='500' maxDistance="50" cursor="rayOrigin: mouse" raycaster="objects: a-image">
              <a-image src="/assets/major.png" scale="180 150 1" position="80 40 -150" rotation="270 0 0"
                  opacity="0.7" hyperlink="https://cse.sustech.edu.cn/cn/teach/index/id/165"></a-image>
          </a-nft>
          <!-- 2 -->
          <a-nft type='nft' url='/imageMarkers/demo/count1' smooth='true' smoothCount='100' smoothTolerance='0.01'
              smoothThreshold='500' maxDistance="50">
              <a-entity id="count" rotation="270 0 0"></a-entity>
          </a-nft>
          <!-- 5 -->
          <a-nft type='nft' url='/imageMarkers/demo/glob' smooth='true' smoothCount='10000' smoothTolerance='10000'
              smoothThreshold='50000' maxDistance="5000" size="0.01" cursor="rayOrigin: mouse"
              raycaster="objects: a-image">
              <a-image src="/assets/pie2022.png" scale="300 225 1" position="200 0 -220" rotation="270 0 0"
                  opacity="0.9" hyperlink="https://www.baidu.com"></a-image>
              <a-image src="/assets/pie2023.png" scale="300 225 1" position="500 0 -220" rotation="270 0 0"
                  opacity="0.9" hyperlink="https://www.baidu.com"></a-image>
          </a-nft>
          <a-entity camera></a-entity>
      </a-scene>
  </div>
</template>

<script setup>
//本科生培养
import { THREE } from 'aframe';
import entityRender from '@/util/demo';
import { ref, onMounted, nextTick } from 'vue'
import { threeSceneStore } from '@/stores/threeScene';
const threeSceneAPI = threeSceneStore()
let isMounted = ref(false)
let cursor_ring = ref()
let show_cursor = ref(false)
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
  await import('@ar-js-org/ar.js/aframe/build/aframe-ar-nft.js');
  isMounted.value = true

  nextTick(() => {
      let ascene = document.querySelector('a-scene');
      console.log('ascene:', ascene);
      threeSceneAPI.setAll(ascene.object3D, ascene.camera, ascene.renderer)
      threeSceneAPI.setEntity(document.querySelector('#test'), 5);
      threeSceneAPI.setEntity(document.querySelector('#count'), 2);
      console.log('entity map:', threeSceneAPI.entities)
      entityRender();
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

      // 设置marker超链接
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

// AFRAME.registerComponent('color-randomizer', {
//     init: function () {
//         let colors = ["red", "green", "blue", "black", "orange", "white"]
//         var el = this.el;
//         el.addEventListener('click', (e) => {
//             this.el.setAttribute('color', colors[Math.floor(Math.random() * colors.length)])
//             console.log('ooooooooooooooooo!', el)
//         });
//     }
// })

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
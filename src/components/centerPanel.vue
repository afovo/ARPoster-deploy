<template>
    <div v-if="showDrawer"
        class="overflow-auto bg-white rounded-lg dark:bg-gray-700 z-50 absolute bottom-[48px] right-[320px] p-1 w-[150px] h-[160px] shadow-2xl">
        <button type="button" @click="() => showDrawer = false"
            class=" text-gray-400 bg-transparent cursor-pointer border-0 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
        <img :src="'/assets/qr_demo.png'" class="ml-[15px] h-[120px] w-auto">
    </div>
    <canvas class="absolute top-[70px] left-[470px] p-6 w-[650px] h-[600px]" id="three"></canvas>
    <basicButton @click="generateQR" class="absolute top-[700px] left-[1010px]"
        :svg="'M0.732233,0.732233C1.20107,0.263392,1.83696,0,2.5,0C2.5,0,5,0,5,0C5.46023,0,5.83333,0.373096,5.83333,0.833333C5.83333,1.29357,5.46023,1.66667,5,1.66667C5,1.66667,2.5,1.66667,2.5,1.66667C2.27898,1.66667,2.06702,1.75447,1.91074,1.91074C1.75447,2.06702,1.66667,2.27898,1.66667,2.5C1.66667,2.5,1.66667,5,1.66667,5C1.66667,5.46023,1.29357,5.83333,0.833333,5.83333C0.373096,5.83333,0,5.46023,0,5C0,5,0,2.5,0,2.5C0,1.83696,0.263392,1.20107,0.732233,0.732233C0.732233,0.732233,0.732233,0.732233,0.732233,0.732233ZM10.8333,0.833333C10.8333,0.373096,11.2064,0,11.6667,0C11.6667,0,14.1667,0,14.1667,0C14.8298,0,15.4656,0.263392,15.9344,0.732233C16.4032,1.20107,16.6667,1.83696,16.6667,2.5C16.6667,2.5,16.6667,5,16.6667,5C16.6667,5.46023,16.2936,5.83333,15.8333,5.83333C15.3731,5.83333,15,5.46023,15,5C15,5,15,2.5,15,2.5C15,2.27898,14.9122,2.06702,14.7559,1.91074C14.5997,1.75447,14.3877,1.66667,14.1667,1.66667C14.1667,1.66667,11.6667,1.66667,11.6667,1.66667C11.2064,1.66667,10.8333,1.29357,10.8333,0.833333C10.8333,0.833333,10.8333,0.833333,10.8333,0.833333ZM0.833333,10.8333C1.29357,10.8333,1.66667,11.2064,1.66667,11.6667C1.66667,11.6667,1.66667,14.1667,1.66667,14.1667C1.66667,14.3877,1.75447,14.5997,1.91074,14.7559C2.06702,14.9122,2.27898,15,2.5,15C2.5,15,5,15,5,15C5.46023,15,5.83333,15.3731,5.83333,15.8333C5.83333,16.2936,5.46023,16.6667,5,16.6667C5,16.6667,2.5,16.6667,2.5,16.6667C1.83696,16.6667,1.20107,16.4032,0.732233,15.9344C0.263392,15.4656,0,14.8298,0,14.1667C0,14.1667,0,11.6667,0,11.6667C0,11.2064,0.373096,10.8333,0.833333,10.8333C0.833333,10.8333,0.833333,10.8333,0.833333,10.8333ZM15.8333,10.8333C16.2936,10.8333,16.6667,11.2064,16.6667,11.6667C16.6667,11.6667,16.6667,14.1667,16.6667,14.1667C16.6667,14.8298,16.4032,15.4656,15.9344,15.9344C15.4656,16.4032,14.8298,16.6667,14.1667,16.6667C14.1667,16.6667,11.6667,16.6667,11.6667,16.6667C11.2064,16.6667,10.8333,16.2936,10.8333,15.8333C10.8333,15.3731,11.2064,15,11.6667,15C11.6667,15,14.1667,15,14.1667,15C14.3877,15,14.5997,14.9122,14.7559,14.7559C14.9122,14.5997,15,14.3877,15,14.1667C15,14.1667,15,11.6667,15,11.6667C15,11.2064,15.3731,10.8333,15.8333,10.8333C15.8333,10.8333,15.8333,10.8333,15.8333,10.8333Z'"
        :title="'预览海报'"></basicButton>
</template>

<script setup lang="ts">
import { THREE } from 'aframe';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { onMounted, ref, watch } from 'vue';
import { modelStore } from '@/stores/model';
import * as echarts from 'echarts';
import basicButton from './buttons/basicButton.vue';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
const props = defineProps({
    pid: Number,
    poster: String,
    width: Number,
    height: Number,
    scaler: Number,
    cid: Number,
    pointsArray: Array<THREE.Vector3>,
    renderModels: Boolean
})
const modelApi = modelStore()
let controls: any;
let scene: any;
let canvasData = { w: 650, h: 600 }
let camera: any;
let renderer: any;
let animationMixer: any;
let plane: any;

const showDrawer = ref(false)
function renderPoster() {
    if (props.poster && props.width && props.height && props.scaler) {
        //基础设置
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, canvasData.w / canvasData.h, 0.1, 1000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 400;
        const canvas = <HTMLCanvasElement><unknown>document.querySelector('#three')
        canvas.width = canvasData.w
        canvas.height = canvasData.h
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(canvasData.w, canvasData.h);
        document.body.appendChild(renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        let ambientLight = new THREE.AmbientLight(0xffffff, 2)
        scene.add(ambientLight)
        let directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(-1, 1, 1)
        scene.add(directionalLight)

        //海报体
        var texture = new TextureLoader().load(props.poster);
        var material = new THREE.MeshPhongMaterial({ map: texture, opacity: 1, transparent: true });
        const planeGeo = new THREE.BoxGeometry(props.width / props.scaler, 10, props.height / props.scaler);
        plane = new THREE.Mesh(planeGeo, material)
        plane.position.set(0, 0, 0)
        plane.rotation.x = Math.PI / 2;
        scene.add(plane);

        //坐标轴
        var axesHelper = new THREE.AxesHelper(1500);
        scene.add(axesHelper);

        animate();
    }
}
onMounted(() => {
    renderPoster();
    renderAllModels();
})
watch(() => { props.pid, props.scaler, props.renderModels }, (oldvalue: any, newvalue: any) => {
    renderPoster();
    renderAllModels();
}, { deep: true })

watch(() => props.cid, (oldvalue: any, newvalue: any) => {
    highlightComponent();
}, { deep: true })

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

function renderAllModels() {
    if (props.pid != undefined) {
        modelApi.getModelListByPID(props.pid).then((res: any) => {
            console.log(res)
            res.data.forEach((component: any) => {
                component['models'].forEach((model: any) => {
                    console.log(model)
                    if (props.width && props.height && props.scaler) {
                        //initial position
                        let position = [(component['position_x'] - props.width / 2) / props.scaler, (props.height / 2 - component['position_y'] - component['height']) / props.scaler, 50]
                        console.log(position)
                        switch (model['type']) {
                            case 0:
                                let canvas = <HTMLCanvasElement><unknown>document.createElement('canvas');
                                canvas.width = 600;
                                canvas.height = 600;
                                var myChart = echarts.init(canvas);
                                myChart.setOption(eval('(' + model['data'] + ')'));
                                setTimeout(() => {
                                    var texture = new THREE.CanvasTexture(canvas);
                                    var material = new THREE.MeshPhongMaterial({ map: texture, opacity: model['opacity'], transparent: true });
                                    const planeGeo = new THREE.BoxGeometry(150, 10, 150);
                                    const plane = new THREE.Mesh(planeGeo, material);
                                    plane.scale.set(model['scale'][0], model['scale'][1], model['scale'][2])
                                    plane.rotation.set(Math.PI / 2 + model['rotation'][0], model['rotation'][1], model['rotation'][2]);
                                    plane.position.set(position[0] + model['position'][0], position[1] + model['position'][1], position[2] + model['position'][2])
                                    plane.name = model['id']
                                    scene.add(plane);
                                    console.log(scene)
                                }, 1000)

                                break
                            case 1:
                                const loader = new GLTFLoader();
                                //加载模型文件，返回gltf对象
                                loader.load(model['model_url'], function (gltf: any) {
                                    console.log('控制台查看加载gltf文件返回的对象结构', gltf);
                                    console.log('gltf对象场景属性', gltf.scene);
                                    // // 返回的场景对象gltf.scene插入到threejs场景中
                                    // if (gltf.animations.length > 0) {
                                    //     animationMixer = new THREE.AnimationMixer(gltf.scene.children[1]);
                                    //     animationMixer.clipAction(gltf.animations[0]).play();

                                    //     /* 其他模型动画方案：
                                    //      const animationClip = this.Model.animations.find(animationClip => animationClip.name === "Walk");
                                    //      this.AnimationMixer.clipAction(animationClip).play();
                                    //      */
                                    // }
                                    var bbox = new THREE.Box3().setFromObject(gltf.scene);

                                    // 获取模型尺寸
                                    var size = bbox.getSize(new THREE.Vector3());

                                    // 输出模型尺寸
                                    console.log('模型宽度：', size.x);
                                    console.log('模型高度：', size.y);
                                    console.log('模型深度：', size.z);
                                    gltf.scene.rotation.set(Math.PI / 2 + model['rotation'][0], model['rotation'][1], model['rotation'][2])
                                    gltf.scene.position.set(position[0] + model['position'][0], position[1] + model['position'][1], position[2] + model['position'][2])
                                    gltf.scene.name = model['id']
                                    gltf.scene.scale.set(model['scale'][0], model['scale'][1], model['scale'][2])
                                    scene.add(gltf.scene);
                                })
                                break
                            case 2:
                                new THREE.TextureLoader().load(model['image_url'],
                                    (texture: THREE.Texture) => {
                                        const SIZE = 20;
                                        const img = texture.image;
                                        let height = (img && img.height) || SIZE;
                                        let width = (img && img.width) || SIZE;
                                        height = (SIZE / width) * height;
                                        width = SIZE;
                                        const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: model['opacity'] });
                                        const geom = new THREE.PlaneGeometry(width, height);
                                        const mesh = new THREE.Mesh(geom, mat);
                                        mesh.scale.set(model['scale'][0] / 14, model['scale'][1] / 14, model['scale'][2] / 14)
                                        mesh.rotation.set(Math.PI / 2 + model['rotation'][0], model['rotation'][1], model['rotation'][2]);
                                        mesh.position.set(position[0] + model['position'][0], position[1] - model['position'][2] / 2, position[2])
                                        mesh.name = model['id']
                                        scene.add(mesh);
                                    }
                                );
                                break
                            case 3:
                                // fake
                                if (props.pid == 2) {
                                    console.log(1)
                                    const data = [16, 44, 79, 168, 152, 166, 202];
                                    const start = 2017
                                    const color = [0xadd8e6, 0xc0c0c0, 0xa9a9a9, 0x0099ff, 0x0066cc, 0x0099cc, 0xadd8e6]
                                    const barGroup = new THREE.Group();

                                    const barWidth = 50;
                                    const radius = 150; // 圆环的半径
                                    const thetaStep = (Math.PI * 2 / 3) / data.length; // 每个柱子之间的角度间隔
                                    // 添加顶端显示值
                                    const loader = new FontLoader();
                                    loader.load('/fonts/Microsoft YaHei_Regular.json', (font) => {
                                        for (let i = 0; i < data.length; i++) {
                                            const theta = (data.length - i) * thetaStep; // 当前柱子的角度
                                            const x = Math.cos(theta) * radius; // 柱子的x坐标
                                            const z = Math.sin(theta) * radius; // 柱子的z坐标

                                            const geometry = new THREE.BoxGeometry(barWidth, data[i] / 1.5, barWidth);
                                            const material = new THREE.MeshPhongMaterial({
                                                color: color[i], opacity: 0.9,
                                                transparent: true, specular: 0x4488ee,
                                                shininess: 12
                                            });
                                            const bar = new THREE.Mesh(geometry, material);
                                            bar.position.set(x, data[i] / 3, z); // 设置柱子的位置
                                            barGroup.add(bar);

                                            const textGeometry = new TextGeometry(data[i].toString(), {
                                                font: font,
                                                size: 12,
                                                height: 3,
                                                depth: 5
                                            });
                                            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                                            const text = new THREE.Mesh(textGeometry, textMaterial);
                                            text.position.set(x - 20, data[i] / 1.5 + 15, z + barWidth / 2);

                                            const textGeometry1 = new TextGeometry((start + i).toString(), {
                                                font: font,
                                                size: 8,
                                                height: 3,
                                                depth: 5,
                                            });
                                            const textMaterial1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
                                            const text1 = new THREE.Mesh(textGeometry1, textMaterial1);
                                            text1.position.set(x - 20, -20, z + barWidth / 2);
                                            barGroup.add(text);
                                            barGroup.add(text1);
                                        }
                                        const titleGeometry = new TextGeometry('截止2023年6月，总授予学位人数', {
                                            font: font,
                                            size: 8,
                                            height: 3,
                                            depth: 5,
                                        });
                                        const titleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                                        const title = new THREE.Mesh(titleGeometry, titleMaterial);
                                        title.position.set(0, 230, barWidth / 2);
                                        barGroup.add(title)

                                        const titleGeometry1 = new TextGeometry('827人', {
                                            font: font,
                                            size: 20,
                                            height: 3,
                                            depth: 8,
                                            bevelEnabled: true,
                                            bevelThickness: 0.01,
                                            bevelSize: 1
                                        });
                                        const titleMaterial1 = new THREE.MeshBasicMaterial({ color: 0x0099cc });
                                        const title1 = new THREE.Mesh(titleGeometry1, titleMaterial1);
                                        title1.position.set(0, 200, barWidth / 2);
                                        barGroup.add(title1)
                                        barGroup.position.set(90, 80, 0)
                                        scene.add(barGroup);
                                    });
                                }
                                break
                            case 4:
                                break
                            default:
                                break
                        }
                    }

                });
                // type int, --0: dataVis  1:glft model   2:image   3:video   4:text
            });


        })
    }
}

function highlightComponent() {
    console.log(props.pointsArray)
    const lastComp = scene.getObjectByName("last_comp")
    if (lastComp) {
        scene.remove(lastComp);
    }
    if (props.pointsArray && props.pointsArray.length > 0) {
        const material = new THREE.LineBasicMaterial({ color: 0xff4500 });
        const geometry = new THREE.BufferGeometry().setFromPoints(props.pointsArray);
        const line = new THREE.LineLoop(geometry, material);	//将点和材质传入，绘制线
        line.name = "last_comp"
        scene.add(line);	//加入场景
    }
}
function generateQR() {
    showDrawer.value = true
    console.log(showDrawer)
}
</script>

<style scoped></style>
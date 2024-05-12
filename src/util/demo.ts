import { threeSceneStore } from '@/stores/threeScene';
import { THREE } from 'aframe';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

///////////////////// 创建地球 ///////////////////////////////
let geometry = new THREE.SphereGeometry(80, 32, 32);
let texture = new THREE.TextureLoader().load('/assets/glob_texture.jpg'); // 请确保有地球的纹理图片
const material = new THREE.MeshPhongMaterial({ map: texture });
const earth = new THREE.Mesh(geometry, material);
texture.needsUpdate = true;
earth.position.set(150, 100, 80)
//////////////////// 创建柱状图 //////////////////////////////
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

    barGroup.position.set(100, 180, 0)
});
// 动画循环
export default function entityRender() {
    const threeSceneAPI = threeSceneStore()
    function animate() {
        if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
            requestAnimationFrame(animate);
            earth.rotation.y += 0.01;
            threeSceneAPI.render();
        }
    }
    if (threeSceneAPI.camera && threeSceneAPI.renderer && threeSceneAPI.scene) {
        // controls = new OrbitControls(threeSceneAPI.camera, threeSceneAPI.renderer.domElement);
        threeSceneAPI.entities.get(2).setObject3D('mesh', barGroup);
        // threeSceneAPI.entities.get(5).setObject3D('mesh', earth);
        animate();
    }
}

import { threeSceneStore } from '../stores/threeScene';
import * as echarts from 'echarts';
import { THREE } from 'aframe';

let canvas = <HTMLCanvasElement><unknown>document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
var myChart = echarts.init(canvas);
myChart.setOption({
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
});
// {
//   "title": {
//     "text": "ECharts 入门示例"
//   },
//   "tooltip": {},
//   "xAxis": {
//     "data": ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
//   },
//   "yAxis": {},
//   "series": [
//     {
//       "name": "销量",
//       "type": "bar",
//       "data": [5, 20, 36, 10, 10, 20]
//     }
//   ]
// }

var texture = new THREE.Texture(canvas);
var material = new THREE.MeshBasicMaterial({ map: texture, opacity: 1, transparent: true });
const planeGeo = new THREE.BoxGeometry(300, 10, 300);
const plane = new THREE.Mesh(planeGeo, material)
// plane.position.set(80,0,0)
plane.position.set(80, 10, -150)

texture.needsUpdate = true;


const cubeSize = 10;
const cubeGeo = new AFRAME.THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new AFRAME.THREE.MeshPhongMaterial({ color: '#8AC' });
const cube = new AFRAME.THREE.Mesh(cubeGeo, cubeMat);
// cube.position.set(60, 0, 0)


export default function entityRender() {
  const threeSceneAPI = threeSceneStore()
  threeSceneAPI.entities.get('test').setObject3D('mesh', plane);
  // threeSceneAPI.entity.setObject3D('mesh', cube);

}


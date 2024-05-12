<template>
    <div>
        <!-- 遮罩 -->
        <div v-if="createVis" class="z-49 bg-black opacity-45 fixed left-0 top-0 w-full h-full"></div>
        <!-- createVis弹窗 -->
        <div v-if="createVis"
            class="overflow-auto bg-white rounded-lg shadow dark:bg-gray-700 z-50 absolute top-[60px] left-[470px] p-6 w-[650px] h-[620px]">
            <div class="flex items-center justify-between px-5 rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    新建可视化组件
                </h3>
                <button type="button" @click="closeModal"
                    class="text-gray-400 bg-transparent cursor-pointer border-0 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="px-5 space-y-4">
                <div class="w-72 mt-4 mb-10">
                    <div class="relative h-6 border-0">
                        <input v-model="modelName"
                            class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-200 focus:border-gray-900"
                            placeholder=" " />
                        <label
                            class="flex w-full h-full select-none pointer-events-none absolute left-4 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-gray-200 peer-focus:before:!border-gray-900 after:border-gray-200 peer-focus:after:!border-gray-900">请输入模型名称
                        </label>
                    </div>
                </div>

                <textarea v-model="echartsOption" rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="请输入ECharts Option 代码……"></textarea>
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button @click="renderEcharts" data-modal-hide="static-modal" type="button"
                    class="py-2.5 px-5 cursor-pointer  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    预览</button>
                <button @click="createVisModel" data-modal-hide="static-modal" type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 ms-3 border-0 cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    确认</button>
            </div>
            <div class="px-5 space-y-4">
                <canvas class="shadow-lg w-[600px] h-[600px]" id="echart"></canvas>
            </div>
        </div>

        <div class="relative" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div class="right-0 pointer-events-none fixed top-[48px] bottom-0 flex">
                <div class="pointer-events-auto relative w-[300px]">
                    <div class="overflow-auto flex h-full flex-col bg-white py-6 shadow-2xl">
                        <div class="px-4 sm:px-6">
                            <p class="text-xl font-semibold text-gray-900">
                                组件模型列表</p>
                        </div>
                        <div v-if="props.cid" class="max-h-[45%] mt-2 flex-1 px-4 sm:px-6 overflow-auto">
                            <div class="grid divide-y divide-neutral-200 mx-auto">
                                <div class="py-3">
                                    <details class="group">
                                        <summary
                                            class="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span> 数据可视化</span>
                                            <span class="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div class="mt-3 group-open:animate-fadeIn">
                                            <!-- 可视化（type==0）模型列表 -->
                                            <div v-for="model in models"
                                                class="w-full text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <button v-if="model.type == 0" type="button" @click="clickModel(model)"
                                                    class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium cursor-pointer bg-white border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                                    {{ model.name }}
                                                </button>
                                            </div>
                                            <basicButton @click="openModal" :title="'新建3D图层'"
                                                data-modal-target="static-modal" data-modal-toggle="static-modal"
                                                :svg="'M9.16667,1.66667C5.02453,1.66667,1.66667,5.02453,1.66667,9.16667C1.66667,13.3088,5.02453,16.6667,9.16667,16.6667C13.3088,16.6667,16.6667,13.3088,16.6667,9.16667C16.6667,5.02453,13.3088,1.66667,9.16667,1.66667C9.16667,1.66667,9.16667,1.66667,9.16667,1.66667ZM0,9.16667C0,4.10406,4.10406,0,9.16667,0C14.2292,0,18.3333,4.10406,18.3333,9.16667C18.3333,14.2292,14.2292,18.3333,9.16667,18.3333C4.10406,18.3333,0,14.2292,0,9.16667C0,9.16667,0,9.16667,0,9.16667ZM9.16667,5C9.62692,5,10,5.3731,10,5.83333C10,5.83333,10,8.33333,10,8.33333C10,8.33333,12.5,8.33333,12.5,8.33333C12.9602,8.33333,13.3333,8.70642,13.3333,9.16667C13.3333,9.62692,12.9602,10,12.5,10C12.5,10,10,10,10,10C10,10,10,12.5,10,12.5C10,12.9602,9.62692,13.3333,9.16667,13.3333C8.70642,13.3333,8.33333,12.9602,8.33333,12.5C8.33333,12.5,8.33333,10,8.33333,10C8.33333,10,5.83333,10,5.83333,10C5.3731,10,5,9.62692,5,9.16667C5,8.70642,5.3731,8.33333,5.83333,8.33333C5.83333,8.33333,8.33333,8.33333,8.33333,8.33333C8.33333,8.33333,8.33333,5.83333,8.33333,5.83333C8.33333,5.3731,8.70642,5,9.16667,5C9.16667,5,9.16667,5,9.16667,5Z'">
                                            </basicButton>
                                        </div>
                                    </details>
                                </div>

                                <div class="py-3">
                                    <details class="group">
                                        <summary
                                            class="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span> 3D模型</span>
                                            <span class="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div class="mt-3 group-open:animate-fadeIn">
                                            <div v-for="model in models"
                                                class="w-full text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <button v-if="model.type == 1" type="button" @click="clickModel(model)"
                                                    class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium cursor-pointer bg-white border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                                    {{ model.name }}
                                                </button>
                                            </div>
                                            <input type="file" @change="createModel">
                                        </div>
                                    </details>
                                </div>
                                <div class="py-3">
                                    <details class="group">
                                        <summary
                                            class="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span> 图片</span>
                                            <span class="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div class="mt-3 group-open:animate-fadeIn">
                                            <div v-for="model in models"
                                                class="w-full text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <button v-if="model.type == 2" type="button" @click="clickModel(model)"
                                                    class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium cursor-pointer bg-white border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                                    {{ model.name }}
                                                </button>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                                <div class="py-3">
                                    <details class="group">
                                        <summary
                                            class="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span>视频</span>
                                            <span class="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div class="mt-3 group-open:animate-fadeIn">
                                            <div v-for="model in models"
                                                class="w-full text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <button v-if="model.type == 3" type="button" @click="clickModel(model)"
                                                    class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium cursor-pointer bg-white border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                                    {{ model.name }}
                                                </button>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                                <div class="py-3">
                                    <details class="group">
                                        <summary
                                            class="flex justify-between items-center font-medium cursor-pointer list-none">
                                            <span>文字</span>
                                            <span class="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </summary>
                                        <div class="mt-3 group-open:animate-fadeIn">
                                            <div v-for="model in models"
                                                class="w-full text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <button v-if="model.type == 4" type="button" @click="clickModel(model)"
                                                    class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium cursor-pointer bg-white border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                                    {{ model.name }}
                                                </button>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </div>
                            <!-- 编辑模型 -->
                            <div class="fixed bottom-0">
                                <div v-if="selectedModelId" class="ml-[-40px] overflow-auto">
                                    <ul class="divide-y divide-gray-200">
                                        <li class="flex justify-between items-center">
                                            <span class="mr-2 text-[#7ea5e4] underline underline-offset-4">位置</span>
                                            <span class="mx-3 text-sm">x</span>
                                            <input type="text" v-model="modelAttr.position.x"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                            <span class="mx-3 text-sm">y</span>
                                            <input type="text" v-model="modelAttr.position.y"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                            <span class="mx-3 text-sm">z</span>
                                            <input type="text" v-model="modelAttr.position.z"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                        </li>
                                        <li class="mt-3 flex justify-between items-center">
                                            <span class="mr-2 text-[#7ea5e4] underline underline-offset-4">缩放</span>
                                            <span class="mx-3 text-sm">x</span>
                                            <input type="text" v-model="modelAttr.scale.x"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                            <span class="mx-3 text-sm">y</span>
                                            <input type="text" v-model="modelAttr.scale.y"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                            <span class="mx-3 text-sm">z</span>
                                            <input type="text" v-model="modelAttr.scale.z"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                        </li>
                                        <li class="mt-3 flex justify-between items-center">
                                            <span class="mr-2 text-[#7ea5e4] underline underline-offset-4">旋转</span>
                                            <span class="mx-3 text-sm">x</span>
                                            <input type="text" v-model="modelAttr.rotation.x"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                            <span class="mx-3 text-sm">y</span>
                                            <input type="text" v-model="modelAttr.rotation.y"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                            <span class="mx-3 text-sm">z</span>
                                            <input type="text" v-model="modelAttr.rotation.z"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                        </li>
                                        <li class="mt-3 flex justify-between items-center">
                                            <span class="mr-2 text-[#7ea5e4] underline underline-offset-4">透明度</span>
                                            <input type="text" v-model="modelAttr.opacity"
                                                class="h-5 w-5 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                        </li>
                                        <li class="mt-3 flex justify-between items-center">
                                            <span class="mr-2 text-[#7ea5e4] underline underline-offset-4">超链接</span>
                                            <input type="text" v-model="modelAttr.hyper_link"
                                                class="h-5 w-50 p-2 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none">
                                        </li>
                                    </ul>
                                </div>
                                <div v-else class="px-4 mb-10 sm:px-6 text-gray-400">
                                    请在上方新建或选择模型
                                </div>
                            </div>
                        </div>
                        <div v-else class="px-4 sm:px-6 text-gray-400">
                            请在左侧面版新建或选择组件
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue';
import { modelStore } from '@/stores/model';
import basicButton from './buttons/basicButton.vue';
import * as echarts from 'echarts';
const props = defineProps({
    cid: Number,
    poster: String,
    renderModels: Boolean
})
function getAllModels() {
    if (props.cid != undefined)
        modelApi.getModelListByCID(props.cid).then((res: any) => {
            console.log(res)
            models.value = res.data
        })
}
const emits = defineEmits(['triggerModal', 'changeModelList'])
const createVis = ref(false)
const modelApi = modelStore()
const models = ref()
const selectedModelId = ref()
const modelAttr = ref({ name: '', scale: { x: 1, y: 1, z: 1 }, position: { x: 1, y: 1, z: 1 }, rotation: { x: 0, y: 0, z: 0 }, opacity: 1, hyper_link: '' })
const echartsOption = ref()
const modelName = ref()
let myChart: echarts.ECharts;
function clickModel(model: any) {
    selectedModelId.value = model['id']
    modelAttr.value.name = model['name']
    modelAttr.value.scale.x = model['scale'][0]
    modelAttr.value.scale.y = model['scale'][1]
    modelAttr.value.scale.z = model['scale'][2]
    modelAttr.value.position.x = model['position'][0]
    modelAttr.value.position.y = model['position'][1]
    modelAttr.value.position.z = model['position'][2]
    modelAttr.value.rotation.x = model['rotation'][0]
    modelAttr.value.rotation.y = model['rotation'][1]
    modelAttr.value.rotation.z = model['rotation'][2]
    modelAttr.value.opacity = model['opacity']
    modelAttr.value.hyper_link = model['hyper_link']
}
watch(modelAttr, () => {
    modelApi.editModel({
        id: selectedModelId.value, name: modelAttr.value.name, scale: [modelAttr.value.scale.x, modelAttr.value.scale.y, modelAttr.value.scale.z],
        position: [modelAttr.value.position.x, modelAttr.value.position.y, modelAttr.value.position.z], rotation: [Number(modelAttr.value.rotation.x), Number(modelAttr.value.rotation.y), Number(modelAttr.value.rotation.z)],
        opacity: modelAttr.value.opacity, hyper_link: modelAttr.value.hyper_link
    }).then((res:any)=>{
        console.log(res.data)
        emits('changeModelList');
    })
}, { deep: true })
//数据可视化模型创建
function openModal() {
    createVis.value = true;
    emits('triggerModal');
    nextTick(() => {
        let canvas = <HTMLCanvasElement><unknown>document.querySelector('#echart')
        canvas.width = 600;
        canvas.height = 600;
        myChart = echarts.init(canvas);
    })
}
function closeModal() {
    myChart.clear();
    createVis.value = false;
    emits('triggerModal');
}
function renderEcharts() {
    console.log(echartsOption.value)
    // myChart.setOption(JSON.parse(echartsOption.value));
    myChart.setOption(eval('(' + echartsOption.value + ')'));

}
function createVisModel() {
    if (props.cid != undefined)
        modelApi.createModel({ component_id: props.cid, name: modelName.value, type: 0, data: echartsOption.value }).then((res: any) => {
            console.log(res);
            closeModal();
            emits('changeModelList');
        })
}
function createModel(event:any) {
    const file = event.target.files[0];
    if (props.cid != undefined && file)
        modelApi.createModel({ component_id: props.cid, name: '1', type: 3,video_url:''}).then((res: any) => {
            console.log(res);
            emits('changeModelList');
        })
}
//TODO: 上传模型文件
onMounted(() => {
    getAllModels()

})
watch(() => { props.cid, props.renderModels }, () => {
    getAllModels()
}, { deep: true })
</script>

<style scoped></style>
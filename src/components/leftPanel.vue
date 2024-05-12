<template>
    <div v-if="showDrawer"
        class="overflow-auto bg-white rounded-lg dark:bg-gray-700 z-50 absolute top-[65px] left-[200px] p-3 w-[300px] h-[120px] shadow-2xl">
        <button type="button" @click="() => showDrawer = false"
            class=" text-gray-400 bg-transparent cursor-pointer border-0 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
        <input type="text" v-model="newCompName"
            class="h-10 w-30 pl-10 pr-20 rounded-lg z-0 border-gray-300 outline-gray-500 focus:shadow focus:outline-none "
            placeholder="请输入组件名称……">
        <button type="button" @click="() => {showDrawer = false;startPicking=true}"
            class="mt-2 ml-56 px-4 text-white bg-[#6590D5] hover:bg-[#3061AF] cursor-pointer border-0 rounded-lg text-sm w-18 h-8 justify-between items-center dark:hover:bg-gray-600 dark:hover:text-white">
            确 认
        </button>
    </div>
    <div>
        <div class="relative" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div class="left-0 pr-10 pointer-events-none fixed top-[48px] bottom-0 flex">
                <div class="pointer-events-auto relative w-screen max-w-md">
                    <div class="flex h-full flex-col bg-white py-6 shadow-2xl">
                        <div class="px-4 sm:px-6 flex justify-between">
                            <basicButton :title="'新建3D图层'" @click="showDrawer = true"
                                :svg="'M9.16667,1.66667C5.02453,1.66667,1.66667,5.02453,1.66667,9.16667C1.66667,13.3088,5.02453,16.6667,9.16667,16.6667C13.3088,16.6667,16.6667,13.3088,16.6667,9.16667C16.6667,5.02453,13.3088,1.66667,9.16667,1.66667C9.16667,1.66667,9.16667,1.66667,9.16667,1.66667ZM0,9.16667C0,4.10406,4.10406,0,9.16667,0C14.2292,0,18.3333,4.10406,18.3333,9.16667C18.3333,14.2292,14.2292,18.3333,9.16667,18.3333C4.10406,18.3333,0,14.2292,0,9.16667C0,9.16667,0,9.16667,0,9.16667ZM9.16667,5C9.62692,5,10,5.3731,10,5.83333C10,5.83333,10,8.33333,10,8.33333C10,8.33333,12.5,8.33333,12.5,8.33333C12.9602,8.33333,13.3333,8.70642,13.3333,9.16667C13.3333,9.62692,12.9602,10,12.5,10C12.5,10,10,10,10,10C10,10,10,12.5,10,12.5C10,12.9602,9.62692,13.3333,9.16667,13.3333C8.70642,13.3333,8.33333,12.9602,8.33333,12.5C8.33333,12.5,8.33333,10,8.33333,10C8.33333,10,5.83333,10,5.83333,10C5.3731,10,5,9.62692,5,9.16667C5,8.70642,5.3731,8.33333,5.83333,8.33333C5.83333,8.33333,8.33333,8.33333,8.33333,8.33333C8.33333,8.33333,8.33333,5.83333,8.33333,5.83333C8.33333,5.3731,8.70642,5,9.16667,5C9.16667,5,9.16667,5,9.16667,5Z'">
                            </basicButton>
                            <basicButton :title="'更新海报源'" @click=""
                                :svg="'M9.16667,1.66667C5.02453,1.66667,1.66667,5.02453,1.66667,9.16667C1.66667,13.3088,5.02453,16.6667,9.16667,16.6667C13.3088,16.6667,16.6667,13.3088,16.6667,9.16667C16.6667,5.02453,13.3088,1.66667,9.16667,1.66667C9.16667,1.66667,9.16667,1.66667,9.16667,1.66667ZM0,9.16667C0,4.10406,4.10406,0,9.16667,0C14.2292,0,18.3333,4.10406,18.3333,9.16667C18.3333,14.2292,14.2292,18.3333,9.16667,18.3333C4.10406,18.3333,0,14.2292,0,9.16667C0,9.16667,0,9.16667,0,9.16667ZM9.16667,5C9.62692,5,10,5.3731,10,5.83333C10,5.83333,10,8.33333,10,8.33333C10,8.33333,12.5,8.33333,12.5,8.33333C12.9602,8.33333,13.3333,8.70642,13.3333,9.16667C13.3333,9.62692,12.9602,10,12.5,10C12.5,10,10,10,10,10C10,10,10,12.5,10,12.5C10,12.9602,9.62692,13.3333,9.16667,13.3333C8.70642,13.3333,8.33333,12.9602,8.33333,12.5C8.33333,12.5,8.33333,10,8.33333,10C8.33333,10,5.83333,10,5.83333,10C5.3731,10,5,9.62692,5,9.16667C5,8.70642,5.3731,8.33333,5.83333,8.33333C5.83333,8.33333,8.33333,8.33333,8.33333,8.33333C8.33333,8.33333,8.33333,5.83333,8.33333,5.83333C8.33333,5.3731,8.70642,5,9.16667,5C9.16667,5,9.16667,5,9.16667,5Z'">
                            </basicButton>
                        </div>
                        <div
                            :class="`${startPicking ? '' : 'overflow-auto max-h-[300px] w-[415px] '} absolute top-20 mx-4 `">
                            <imagePicker :startPicking="startPicking" :poster="props.poster" :pid="props.pid" :newCompName="newCompName" @stopPicking="stopPicking">
                            </imagePicker>
                        </div>
                        <div class="mt-[340px] mx-4 overflow-auto">
                            <ul v-for="item in components" class="divide-y divide-gray-200">
                                <li @click="emits('selectComp', item)"
                                    class="p-3 flex justify-between items-center user-card cursor-pointer">
                                    <div class="flex items-center">
                                        <img class="w-10 h-10" :src="item.source_url">
                                        <span class="ml-3 font-medium">{{ item.name }}</span>
                                    </div>
                                    <div>
                                        <button
                                            class="text-gray-500 border-0 bg-transparent hover:text-gray-700 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 6h16M4 12h16m-7 6h7" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import basicButton from './buttons/basicButton.vue';
import imagePicker from '@/components/imagePicker.vue'
import { componentStore } from '@/stores/component';
const components = ref()
const props = defineProps({
    pid: Number,
    poster: String
})
const emits = defineEmits(['selectComp'])
const componentApi = componentStore()
let startPicking = ref(false)
const showDrawer = ref(false)
const newCompName = ref('')
function stopPicking() {
    startPicking.value = false;
    fetchComponents()
}

function fetchComponents() {
    if (props.pid != undefined)
        componentApi.getComponentList(props.pid).then((res: any) => {
            components.value = res.data
            console.log(components.value)
        })
}

watch(() => props.pid, () => {
    fetchComponents()
}, { deep: true })

onMounted(() => {
    fetchComponents()
})

</script>

<style scoped></style>
<template>
    <NavBar></NavBar>
    <div class="h-full w-full flex-col justify-center overflow-auto py-8 px-8 bg-slate-100">
        <h2 class="mb-4 font-bold text-xl text-gray-600">我的AR海报文件</h2>
        <div class="flex w-[50%] mb-6 rounded bg-white">
            <input class=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
                type="search" name="search" placeholder="搜索文件..." />
            <button type="submit" class="m-2 rounded bg-blue-600 px-4 py-2 text-white">
                <svg class="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                    viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve"
                    width="512px" height="512px">
                    <path
                        d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
            </button>
        </div>
        <div class="grid w-full sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div v-for="item in projects">
                <div @click="jumpToProject(item)"
                    class="relative flex flex-col shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer duration-300 max-w-sm">
                    <a href="" class="hover:text-orange-600 absolute z-30 top-2 right-0 mt-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </a>
                    <!-- <a href=""
                        class="z-20 absolute h-full w-full top-0 left-0 ">&nbsp;</a> -->
                    <div class="h-auto overflow-hidden">
                        <div class="h-44 overflow-hidden relative">
                            <img :src="item.poster_url" class="w-full">
                        </div>
                    </div>
                    <div class="bg-white py-4 px-3">
                        <h3 class="text-s mb-2 font-medium">{{ item.name }}</h3>
                        <div class="flex justify-between items-center">
                            <p class="text-xs text-gray-400">
                                {{ '尺寸' + item.width + 'x' + item.height }}
                            </p>
                            <div class="relative z-40 flex items-center gap-2">
                                <a class="text-orange-600 hover:text-blue-500" href="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </a>
                                <a class="text-orange-600 hover:text-blue-500" href="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/navBar.vue';
import { useRouter } from 'vue-router'
import { projectStore } from '@/stores/project';
import { onMounted, ref } from 'vue';
const projectApi = projectStore();
const projects = ref();
const router = useRouter();
onMounted(() => {
    fetchProjects()
})
function fetchProjects() {
    projectApi.getProjectList().then((res: any) => {
        projects.value = res.data;
        console.log(res.data)
    }
    )
}
function jumpToProject(item:any) {
    projectApi.setProject(item);
    router.push({path:`/editing/${item.id}`})
}
</script>

<style scoped></style>
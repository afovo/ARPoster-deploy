<template>
    <navBar></navBar>
    <leftPanel :pid="project.id" :poster="project.poster_url" @selectComp="changeSelectComponent"></leftPanel>
    <centerPanel v-if="showCenterPanel" :pid="project.id" :poster="project.poster_url" :width="project.width" :height="project.height" :scaler="scaler"
        :cid="componentId" :pointsArray="pointsArray" :renderModels="renderModels"></centerPanel>
    <rightPanel :cid="componentId" :renderModels="renderModels" @triggerModal="changeCenterVisable" @changeModelList="renderModelList"></rightPanel>
</template>

<script setup lang="ts">
import leftPanel from '@/components/leftPanel.vue';
import rightPanel from '@/components/rightPanel.vue';
import navBar from '@/components/navBar.vue';
import { projectStore } from '@/stores/project';
import { onMounted, ref } from 'vue';
import centerPanel from '@/components/centerPanel.vue';
import { THREE } from 'aframe';
const projectApi = projectStore()
const project = ref(projectApi.getCurrentProject);
const componentId = ref(0)
const pointsArray = ref(new Array()) //绘制component方框
const scaler = ref(1)
const showCenterPanel = ref(true) //控制centerPanel画布隐藏
const renderModels = ref(false) //监听当前项目model表是否有变化，有则重新渲染中央画布
function changeCenterVisable() {
    showCenterPanel.value = !showCenterPanel.value
}
function generateQR() {
    
}
function renderModelList() {
    renderModels.value = !renderModels.value
}
function changeSelectComponent(component: any) {
    componentId.value = component.id;
    let tmp = [component.position_x - project.value.width / 2, project.value.height / 2 - component.position_y]
    console.log(pointsArray.value)
    pointsArray.value = [
        new THREE.Vector3(tmp[0]/scaler.value, tmp[1]/scaler.value, 10),
        new THREE.Vector3((tmp[0] + component.width)/scaler.value, tmp[1]/scaler.value, 10),
        new THREE.Vector3((tmp[0] + component.width)/scaler.value, (tmp[1] - component.height)/scaler.value, 10),
        new THREE.Vector3(tmp[0]/scaler.value, (tmp[1] - component.height)/scaler.value, 10)]
}
onMounted(() => {
    project.value = projectApi.getCurrentProject
    scaler.value = Math.ceil(project.value.width / 500)
})
</script>

<style scoped></style>
<template>
  <div @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" class="max-w-[400px]">
    <img ref="image" :src="props.poster" class="max-h-[600px] w-auto">
    <div v-if="isSelecting"
      :style="{ left: selectionBox.left + 'px', top: selectionBox.top + 'px', width: selectionBox.width + 'px', height: selectionBox.height + 'px', border: '1px solid red', position: 'absolute' }">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { componentStore } from '@/stores/component';
const props = defineProps({
  startPicking: Boolean, //whether the user click on "新建3D图层"
  pid: Number,
  poster: String,
  newCompName: String
})
const emits = defineEmits(['stopPicking', 'renderCompList'])
const image = ref()
const componentApi = componentStore()
let scaler = 1 // scaler for prohibiting image customizing

const isSelecting = ref(false);
const selectionBox = ref({ left: 0, top: 0, width: 0, height: 0 });
let startX = 0;
let startY = 0;


const onMouseDown = (event) => {
  if (props.startPicking) {
    scaler = image.value.naturalWidth / image.value.width
    image.value.setAttribute('crossOrigin', 'anonymous');
    isSelecting.value = true;
    startX = event.clientX;
    startY = event.clientY;
  }

};

const onMouseMove = (event) => {
  if (isSelecting.value) {
    const containerRect = image.value.getBoundingClientRect();
    const left = Math.min(startX, event.clientX) - containerRect.left;
    const top = Math.min(startY, event.clientY) - containerRect.top;
    const width = Math.abs(event.clientX - startX);
    const height = Math.abs(event.clientY - startY);
    selectionBox.value = { left: left, top: top, width: width, height: height };
  }
};

const onMouseUp = () => {
  if (isSelecting.value) {
    isSelecting.value = false;
    saveSelectedArea();
  }
};

const saveSelectedArea = () => {
  console.log('scaler: ', scaler)
  let canvas = document.createElement('canvas');
  canvas.width = selectionBox.value.width * scaler;
  canvas.height = selectionBox.value.height * scaler;
  console.log(selectionBox.value);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image.value, selectionBox.value.left * scaler, selectionBox.value.top * scaler, selectionBox.value.width * scaler, selectionBox.value.height * scaler, 0, 0, selectionBox.value.width * scaler, selectionBox.value.height * scaler);
  const dataUrl = canvas.toDataURL('image/jpeg');
  console.log(dataUrl)
  const newImage = new Image();

  newImage.onload = () => {
    const newWidth = newImage.width;
    const newHeight = newImage.height;
    const offsetX = selectionBox.value.left * scaler;
    const offsetY = selectionBox.value.top * scaler;
    // saveImageLocally(dataUrl);
    console.log('新图片的宽&长:', newWidth, newHeight);
    console.log('相对于原图片的位置X&Y:', offsetX, offsetY);
  };
  newImage.src = dataUrl;
  console.log(props.newCompName)
  componentApi.createComponent({ name: props.newCompName, pid: props.pid, url: 'https://ar-poster-1314867896.cos.ap-guangzhou.myqcloud.com/images/poster1-comp3.jpg', position_x: selectionBox.value.left * scaler, position_y: selectionBox.value.top * scaler, width: selectionBox.value.width * scaler, height: selectionBox.value.height * scaler }).then((res) => {
    console.log(res.data)
  })
  emits('stopPicking')
};

const saveImageLocally = (dataUrl) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'selected_image.jpg';
  link.click();
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
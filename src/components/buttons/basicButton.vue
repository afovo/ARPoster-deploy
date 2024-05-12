<template>
    <button
        class="inline-flex items-center px-6 py-2 border-0 bg-[#6590D5] hover:bg-[#3061AF] cursor-pointer text-white text-sm font-medium rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1"
            width="18.333332061767578" height="18.333332061767578" viewBox="0 0 18.333332061767578 18.333332061767578">
            <g>
                <path
                    :d="props.svg"
                    fill-rule="evenodd" fill="#FFFFFF" />
            </g>
        </svg>
        <text class="ml-2">{{ props.title }}</text>
    </button>
</template>

<script setup lang="ts">
const props = defineProps({
    title: String,
    svg: String
})
</script>

<style scoped></style>
<template>
    <div>
        <div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div :class="`${props.position == 'l' ? 'left-0 pr-10' : 'right-0 pl-10'} 
                                  pointer-events-none fixed inset-y-2 flex max-w-full  ease-in-out duration-500 sm:duration-700
                                  ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`">
                        <div class="pointer-events-auto relative w-screen max-w-md">
                            <div class="-ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                <button type="button" @click="togglePanel"
                                    class="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                    <span class="absolute -inset-2.5"></span>
                                    <span class="sr-only">Close panel</span>
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                <div class="px-4 sm:px-6">
                                    <h2 class="text-base font-semibold leading-6 text-gray-900" id="slide-over-title">
                                        Panel title</h2>
                                </div>
                                <div class="relative mt-6 flex-1 px-4 sm:px-6">
                                    <!-- Your content -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
    position: String //r:right  l:left
})
let isPanelOpen = ref(true)
function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value;
}
</script>

<style scoped></style>
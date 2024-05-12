<template>
  <!-- <ArWorld/> -->
  <router-view></router-view>
  <!-- <ThreeTest></ThreeTest> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArWorld from './views/ArWorld/index.vue'
import ArPoster from './views/ArPoster.vue'
import Test from './components/Test.vue'
import ThreeTest  from './components/ThreeTest.vue'
</script>

<style scoped></style>

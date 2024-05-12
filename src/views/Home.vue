<template>
    <div class="bg-gray-100 flex justify-center items-center h-screen">
    <!-- Left: Image -->
<div class="w-1/2 h-screen hidden lg:block">
  <img src="https://placehold.co/800x/667fff/ffffff.png?text=ARPOSTER&font=Montserrat" alt="Placeholder Image" class="object-cover w-full h-full">
</div>
<!-- Right: Login Form -->
<div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
  <!-- <h1 class="text-3xl font-semibold mb-4">登录</h1> -->
  <div class="text-lg">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="username" class="block text-gray-600 mb-4">用户</label>
      <input type="text" id="username" name="username" class="mb-4 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off">
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600 mb-4">密码</label>
      <input type="password" id="password" name="password" class="mb-4 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off">
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">
      <input type="checkbox" id="remember" name="remember" class="text-blue-500">
      <label for="remember" class="text-gray-600 ml-2">记住密码</label>
    </div>
    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="projects" class="hover:underline">忘记密码</a>
    </div>
    <!-- Login Button -->
    <button @click="login()" class="bg-blue-500 border-0 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full cursor-pointer text-lg">登录</button>
</div>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <a href="projects" class="hover:underline">注册</a>
  </div>
</div>
</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ArDemo from './ArDemo.vue';
import ArDemo1 from './ArDemo1.vue';
const router = useRouter();
function login(){
    router.push({path:`/projects`})
}
</script>

<style scoped></style>
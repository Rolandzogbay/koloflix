<template>
  <div class="flex h-screen overflow-hidden bg-(--color-bg) text-(--color-text)">
    
    <!-- Sidebar (fixed) -->
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content wrapper -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Navbar (fixed) -->
      <Navbar @toggleSidebar="sidebarOpen = !sidebarOpen" />

      <!-- Page Scroll Area -->
      <main class="flex-1 overflow-y-auto p-4 pt-20">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "./components/navigation/Navbar.vue";
import Sidebar from "./components/navigation/Sidebar.vue";

const sidebarOpen = ref(false);
</script>

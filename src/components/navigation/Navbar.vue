<template>
  <nav
    class="fixed top-0 left-0 right-0 z-100 p-3 flex items-center justify-between px-4 shadow-md
           bg-(--color-bg) text-(--color-text) border-b-(--color-text) border-b transition-colors">

    <!-- Left Section -->
    <div class="flex items-center space-x-3">
      <!-- Hamburger (mobile only) -->
      <button
        v-if="!sidebarOpen"
        @click="toggleSidebar"
        class="p-2 rounded hover:bg-(--color-hover) md:hidden"
      >
        <i class="fa-solid fa-bars text-2xl"></i>
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2 cursor-pointer">
        <img v-if="darkMode" src="../../assets/icons/logo.png" class="h-14 w-25" alt="KoloFlix" />
        <img v-else src="../../assets/icons/pngLogo.png" class="h-14 w-25" alt="KoloFlix" />
      </router-link>
    </div>

    <!-- Center Section: Search Bar -->
    <SearchBar />
    
    <!-- Right Section -->
    <div class="flex items-center space-x-3">
      <!-- Theme Toggle -->
      <button @click="toggleTheme" class="p-2 rounded hover:bg-(--color-hover)">
        <i v-if="darkMode" class="fa-solid fa-moon text-lg"></i>
        <i v-else class="fa-solid fa-sun text-lg"></i>
      </button>

      <!-- Login -->
      <button class="px-4 py-2 rounded font-semibold bg-(--color-accent) text-white hover:opacity-90 hidden sm:block">
        Login
      </button>

      <!-- Signup -->
      <button class="px-4 py-2 rounded border font-semibold border-(--color-text) hover:bg-(--color-hover) hidden sm:block">
        Sign Up
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SearchBar from '../ui/SearchBar.vue';

const props = defineProps({
  sidebarOpen: Boolean
});
const emit = defineEmits(['toggle-sidebar']);

function toggleSidebar() {
  emit('toggle-sidebar');
}

/* THEME LOGIC */
const darkMode = ref(false);

onMounted(() => {
  darkMode.value = localStorage.theme === 'dark';
  if (darkMode.value) document.documentElement.classList.add('dark');
});

function toggleTheme() {
  darkMode.value = !darkMode.value;

  if (darkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
}
</script>

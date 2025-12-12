<template>
  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 lg:hidden z-40"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 ease-in-out',
      'bg-(--color-sidebar) text-(--color-text) shadow-lg',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0 lg:static'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-(--color-hover)">
      <h2 class="font-bold text-lg">Menu</h2>
      <button @click="closeSidebar" class="lg:hidden">
        <i class="fa-solid fa-xmark text-(--color-text) text-2xl"></i>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="mt-6">
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.to"
        class="flex text-base items-center gap-3 px-4  py-3 rounded-lg transition-all"
        :class="{
          'bg-(--color-hover) text-(--color-accent) font-semibold': isActive(item.to),
          'hover:bg-(--color-hover)': !isActive(item.to)
        }"
      >
        <i :class="item.icon" class="text-lg"></i>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close']);
const route = useRoute();

const closeSidebar = () => emit('close');

// Navigation links
const menu = [
  { name: "Home", to: "/", icon: "fa-solid fa-house" },
  { name: "Popular Movies", to: "/popular", icon: "fa-solid fa-fire" },
  { name: "Top Rated Movies", to: "/top-rated", icon: "fa-solid fa-star" },
  { name: "Upcoming Series", to: "/upcoming", icon: "fa-solid fa-calendar" },
  { name: "Trending Movies", to: "/trending", icon: "fa-solid fa-arrow-trend-up" },
  { name: "Search", to: "/search", icon: "fa-solid fa-magnifying-glass" },
];

// Highlight active link
const isActive = (path) => route.path === path;
</script>

<style scoped>
aside {
  backdrop-filter: blur(6px);
}
</style>

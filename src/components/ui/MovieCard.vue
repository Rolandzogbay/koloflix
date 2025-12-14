<template>
  <router-link 
    :to="`/movie/${movie.id}`"
    class="block group cursor-pointer transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-xl overflow-hidden"
  >
    <div class="relative w-full aspect-2/3">
      <img
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        :alt="movie.title"
        class="w-full h-full object-cover transition duration-300 group-hover:opacity-90"
        loading="lazy"
      />
      
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
        <div class="text-white text-left w-full">
            <p class="text-sm font-semibold line-clamp-2 mb-1">{{ movie.title }}</p>
            <div class="flex items-center text-xs text-yellow-500 gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.694h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.031a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.031a1 1 0 00-1.175 0l-2.8 2.031c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.031c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.694l1.07-3.292z" /></svg>
                <span class="font-bold">{{ movie.vote_average.toFixed(1) }}</span>
            </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    movie: {
        type: Object,
        required: true,
    }
});
</script>
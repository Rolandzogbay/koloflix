<template>
  <div class="relative">
    
    <div class="flex justify-between items-end mb-4">
      <h2 
        class="text-2xl text-(--color-text) md:text-3xl font-bold pl-3"
        :class="`border-l-4 border-${borderColor}-600 text-(--color-text)`"
      >
        {{ title }}
      </h2>
      <router-link :to="to" class="text-(--color-text) hover:text-red-400 text-sm font-semibold transition duration-200">View All &rarr;</router-link>
    </div>

    <div 
      class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8"
    >
      <div 
        v-if="movies.length === 0" 
        class="text-gray-400 py-4 col-span-4"
      >
        No movies found in this category.
      </div>

      <div
        v-for="movie in movies.slice(0, 4)"
        :key="movie.id"
        class="group cursor-pointer hover:scale-[1.03] transition duration-300"
        @click="$router.push(`/movie/${movie.id}`)"
      >
        <div class="relative group">
            <img
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              alt="Poster"
              class="rounded-xl aspect-2/3 object-cover shadow-xl transition-all duration-300 group-hover:shadow-red-800/50"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span class="text-white text-sm font-semibold border border-white/50 px-3 py-1 rounded-full">View</span>
            </div>
        </div>

        <p class="text-sm font-semibold mt-2 line-clamp-2 text-(--color-text) hover:text-red-500 transition">{{ movie.title }}</p>
        <div class="flex items-center text-xs text-gray-400 gap-2 mt-1">
            <span>{{ movie.release_date?.split('-')[0] }}</span>
            <span class="text-yellow-500 flex items-center gap-1">★ {{ movie.vote_average.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
  to: {
    type: String,
    default: '#',
  },
  borderColor: {
    type: String,
    default: 'red', 
  },
});
</script>

<style>
/* Since this component is now a static grid, scrollbar styles are no longer relevant, 
   but we leave common utility classes here for safety/consistency if needed elsewhere. */
.scroll-snap-x { scroll-snap-type: x mandatory; }
.scroll-snap-start { scroll-snap-align: start; }
.cursor-grab { cursor: grab; }
.active:cursor-grabbing { cursor: grabbing; }
</style>
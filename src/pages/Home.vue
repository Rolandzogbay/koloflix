<template>
  <!-- Featured Movie Banner -->
  <div
    v-if="featuredMovie"
    class="relative w-full h-64 md:h-80 rounded-xl mb-8 overflow-hidden"
  >
    <!-- Background Image -->
    <img
      :src="`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`"
      class="w-full h-full object-cover brightness-80"
      alt="Featured Movie"
    />

    <!-- Movie Details -->
    <div class="absolute bottom-5 left-5 text-white w-2/3">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">
        {{ featuredMovie.title }}
      </h1>

      <p class="hidden md:block text-sm opacity-90 line-clamp-3 mb-3">
        {{ featuredMovie.overview }}
      </p>
      <p class="hidden md:block text-sm opacity-90 line-clamp-3 mb-3">
        {{ featuredMovie.release_date }} | {{ featuredMovie.vote_average }} ⭐
      </p>

      <router-link
        :to="`/movie/${featuredMovie.id}`"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold inline-block"
      >
        Watch Now
      </router-link>
    </div>
  </div>

  <!-- Trending Movies Grid -->
  <div>
    <h1 class="text-3xl font-bold text-(--color-text) mt-8 mb-4">
      Most Trending
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="bg-(--color-sidebar) rounded-lg p-2 shadow hover:scale-103 transition"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          class="w-full h-60 object-center rounded"
          alt="Poster"
        />
        <h2 class="text-base font-semibold mt-2 line-clamp-1">
          {{ movie.title }}
        </h2>
        <div class="flex justify-between items-center">
            <h2 class="text-sm font-semibold text-gray-500 mt-2 line-clamp-1">
              {{ movie.release_date }}
            </h2>
            <h2 class="text-sm font-semibold text-gray-500">
                {{ movie.vote_average }} ⭐
            </h2>
        </div>
        <div>
            <router-link
                :to="`/movie/${movie.id}`"
                class="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg font-semibold inline-block text-sm"
            >
                View Details
            </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMovies } from "@/composables/movies.data";

const { movies, fetchMovies, loading, error } = useMovies();
fetchMovies();

// Use the FIRST movie as featured
const featuredMovie = computed(() => movies.value[0]);
</script>

<style scoped>
h1 {
  font-family: 'Ubuntu', sans-serif;
}
</style>

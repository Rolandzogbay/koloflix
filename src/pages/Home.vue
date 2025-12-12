<template>
  <div class="min-h-screen text-gray-100 pb-10">
    <div>
      <div
        v-if="featuredMovie"
        class="relative w-full h-[550px] md:h-[650px] mb-12"
      >
        <div class="absolute inset-0">
          <img
            :src="`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`"
            class="w-full h-full object-cover"
            alt="Featured Movie"
          />
          <div class="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          <div class="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>

        <div class="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:w-2/3">
          <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-red-600 rounded-full mb-4 inline-block">
            #1 Trending
          </span>
          
          <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            {{ featuredMovie.title }}
          </h1>

          <div class="flex items-center space-x-4 mb-6 text-sm md:text-base text-gray-300">
            <span>{{ featuredMovie.release_date?.split('-')[0] }}</span>
            <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span class="flex items-center text-yellow-400">
              ★ {{ featuredMovie.vote_average.toFixed(1) }}
            </span>
          </div>

          <p class="hidden md:block text-lg text-gray-300 line-clamp-3 mb-8 max-w-2xl">
            {{ featuredMovie.overview }}
          </p>

          <div class="flex gap-4">
            <router-link
              :to="`/movie/${featuredMovie.id}`"
              class="px-8 py-3 bg-red-600 hover:bg-red-700 animate-pulse text-white rounded-lg font-bold transition transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              Watch Now
            </router-link>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 md:px-8">
        <div class="flex justify-between items-end mb-8">
          <h2 class="text-3xl font-bold border-l-4 border-red-600 pl-4 text-(--color-text)">
            Trending Now
          </h2>
          <router-link to="/trending" class="text-red-500 hover:text-red-400 text-sm font-semibold">View All &rarr;</router-link>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <div
            v-for="movie in movies"
            :key="movie.id"
            class="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/20 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
          >
            <div class="relative aspect-2/3 overflow-hidden">
              <img
                :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                loading="lazy"
                alt="Poster"
              />
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                 <router-link
                  :to="`/movie/${movie.id}`"
                  class="px-6 py-2 bg-red-600 text-white rounded-full font-bold transform scale-90 group-hover:scale-100 transition"
                >
                  View Details
                </router-link>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-lg font-bold truncate text-white mb-1" :title="movie.title">
                {{ movie.title }}
              </h3>
              <div class="flex justify-between items-center text-sm text-gray-400">
                <span>{{ movie.release_date?.split('-')[0] }}</span>
                <span class="flex items-center text-yellow-500 gap-1">
                  ★ {{ movie.vote_average.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMovies } from "@/composables/movies.data";
import Footer from "@/components/navigation/Footer.vue";

const { movies, fetchMovies, loading, error } = useMovies();
fetchMovies();

// Use the FIRST movie as featured
const featuredMovie = computed(() => movies.value && movies.value.length > 0 ? movies.value[0] : null);
</script>

<style scoped>
/* Scoped styles kept minimal, relying on Tailwind */
</style>
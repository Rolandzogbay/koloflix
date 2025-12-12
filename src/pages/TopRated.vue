<template>
  <div class="min-h-screen text-gray-100 pb-10">
    <div class="container mx-auto px-4 md:px-8 pt-10">
      
      <div class="flex justify-between items-end mb-8">
        <h1 class="text-2xl md:text-4xl text-(--color-text) font-extrabold border-l-4 border-red-600 pl-3">
          Top Rated Movies (Page {{ currentPage }})
        </h1>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-400 text-lg">Loading top rated titles...</p>
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-500">
        <h2 class="text-2xl font-bold">Error Loading Movies</h2>
        <p class="text-gray-400">{{ error }}</p>
      </div>

      <div v-else-if="topRatedMovies.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
        <div
          v-for="movie in topRatedMovies"
          :key="movie.id"
          class="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-900/20 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
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
                class="px-5 py-2 bg-red-600 text-white rounded-full font-bold transform scale-90 group-hover:scale-100 transition"
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
      
      <div v-if="!loading && topRatedMovies.length > 0" class="flex justify-center items-center space-x-4 mt-12">
          <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-4 py-2 bg-gray-700 rounded-lg text-white font-semibold hover:bg-gray-600 transition disabled:opacity-30"
          >
              &larr; Previous
          </button>
          
          <span class="text-lg font-semibold text-(--color-text)">
              Page {{ currentPage }}
          </span>
          
          <button
              @click="changePage(currentPage + 1)"
              class="px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition"
          >
              Next &rarr;
          </button>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMovies } from "@/composables/movies.data";
import Footer from "@/components/navigation/Footer.vue";

// State
const currentPage = ref(1);

// Composable (Note: We destructure the specific state and function we need)
const { topRatedMovies, fetchTopRatedMovies, loading, error } = useMovies();

// Logic
const changePage = (newPage) => {
    if (newPage < 1) return;
    
    currentPage.value = newPage;
    
    // CALL THE NEW TOP RATED FUNCTION
    fetchTopRatedMovies(newPage);

    window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

// Initial Fetch when the page loads
changePage(currentPage.value); 
</script>
<template>
  <div class="min-h-screen text-(--color-text) pb-10">
    <div class="container mx-auto px-4 md:px-8 pt-10">
      
      <div class="flex justify-between items-end mb-8">
        <h1 class="text-3xl md:text-4xl font-semibold border-l-4 border-red-600 pl-4">
          Trending Movies
        </h1>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-400 text-lg">Loading the hottest titles...</p>
      </div>

      <div v-else-if="error" class="text-center py-20 text-(--color-accent)">
        <h2 class="text-2xl font-bold">😢Error Loading Movies. Please check your internet and try again</h2>
        <p class="text-gray-400">{{ error }}</p>
      </div>

      <div v-else-if="trendingFullList.length > 0" class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        
        <router-link
          v-for="movie in trendingFullList"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/20 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 block"
        >
          <div class="relative aspect-2/3 overflow-hidden">
            <img
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
              :alt="movie.title"
            />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <span class="px-2 py-1 bg-red-600 text-white rounded-full font-bold transform scale-90 group-hover:scale-100 transition">
                View Details
              </span>
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
        </router-link>
      </div>
      
      <div v-if="!loading && trendingFullList.length > 0" class="flex justify-center items-center space-x-4 mt-12">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-4 py-2 bg-gray-700 rounded-lg text-white font-semibold hover:bg-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &larr; Previous
        </button>
        
        <span class="text-lg font-semibold text-gray-300">
          Page {{ currentPage }}
        </span>
        
        <button
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition"
          :disabled="currentPage >= maxPages"
        >
          Next &rarr;
        </button>
      </div>
      
      <div v-else-if="!loading" class="text-center py-20 text-gray-500">
        <p>No trending movies available right now.</p>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // <-- 1. IMPORT onMounted
import { useMovies } from "@/composables/movies.data";
import Footer from "@/components/navigation/Footer.vue";

// Composable
const { 
  trendingFullList, 
  popularTotalPages, // Reusing this ref from composable for max page estimation
  fetchTrendingMovies, 
  loading, 
  error 
} = useMovies();

// State
const currentPage = ref(1);

const maxPages = popularTotalPages; 


// Logic
const changePage = (newPage) => {
    if (newPage < 1) return;
    
    // Check against the maximum page count (if available)
    if (maxPages.value && newPage > maxPages.value) return; 

    // Update state and fetch
    currentPage.value = newPage;
    fetchTrendingMovies(newPage);

    // Scroll to the top of the content area for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

// 2. Initial Fetch inside onMounted
onMounted(() => {
    // Check if the trending list is empty before fetching page 1
    if (trendingFullList.value.length === 0) {
        changePage(currentPage.value); 
    }
});

</script>
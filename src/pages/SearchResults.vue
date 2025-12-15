<template>
  <div class="min-h-screen pt-16 pb-10 bg-gray-900 text-gray-100">
    <div class="container mx-auto px-4 md:px-8">
      
      <h1 class="text-4xl md:text-5xl font-extrabold mb-8 border-l-4 border-red-600 pl-4">
        Search Results
      </h1>
      
      <p v-if="currentQuery" class="text-xl text-gray-400 mb-8">
        Showing results for: <span class="text-red-500 font-semibold italic">"{{ currentQuery }}"</span>
      </p>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-400 text-lg">Searching the database...</p>
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-500">
        <h2 class="text-2xl font-bold">Search Error</h2>
        <p class="text-gray-400">{{ error }}</p>
      </div>

      <div v-else-if="results.length === 0" class="text-center py-20">
        <p class="text-3xl text-gray-500 font-semibold mb-4">No movies found.</p>
        <p class="text-gray-400">Try a different search term or check your spelling.</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        <router-link
          v-for="movie in results"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="group bg-gray-800 rounded-xl overflow-hidden shadow-lg transition duration-300 transform hover:-translate-y-1 block"
        >
          <div class="relative aspect-[2/3] overflow-hidden">
            <img
              :src="getPosterUrl(movie.poster_path)"
              class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
              :alt="movie.title"
            />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <span class="px-5 py-2 bg-red-600 text-white rounded-full font-bold transform scale-90 group-hover:scale-100 transition">
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
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMovies } from '@/composables/movies.data';

const route = useRoute();
const { 
    trendingFullList, // This is the state where your search results are stored
    searchMovies, 
    loading, 
    error 
} = useMovies();

// --- COMPUTED PROPERTIES ---

// Map the search results array to a more readable name
const results = computed(() => trendingFullList.value);

// Get the search query from the URL (q parameter)
const currentQuery = computed(() => route.query.q || '');

// Helper to construct the full image URL
const getPosterUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder-poster.jpg';
}

// --- INITIAL FETCH AND REACTIVITY ---

// Function to handle fetching when the page loads or the query changes
const fetchIfRequired = () => {
    const query = currentQuery.value;
    
    if (query) {
        // If there's a query but no results, re-run the search (e.g., page refresh or direct link)
        if (results.value.length === 0) {
            searchMovies(query);
        }
        // If results exist and match the query, do nothing (data is fresh from SearchBar)
    } else {
        // If the query is cleared from the URL, clear the results.
        trendingFullList.value = [];
    }
};

onMounted(() => {
    fetchIfRequired();
});

// Watch the query parameter in the URL. If the user performs a new search 
// from the search bar while already on the /search page, the route changes.
watch(() => route.query.q, () => {
    // Only fetch if the query is actually present
    if (route.query.q) {
        searchMovies(route.query.q);
    }
});
</script>
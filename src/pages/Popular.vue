<template>
  <div class="min-h-screen pt-16 pb-10">
    <div class="container mx-auto px-4 md:px-8">
      
      <h1 class="text-3xl md:text-4xl font-semibold mb-8 border-l-4 border-red-600 pl-4">
        Popular Movies
      </h1>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-400 text-lg">Fetching current popular titles...</p>
      </div>

      <div v-else-if="error || popularMovies.length === 0" class="text-center py-20 ">
        <h2 class="text-2xl font-bold text-(--color-accent)">😢Error Loading Movies. Please check your internet and try again</h2>
        <p class="text-gray-400">{{ error}}</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        <MovieCard 
          v-for="movie in popularMovies" 
          :key="movie.id"
          :movie="movie"
        />
      </div>

      <div v-if="popularTotalPages > 1" class="flex justify-center items-center space-x-4 mt-12">
        <button
          @click="changePage(popularPage - 1)"
          :disabled="popularPage === 1 || loading"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
        >
          &larr; Previous
        </button>
        
        <span class="text-lg font-semibold text-gray-300">
          Page {{ popularPage }} of {{ popularTotalPages }}
        </span>

        <button
          @click="changePage(popularPage + 1)"
          :disabled="popularPage === popularTotalPages || loading"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
        >
          Next &rarr;
        </button>
      </div>
      <div v-else-if="!loading" class="text-center py-20 text-gray-500">
        <p>No popular movies available right now.</p>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMovies } from '@/composables/movies.data';
import MovieCard from '@/components/ui/MovieCard.vue';
import Footer from '@/components/navigation/Footer.vue';

const { 
  popularMovies, 
  popularPage, 
  popularTotalPages, 
  loading,
  error,
  fetchPopularMovies 
} = useMovies();

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= popularTotalPages.value && !loading.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPopularMovies(newPage);
  }
};

onMounted(() => {
  // Check if data needs to be fetched or if the current page is not page 1
  if (popularMovies.value.length === 0 || popularPage.value !== 1) {
     fetchPopularMovies(1);
  }
});
</script>
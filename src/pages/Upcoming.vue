<template>
  <div class="min-h-screen pt-16 pb-10">
    <div class="container mx-auto px-4 md:px-8">
      
      <h1 class="text-3xl md:text-4xl font-semibold mb-8 border-l-4 border-red-600 pl-4">
        Upcoming Releases
      </h1>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p class="text-gray-400 text-lg">Preparing future blockbusters...</p>
      </div>

      <div v-else-if="error || upcomingMovies.length === 0" class="text-center py-20 ">
        <h2 class="text-2xl font-bold text-(--color-accent)">😢Error Loading Movies. Please check your internet and try again</h2>
        <p class="text-gray-400">{{ error}}</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        <MovieCard 
          v-for="movie in upcomingMovies" 
          :key="movie.id"
          :movie="movie"
        />
      </div>

      <div v-if="upcomingTotalPages > 1" class="flex justify-center items-center space-x-4 mt-12">
        <button
          @click="changePage(upcomingPage - 1)"
          :disabled="upcomingPage === 1 || loading"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
        >
          &larr; Previous
        </button>
        
        <span class="text-lg font-semibold text-gray-300">
          Page {{ upcomingPage }} of {{ upcomingTotalPages }}
        </span>

        <button
          @click="changePage(upcomingPage + 1)"
          :disabled="upcomingPage === upcomingTotalPages || loading"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
        >
          Next &rarr;
        </button>
      </div>
      <div v-else-if="!loading" class="text-center py-20 text-gray-500">
        <p>No Upcoming movies available right now.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMovies } from '@/composables/movies.data';
import MovieCard from '@/components/ui/MovieCard.vue';
import Footer from '@/components/navigation/Footer.vue';

const { 
  upcomingMovies, 
  upcomingPage, 
  upcomingTotalPages, 
  loading, 
  error,
  fetchUpcomingMovies 
} = useMovies();

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= upcomingTotalPages.value && !loading.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchUpcomingMovies(newPage);
  }
};

onMounted(() => {
  if (upcomingMovies.value.length === 0 || upcomingPage.value !== 1) {
     fetchUpcomingMovies(1);
  }
});
</script>
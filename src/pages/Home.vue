<template>
  <div class="min-h-screen text-gray-100 pb-10">
    <div>
      
      <div
        v-if="featuredMovie"
        class="relative w-full h-[550px] md:h-[700px] mb-12 rounded-2xl"
      >
        <div class="absolute inset-0">
          <img
            :src="`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`"
            class="w-full h-full object-cover brightness-80"
            alt="Featured Movie"
            loading="eager"
          />
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

          <p 
            class="md:block text-lg text-gray-300 mb-4 max-w-2xl transition-all duration-300"
            :class="{ 'line-clamp-3': !isOverviewExpanded }"
          >
            {{ featuredMovie.overview }}
          </p>
          <div>

            <button 
              v-if="featuredMovie.overview && featuredMovie.overview.length > 200"
              @click="toggleOverview" 
              class=" text-white hover:text-red-500 font-semibold mb-8 transition text-base"
            >
              {{ isOverviewExpanded ? 'See Less' : 'Read More' }} <i class="fa fa-arrow-right"></i>
            </button>
          </div>
          
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
      
      <div class="container mx-auto px-4 md:px-8 space-y-12">
        
        <div v-if="loading" class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p class="text-gray-400 text-lg">Loading movie categories...</p>
        </div>

        <template v-else>
          
          <div class="pt-8">
            <div class="flex justify-between items-end mb-4">
               <h2 class="text-2xl text-(--color-text) md:text-3xl font-bold border-l-4 border-red-600 pl-3">
                  Trending Now
               </h2>
                <router-link to="/trending" class="text-(--color-text) hover:text-red-400 text-sm font-semibold">View All &rarr;</router-link>
            </div>
            
            <Slider :items="trendingMovies">
                 <template v-slot="{ item }">
                    <router-link :to="`/movie/${item.id}`" class="relative w-full h-full group">
                       <img
                          :src="`https://image.tmdb.org/t/p/original${item.poster_path}`"
                          alt="Poster"
                          class="w-full h-full object-cover object-center rounded-xl"
                        />
                        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6 rounded-xl">
                            <h3 class="text-xl font-bold text-(--color-text) line-clamp-2 mb-1">{{ item.title }}</h3>
                            <div class="flex justify-between items-center text-sm text-gray-300">
                                <span>{{ item.release_date?.split('-')[0] }}</span>
                                <span class="text-yellow-400 flex items-center gap-1">★ {{ item.vote_average.toFixed(1) }}</span>
                            </div>
                        </div>
                    </router-link>
                </template>
            </Slider>
          </div>
          
          <MovieCarousel 
            title="Top Rated" 
            :movies="topRatedMoviesHome" 
            to="/top-rated" 
            border-color="yellow" 
          />
          
          <MovieCarousel 
            title="Action Hits" 
            :movies="actionMovies" 
            to="/action" 
            border-color="blue" 
          />
          
          <MovieCarousel 
            title="Comedy Specials" 
            :movies="comedyMovies" 
            to="/comedy" 
            border-color="green" 
          />
        </template>
        
      </div>
      
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useMovies } from "@/composables/movies.data";
import Footer from "@/components/navigation/Footer.vue";
import MovieCarousel from "@/components/ui/MoveCarousal.vue";
import Slider from "@/components/ui/Slider.vue";
import SearchBar from "@/components/ui/SearchBar.vue";

const { 
  trendingMovies,
  topRatedMoviesHome,
  actionMovies,
  comedyMovies,
  fetchAllHomeCarousels,
  loading
} = useMovies();

const isOverviewExpanded = ref(false); 

const toggleOverview = () => {
    isOverviewExpanded.value = !isOverviewExpanded.value;
};
onMounted(() => {
  fetchAllHomeCarousels();
});

const featuredMovie = computed(() => trendingMovies.value && trendingMovies.value.length > 0 ? trendingMovies.value[0] : null);
</script>
<style scoped>
.bg-linear-to-t {
    background-image: linear-gradient(to top, var(--tw-gradient-stops));
}
.bg-linear-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
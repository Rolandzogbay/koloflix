<template>
  <div class="hidden md:flex flex-1 mx-6 relative">
    
    <input
      type="text"
      placeholder="Search for your favourite movies..."
      v-model="query"
      @focus="openDropdown"
      @input="handleInput"
      @keydown.enter="executeSearch"
      class="w-full px-4 py-2 pr-12 rounded-lg z-30
            bg-gray-800
            text-white
            focus:outline-none focus:ring-1 focus:ring-red-600"
      ref="searchBarRef" />

    <button
      @click="executeSearch"
      class="absolute right-6 top-1/2 -translate-y-1/2 z-30
            text-gray-400
            hover:text-red-600 cursor-pointer transition"
    >
      <i class="fa-solid fa-magnifying-glass text-xl"></i>
    </button>

    <div
      v-if="showDropdown"
      class="absolute top-full left-0 w-full mt-2 bg-gray-800 rounded-lg shadow-2xl z-40 max-h-96 overflow-y-auto border border-gray-700"
      ref="dropdownRef" >
      <div class="p-4 space-y-3">

        <div v-if="query.length > 2">
          <h4 class="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">Suggestions</h4>
          <ul v-if="suggestions.length > 0">
            <li v-for="movie in suggestions" :key="movie.id" class="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer transition" @click="selectSuggestion(movie.title)">
                <img :src="getPosterUrl(movie.poster_path)" class="w-8 h-12 object-cover rounded" :alt="movie.title"/>
                <span class="text-white text-sm truncate">{{ movie.title }}</span>
                <span class="ml-auto text-xs text-yellow-500">★ {{ movie.vote_average.toFixed(1) }}</span>
            </li>
          </ul>
          <p v-else-if="searchLoading" class="text-center py-2 text-gray-500">Searching...</p>
          <p v-else class="text-center py-2 text-gray-500 text-sm">No results found.</p>
        </div>

        <div v-if="history.length > 0 && query.length === 0">
          <h4 class="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1 flex justify-between items-center">
            Recent Searches
            <button @click.stop="clearHistory" class="text-red-500 hover:text-red-400 text-xs font-normal">Clear</button>
          </h4>
          <ul>
            <li v-for="(item, index) in history" :key="index" class="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer transition" @click="selectSuggestion(item)">
              <i class="fa-solid fa-clock-rotate-left w-4 text-gray-500 mr-3"></i>
              <span class="text-white text-sm truncate">{{ item }}</span>
            </li>
          </ul>
        </div>
        
        <div v-if="query.length === 0 && popularForDropdown.length > 0">
          <h4 class="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">Popular Right Now</h4>
          <ul>
             <li v-for="movie in popularForDropdown" :key="movie.id" class="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer transition" @click="selectSuggestion(movie.title)">
                <span class="text-red-500 font-bold w-4 text-center">{{ popularForDropdown.indexOf(movie) + 1 }}</span>
                <span class="text-white text-sm truncate">{{ movie.title }}</span>
                <span class="ml-auto text-xs text-yellow-500">★ {{ movie.vote_average.toFixed(1) }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovies } from '@/composables/movies.data';

// --- TEMPLATE REFS ---
const searchBarRef = ref(null);
const dropdownRef = ref(null);

// --- STATE AND SETUP ---

const query = ref('');
const showDropdown = ref(false);
const history = ref([]);

const router = useRouter();
const { 
    searchMovies, 
    fetchSearchSuggestions, 
    loading: searchLoading, 
    trendingMovies, 
    trendingFullList // MUST pull this state
} = useMovies();

// Correctly map suggestions from the composable state
const suggestions = computed(() => trendingFullList.value.slice(0, 5)); 

// Use the limited trending list from the home page for "Popular Right Now"
const popularForDropdown = computed(() => trendingMovies.value.slice(0, 5)); 

// --- CLICK OUTSIDE HANDLER (FIXED IMPLEMENTATION) ---

const handleClickOutside = (event) => {
    // Check if the click is outside both the search input and the dropdown panel
    const isOutsideInput = searchBarRef.value && !searchBarRef.value.contains(event.target);
    const isOutsideDropdown = dropdownRef.value && !dropdownRef.value.contains(event.target);

    // Only close the dropdown if the click is outside the entire component area
    if (showDropdown.value && isOutsideInput && isOutsideDropdown) {
        showDropdown.value = false;
    }
};

onMounted(() => {
    loadHistory();
    // Add event listener when component mounts
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    // Remove event listener when component unmounts
    document.removeEventListener('click', handleClickOutside);
});

// --- DROPDOWN & INPUT HANDLERS ---

const openDropdown = () => {
    loadHistory(); 
    showDropdown.value = true;
};

// Removed the old closeDropdown function as handleClickOutside handles it
// const closeDropdown = () => { showDropdown.value = false; }; 

const selectSuggestion = (term) => {
    query.value = term;
    executeSearch(); 
    showDropdown.value = false; // Ensure it closes after selecting
};

// --- SEARCH HISTORY MANAGEMENT (Unchanged) ---

const loadHistory = () => {
    const savedHistory = localStorage.getItem('searchHistory');
    history.value = savedHistory ? JSON.parse(savedHistory).slice(0, 5) : [];
};

const saveHistory = (term) => {
    let updatedHistory = history.value.filter(h => h.toLowerCase() !== term.toLowerCase());
    updatedHistory.unshift(term);
    history.value = updatedHistory.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history.value));
};

const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    history.value = [];
};

// --- SEARCH EXECUTION (Unchanged) ---

const executeSearch = async () => {
    const trimmedQuery = query.value.trim();

    if (!trimmedQuery) return;

    saveHistory(trimmedQuery);
    await searchMovies(trimmedQuery);

    router.push({ 
      path: '/search', 
      query: { q: trimmedQuery } 
    });

    query.value = '';
    showDropdown.value = false;
};


// --- DEBOUNCING AND API CALLS (Unchanged) ---

let searchTimeout = null;
const DEBOUNCE_DELAY = 300; 

const handleInput = () => {
    clearTimeout(searchTimeout);
    
    if (query.value.length > 2) {
        searchTimeout = setTimeout(() => {
            fetchSearchSuggestions(query.value); // Uses the debounced function from composable
        }, DEBOUNCE_DELAY);
    } else {
        suggestions.value = [];
    }
};

// --- HELPER ---
const getPosterUrl = (path) => {
    // Note: Using w92 for small dropdown images is better performance than w500
    return path ? `https://image.tmdb.org/t/p/w92${path}` : '/placeholder-poster.jpg';
}
</script>
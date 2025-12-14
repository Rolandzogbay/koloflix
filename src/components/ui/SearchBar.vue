<template>
  <div class="hidden md:flex flex-1 mx-6 relative" v-click-outside="closeDropdown">
    
    <input
      type="text"
      placeholder="Search for your favourite movies..."
      v-model="query"
      @focus="openDropdown"
      @input="handleInput"
      @keydown.enter="executeSearch"
      class="w-full px-4 py-2 pr-12 rounded-lg z-30
            bg-(--color-search-bg)
            text-(--color-text)
            focus:outline-none focus:ring-1 focus:ring-red-600"
    />

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
    >
      <div class="p-4 space-y-3">

        <div v-if="query.length > 2">
          <h4 class="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">Suggestions</h4>
          <ul v-if="suggestions.length > 0">
            <li v-for="movie in suggestions" :key="movie.id" class="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer transition" @click="selectSuggestion(movie.title)">
                <img :src="getPosterUrl(movie.poster_path)" class="w-8 h-12 object-cover rounded" alt="Poster"/>
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
        
        <div v-if="query.length === 0">
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
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovies } from '@/composables/movies.data';

// --- DIRECTIVE FOR CLICK OUTSIDE ---
// Vue 3 way to handle click-outside. You may need to register this globally.
const vClickOutside = {
    mounted(el, binding) {
        el.__ClickOutsideHandler__ = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('click', el.__ClickOutsideHandler__);
    },
    unmounted(el) {
        document.body.removeEventListener('click', el.__ClickOutsideHandler__);
    },
};

// --- STATE AND SETUP ---

const query = ref('');
const showDropdown = ref(false);
const suggestions = ref([]);
const history = ref([]);

const router = useRouter();
const { searchMovies, fetchSearchSuggestions, loading: searchLoading, trendingMovies } = useMovies();

// Use the limited trending list from the home page for "Popular Right Now"
const popularForDropdown = trendingMovies.value.slice(0, 5); 

// --- SEARCH HISTORY MANAGEMENT ---

const loadHistory = () => {
    const savedHistory = localStorage.getItem('searchHistory');
    history.value = savedHistory ? JSON.parse(savedHistory).slice(0, 5) : []; // Limit to 5
};

const saveHistory = (term) => {
    // 1. Remove old entry if it exists
    let updatedHistory = history.value.filter(h => h.toLowerCase() !== term.toLowerCase());
    // 2. Add new entry to the start
    updatedHistory.unshift(term);
    // 3. Keep only the last 5
    history.value = updatedHistory.slice(0, 5);
    // 4. Save to storage
    localStorage.setItem('searchHistory', JSON.stringify(history.value));
};

const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    history.value = [];
};

// --- DROPDOWN & INPUT HANDLERS ---

const openDropdown = () => {
    loadHistory(); // Reload history every time the dropdown opens
    showDropdown.value = true;
};

const closeDropdown = () => {
    // We only close if the mouse is not on the search bar or dropdown.
    if (!searchLoading.value) {
        showDropdown.value = false;
    }
};

const selectSuggestion = (term) => {
    query.value = term;
    executeSearch(); // Execute the full search immediately
};

// --- SEARCH EXECUTION ---

const executeSearch = async () => {
    const trimmedQuery = query.value.trim();

    if (!trimmedQuery) return;

    // 1. Save to history before search
    saveHistory(trimmedQuery);

    // 2. Call the global search function (which updates the `trendingFullList` in movies.data.js)
    await searchMovies(trimmedQuery);

    // 3. Redirect the user to the search results page
    router.push({ 
      path: '/search', 
      query: { q: trimmedQuery } 
    });

    // 4. Close and clear state
    suggestions.value = [];
    showDropdown.value = false;
};


// --- DEBOUNCING AND API CALLS ---

let searchTimeout = null;
const DEBOUNCE_DELAY = 300; // 300ms delay

const handleInput = () => {
    clearTimeout(searchTimeout);
    
    if (query.value.length > 2) {
        searchTimeout = setTimeout(() => {
            fetchLiveSuggestions(query.value);
        }, DEBOUNCE_DELAY);
    } else {
        // Clear suggestions if query is too short
        suggestions.value = [];
    }
};

const fetchLiveSuggestions = async (term) => {
    // This calls the new function in movies.data.js
    await fetchSearchSuggestions(term); 
    suggestions.value = trendingFullList.value.slice(0, 5); // Limit suggestions to 5
};

// --- HELPER ---
const getPosterUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w92${path}` : '/placeholder-poster.jpg';
}

onMounted(() => {
    loadHistory();
});
</script>
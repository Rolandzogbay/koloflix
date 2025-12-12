<template>
  <div class="min-h-screen text-gray-100 pb-10">

    <div v-if="loading" class="flex justify-center items-center h-96">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mb-4"></div>
      <p class="ml-4 text-gray-400">Loading movie details...</p>
    </div>

    <div v-else-if="!movieDetails" class="text-center py-45 text-red-500">
      <h2 class="text-4xl font-bold">Movie Not Found or API Error.</h2>
      <p class="text-gray-400">Please check the movie ID and your network connection.</p>
    </div>

    <div v-else class="container mx-auto px-4 md:px-8 space-y-10">

      <div v-if="movieDetails.backdrop_path" class="relative h-[400px] md:h-[550px] rounded-xl overflow-hidden shadow-2xl">
        <img
          :src="`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`"
          alt="Backdrop"
          class="w-full h-full object-cover brightness-50"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 p-6 md:p-10 w-full lg:w-3/4">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-3 leading-tight">{{ movieDetails.title }}</h1>
          
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300 mb-4">
            <span class="text-yellow-400 font-semibold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.62-.921 1.902 0l1.077 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.077 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.077-3.292a1 1 0 00-.364-1.118L2.01 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.077-3.292z" /></svg>
              {{ movieDetails.vote_average?.toFixed(1) }}
            </span>
            <span>{{ movieDetails.release_date?.split('-')[0] }}</span>
            <span>{{ movieDetails.runtime }} min</span>
            <span v-for="genre in movieDetails.genres" :key="genre.id" class="px-2 py-0.5 border border-gray-500 rounded-full text-xs">{{ genre.name }}</span>
          </div>

          <div class="flex gap-4 items-center mt-6">
            <button
              @click="showTrailer = true"
              class="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
              Watch Trailer
            </button>
            <button
              @click="toggleFavorite(movieDetails.id)"
              :class="[isFavorite(movieDetails.id) ? 'bg-white text-gray-900' : 'border border-gray-400 hover:border-white hover:text-white']"
              class="px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <svg v-if="isFavorite(movieDetails.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.62-.921 1.902 0l1.077 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.077 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.077-3.292a1 1 0 00-.364-1.118L2.01 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.077-3.292z" /></svg>
              {{ isFavorite(movieDetails.id) ? 'Added to Watchlist' : 'Add to Watchlist' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 class="text-3xl font-bold mb-4 border-l-4 border-red-600 pl-3">Overview</h2>
        <p class="text-gray-300 leading-relaxed mb-4">
          {{ movieDetails.overview }}
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-gray-400">
          <p><strong>Original Language:</strong> <span class="text-white">{{ movieDetails.original_language?.toUpperCase() }}</span></p>
          <p><strong>Status:</strong> <span class="text-white">{{ movieDetails.status }}</span></p>
          <p><strong>Budget:</strong> <span class="text-white">${{ movieDetails.budget?.toLocaleString() }}</span></p>
          <p><strong>Revenue:</strong> <span class="text-white">${{ movieDetails.revenue?.toLocaleString() }}</span></p>
        </div>
      </div>

      <div v-if="cast.length" class="p-6 rounded-xl bg-gray-800 shadow-lg relative scroll-hint-overlay">
        <h2 class="text-3xl font-bold mb-4 border-l-4 border-red-600 pl-3">Top Cast</h2>
        <div class="flex overflow-x-scroll space-x-4 scrollbar-hide scroll-snap-x cursor-grab active:cursor-grabbing py-2">
          <div 
            v-for="actor in cast" 
            :key="actor.id" 
            class="shrink-0 w-32 text-center group cursor-pointer hover:scale-105 transition duration-300 scroll-snap-start"
          >
            <img
              v-if="actor.profile_path"
              :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
              alt="Actor"
              class="rounded-full h-32 w-32 object-cover border-4 border-transparent group-hover:border-red-600 transition"
            />
            <p class="font-semibold mt-2 line-clamp-1 text-white">{{ actor.name }}</p>
            <p class="text-xs opacity-70 text-gray-400 line-clamp-1">{{ actor.character }}</p>
          </div>
        </div>
      </div>

      <div v-if="similar.length || recommended.length" class="p-6 rounded-xl bg-gray-800 shadow-lg relative scroll-hint-overlay">
        <h2 class="text-3xl font-bold mb-4 border-l-4 border-red-600 pl-3">You Might Also Like</h2>
        
        <div class="flex overflow-x-scroll space-x-4 scrollbar-hide scroll-snap-x cursor-grab active:cursor-grabbing">
          <div
            v-for="movie in similar"
            :key="movie.id"
            class="shrink-0 w-36 md:w-48 cursor-pointer hover:scale-[1.02] transition duration-300 scroll-snap-start"
            @click="goToMovie(movie.id)"
          >
            <img
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              alt="Similar"
              class="rounded-xl aspect-[2/3] object-cover shadow-lg"
            />
            <p class="text-sm font-semibold mt-2 line-clamp-2 text-white">{{ movie.title }}</p>
          </div>
          
          <div
            v-for="movie in recommended"
            :key="movie.id"
            class="shrink-0 w-36 md:w-48 cursor-pointer hover:scale-[1.02] transition duration-300 scroll-snap-start"
            @click="goToMovie(movie.id)"
          >
            <img
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              alt="Recommended"
              class="rounded-xl aspect-[2/3] object-cover shadow-lg"
            />
            <p class="text-sm font-semibold mt-2 line-clamp-2 text-white">{{ movie.title }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl bg-gray-800 shadow-lg">
        <h2 class="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-3">User Comments ({{ comments.length }})</h2>
        
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-2">Write your comment</h3>
          <textarea
            v-model="newComment"
            placeholder="Share your thoughts..."
            class="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-red-600 focus:outline-none transition"
            rows="3"
          ></textarea>
          <button
            @click="addComment"
            :disabled="!newComment.trim()"
            class="mt-3 px-6 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition disabled:bg-red-900 disabled:opacity-50"
          >
            Submit Comment
          </button>
        </div>
        
        <div class="space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
          <p v-if="comments.length === 0" class="text-gray-400 italic py-4 text-center">Be the first to leave a comment!</p>

          <div v-for="c in comments" :key="c.id" class="bg-gray-700 p-4 rounded-xl shadow-md border-t border-red-500/50 hover:bg-gray-700/80 transition">
            
            <div v-if="!c.editing">
              <p class="text-base text-gray-200 mb-2 whitespace-pre-wrap">{{ c.text }}</p>
              <span class="text-xs text-red-400 font-semibold block">- Anonymous User</span>
              <span class="text-xs text-gray-400 block mt-1">Commented on: {{ c.timestamp }}</span>
              
              <div class="flex gap-3 mt-3 text-sm">
                <button 
                  @click="startEdit(c)"
                  class="text-blue-400 hover:text-blue-300 font-medium transition"
                >
                  Edit
                </button>
                <button 
                  @click="deleteComment(c.id)"
                  class="text-red-400 hover:text-red-300 font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div v-else>
              <textarea
                v-model="c.text"
                class="w-full p-2 mb-3 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                rows="3"
              ></textarea>
              <div class="flex gap-3 text-sm">
                <button 
                  @click="saveEdit(c)"
                  class="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 transition disabled:opacity-50"
                  :disabled="!c.text.trim()"
                >
                  Save
                </button>
                <button 
                  @click="cancelEdit(c)"
                  class="px-3 py-1 border border-gray-500 rounded text-gray-300 hover:border-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div
      v-if="showTrailer && trailerKey"
      class="fixed inset-0 bg-black/90 z-50 flex justify-center items-center p-4"
      @click.self="showTrailer = false"
    >
      <div class="relative w-full max-w-4xl aspect-video">
        <button
          @click="showTrailer = false"
          class="absolute -top-10 right-0 text-white text-3xl font-bold p-2 z-10 hover:text-red-500 transition"
        >
          &times;
        </button>
        <iframe
          width="100%"
          height="100%"
          :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
          title="Movie Trailer"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="rounded-xl shadow-2xl"
        ></iframe>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovies } from "@/composables/movies.data" 
import Footer from "@/components/navigation/Footer.vue"

const route = useRoute()
const router = useRouter()

const { movieDetails, loading, fetchMoviesDetails } = useMovies()

// State
const cast = ref([])
const similar = ref([])
const recommended = ref([])
const trailerKey = ref(null)
const showTrailer = ref(false)
const comments = ref([])
const newComment = ref("");
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"))

const currentMovieId = () => route.params.id;
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);


// --- LOCAL STORAGE & COMMENT ACTIONS ---
const STORAGE_KEY = (id) => `movie_comments_${id}`;

const loadComments = (movieId) => {
  const stored = localStorage.getItem(STORAGE_KEY(movieId))
  try {
      // Ensure the loaded objects have the 'editing' state set to false
      const loadedComments = stored ? JSON.parse(stored) : [];
      comments.value = loadedComments.map(c => ({
          ...c,
          editing: false,
          originalText: c.text, // Store for initial state/cancel
      }));
  } catch (e) {
      console.error("Failed to parse comments for movie ID:", movieId, e);
      comments.value = [];
  }
}

const saveComments = (movieId) => {
  // Only save persistent data (id, text, timestamp)
  const commentsToSave = comments.value.map(c => ({
      id: c.id,
      text: c.text,
      timestamp: c.timestamp,
  }));
  localStorage.setItem(STORAGE_KEY(movieId), JSON.stringify(commentsToSave))
}

const addComment = () => {
  const commentText = newComment.value.trim();
  if (!commentText) return;
  
  const newCommentObject = {
    id: generateUniqueId(),
    text: commentText,
    timestamp: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    }),
    editing: false, 
    originalText: commentText,
  }

  comments.value.unshift(newCommentObject);
  newComment.value = "";
  saveComments(currentMovieId()); 
}

const deleteComment = (commentId) => {
  if (confirm("Are you sure you want to permanently delete this comment?")) {
    comments.value = comments.value.filter(c => c.id !== commentId);
    saveComments(currentMovieId());
  }
}

// Edit actions
const startEdit = (comment) => {
    // Reset editing state for all other comments
    comments.value.forEach(c => {
        if (c.id !== comment.id) {
            c.editing = false;
        }
    });
    comment.editing = true;
    // Store current text in originalText in case user cancels
    comment.originalText = comment.text; 
}

const saveEdit = (comment) => {
    if (comment.text.trim()) {
        comment.editing = false;
        comment.text = comment.text.trim();
        saveComments(currentMovieId());
    }
}

const cancelEdit = (comment) => {
    comment.text = comment.originalText; // Revert to stored text
    comment.editing = false;
}

// Watchlist functions (unchanged)
const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((f) => f !== id)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value))
}

const isFavorite = (id) => favorites.value.includes(id)

// Data Fetching
const fetchAllDetails = async (movieId) => {
  if (!movieId) return;
  
  // CRITICAL: Load comments for this specific movie ID
  loadComments(movieId); 
  
  await fetchMoviesDetails(movieId); 

  cast.value = [];
  similar.value = [];
  recommended.value = [];
  trailerKey.value = null;

  const API_KEY = import.meta.env.VITE_APP_API_KEY;

  try {
      const [resCredits, resSimilar, resRec, resVideos] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`),
      ]);

      const [dataCredits, dataSimilar, dataRec, dataVideos] = await Promise.all([
          resCredits.json(),
          resSimilar.json(),
          resRec.json(),
          resVideos.json(),
      ]);

      cast.value = dataCredits.cast.slice(0, 12);
      similar.value = dataSimilar.results.slice(0, 8);
      recommended.value = dataRec.results.slice(0, 8);
      
      const trailer = dataVideos.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      trailerKey.value = trailer ? trailer.key : "";
      
  } catch (error) {
      console.error("Failed to fetch secondary movie details:", error);
  }
}

const goToMovie = (id) => {
  router.push(`/movie/${id}`)
}

// Watch route changes to load new movie and new comments
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchAllDetails(newId);
    }
  },
  { immediate: true }
);
</script>

<style>
/* -----------------------------------------------------------
   ### SCROLLBAR HIDING (Desktop/Mobile) ###
*/
.scrollbar-hide::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
}

.scrollbar-hide {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;  
}

/* -----------------------------------------------------------
   ### UX Enhancement: Scroll Snapping and Hinting ###
*/

/* 1. Scroll Snapping (Carousel Feel) */
.scroll-snap-x {
    scroll-snap-type: x mandatory;
    scroll-padding-left: 1rem; 
}

.scroll-snap-start {
    scroll-snap-align: start;
}

/* 2. Scroll Hint Overlay (Fade effect to indicate horizontal scroll) */
.scroll-hint-overlay {
    position: relative;
    z-index: 10;
}

.scroll-hint-overlay::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50px; 
    height: 100%;
    /* Gradient from parent background to transparent */
    background: linear-gradient(to left, #1f2937 50%, rgba(31, 41, 55, 0));
    pointer-events: none;
    z-index: 20;
}

/* 3. Cursor Hint */
.cursor-grab {
    cursor: grab;
}

.active:cursor-grabbing {
    cursor: grabbing;
}
</style>
<template>
  <div class="p-4 space-y-8">

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-lg py-20">
      Loading movie details...
    </div>

    <!-- Movie Content -->
    <div v-else-if="movieDetails">

      <!-- Hero Section -->
      <div v-if="movieDetails.backdrop_path" class="relative bg-(--color-sidebar) rounded-xl shadow-2xl overflow-hidden">
        <img
          :src="`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`"
          alt="Backdrop"
          class="w-full h-64 md:h-96 object-cover brightness-75"
        />
        <div class="absolute top-0 left-0 right-0 bottom-0 p-6 flex flex-col justify-end text-white">
          <h1 class="text-4xl font-bold">{{ movieDetails.title }}</h1>
          <p class="opacity-80 my-2">{{ movieDetails.overview }}</p>
          <div class="flex gap-4 items-center mt-4">
            <button
              @click="showTrailer = true"
              class="px-4 py-2 bg-(--color-accent) rounded-lg font-semibold hover:opacity-90"
            >
              Watch Trailer
            </button>
            <button
              @click="toggleFavorite(movieDetails.id)"
              class="px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-(--color-accent)"
            >
              {{ isFavorite(movieDetails.id) ? 'Remove from Watchlist' : 'Add to Watchlist' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Movie Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 shadow-xl p-2 rounded-xl">
        <div>
          <img
            v-if="movieDetails.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`"
            alt="Poster"
            class="rounded-xl shadow-lg"
          />
        </div>
        <div class="space-y-3">
          <p><strong>Language:</strong> {{ movieDetails.original_language }}</p>
          <p><strong>Release Date:</strong> {{ movieDetails.release_date }}</p>
          <p><strong>Popularity:</strong> {{ movieDetails.popularity }}</p>
          <p><strong>Vote Average:</strong> {{ movieDetails.vote_average }}</p>
          <p><strong>Genres:</strong>
            <span v-for="genre in movieDetails.genres" :key="genre.id">{{ genre.name }} </span>
          </p>
          <p><strong>Description:</strong>
            {{ movieDetails.overview }}
          </p>
        </div>
      </div>

      <!-- Cast -->
      <div v-if="cast.length" class="shadow-xl p-2 mt-4 rounded-2xl">
        <h2 class="text-2xl font-bold mb-4 mt-8">Cast</h2>
        <div class="flex overflow-x-auto space-x-4">
          <div v-for="actor in cast" :key="actor.id" class="shrink-0 w-32 text-center">
            <img
              v-if="actor.profile_path"
              :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
              alt="Actor"
              class="rounded-xl h-40 w-full object-cover"
            />
            <p class="font-semibold mt-2">{{ actor.name }}</p>
            <p class="text-sm opacity-70">{{ actor.character }}</p>
          </div>
        </div>
      </div>

      <!-- Similar Movies -->
      <div v-if="similar.length" class="shadow-xl p-2 mt-4 rounded-2xl">
        <h2 class="text-2xl font-bold mb-4 mt-8">Similar Movies</h2>
        <div class="flex overflow-x-auto space-x-4">
          <div
            v-for="movie in similar"
            :key="movie.id"
            class="shrink-0 w-40 cursor-pointer"
            @click="goToMovie(movie.id)"
          >
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              alt="Similar"
              class="rounded-xl h-56 w-full object-cover"
            />
            <p class="text-sm font-semibold mt-1">{{ movie.title }}</p>
          </div>
        </div>
      </div>

      <!-- Recommended Movies -->
      <div v-if="recommended.length" class="shadow-xl p-2 mt-4 rounded-2xl">
        <h2 class="text-2xl font-bold mb-4 mt-8">Recommended Movies</h2>
        <div class="flex overflow-x-auto space-x-4">
          <div
            v-for="movie in recommended"
            :key="movie.id"
            class="shrink-0 w-40 cursor-pointer"
            @click="goToMovie(movie.id)"
          >
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              alt="Recommended"
              class="rounded-xl h-56 w-full object-cover"
            />
            <p class="text-sm font-semibold mt-1">{{ movie.title }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Comments Section -->
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Comments</h2>
      <ul class="space-y-2 mb-4">
        <li v-for="(c, i) in comments" :key="i" class="bg-gray-200 dark:bg-gray-800 p-3 rounded-xl">
          {{ c }}
        </li>
      </ul>
      <textarea
        v-model="newComment"
        placeholder="Write your comment..."
        class="w-full p-3 rounded-lg"
      ></textarea>
      <button
        @click="addComment"
        class="mt-2 px-4 py-2 bg-(--color-accent) rounded-lg text-white font-semibold hover:opacity-90"
      >
        Submit
      </button>
    </div>

    <!-- Trailer Modal -->
    <div
      v-if="showTrailer && trailerKey"
      class="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
    >
      <div class="relative w-full max-w-4xl">
        <button
          @click="showTrailer = false"
          class="absolute top-2 right-2 text-white text-2xl"
        >
          &times;
        </button>
        <iframe
          width="100%"
          height="500"
          :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
          title="Movie Trailer"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovies } from "@/composables/movies.data"

const route = useRoute()
const router = useRouter()
const movieId = route.params.id

// Movies composable
const { movie, fetchMoviesDetails, movieDetails, loading } = useMovies()
fetchMoviesDetails(movieId);
// State
const cast = ref([])
const similar = ref([])
const recommended = ref([])
const trailerKey = ref("")
const showTrailer = ref(false)

// Comments
const comments = ref([])
const newComment = ref("")

// Watchlist
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"))

// Methods
const addComment = () => {
  if (!newComment.value.trim()) return
  comments.value.push(newComment.value)
  newComment.value = ""
}

const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((f) => f !== id)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value))
}

const isFavorite = (id) => favorites.value.includes(id)

const fetchExtraDetails = async () => {
  await fetchMoviesDetails(movieId)

  // Fetch Cast
  const resCast = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${import.meta.env.VITE_APP_API_KEY}`
  )
  const dataCast = await resCast.json()
  cast.value = dataCast.cast.slice(0, 12)

  // Fetch Similar Movies
  const resSimilar = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${import.meta.env.VITE_APP_API_KEY}`
  )
  const dataSimilar = await resSimilar.json()
  similar.value = dataSimilar.results.slice(0, 10)

  // Fetch Recommended Movies
  const resRec = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${import.meta.env.VITE_APP_API_KEY}`
  )
  const dataRec = await resRec.json()
  recommended.value = dataRec.results.slice(0, 10)

  // Fetch Trailer
  const resVideos = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_APP_API_KEY}`
  )
  const dataVideos = await resVideos.json()
  const trailer = dataVideos.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  )
  trailerKey.value = trailer ? trailer.key : ""
}

const goToMovie = (id) => router.push(`/movie/${movie.id}`)

// Fetch data on mount
onMounted(fetchExtraDetails)
</script>

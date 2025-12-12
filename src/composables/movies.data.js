import { ref } from 'vue'

export function useMovies() {
  const movies = ref([])
  const movieDetails = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const topRatedMovies = ref([])

  const apikey = import.meta.env.VITE_APP_API_KEY
  const baseUrl = 'https://api.themoviedb.org/3'

  // --- EXISTING FUNCTIONS (Unchanged) ---
  const searchMovies = async (query) => {
    if (!query) return
    loading.value = true
    error.value = null

    try {
      const res = await fetch(
        `${baseUrl}/search/movie?api_key=${apikey}&query=${encodeURIComponent(query)}`,
      )

      const data = await res.json()
      movies.value = data.results
    } catch (err) {
      error.value = 'Failed to fetch movies'
    } finally {
      loading.value = false
    }
  }

  const fetchMoviesDetails = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${baseUrl}/movie/${id}?api_key=${apikey}`)
      movieDetails.value = await res.json()
    } catch (err) {
      error.value = 'Failed to fetch movie details'
    } finally {
      loading.value = false
    }
  }

  const fetchMovieVideos = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/movie/${id}/videos?api_key=${apikey}`)
      const data = await res.json()

      const trailer = data.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube')

      return trailer ? trailer.key : null
    } catch (err) {
      console.log('Error loading trailer')
      return null
    }
  };
  const fetchTopRatedMovies = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${apikey}&page=${page}`)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const movieData = await response.json()
      // Use the dedicated state for Top Rated movies
      topRatedMovies.value = movieData.results
    } catch (err) {
      error.value = err.message
      topRatedMovies.value = [] // Clear state on error
      console.log('Failed to fetch top rated data.', err)
    } finally {
      loading.value = false
    }
  }

  // fetchMovies to include pagination and robust loading state ---
  const fetchMovies = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      // 1. USE THE PAGE PARAMETER IN THE URL
      const response = await fetch(`${baseUrl}/movie/popular?api_key=${apikey}&page=${page}`)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const movieData = await response.json()
      // Use '=' instead of 'await' here since movieData.results is a plain array
      movies.value = movieData.results
    } catch (error) {
      error.value = error.message
      movies.value = [] // Clear movies on error
      console.log('Failed Displaying data.', error)
    } finally {
      // Ensure loading is set to false after fetch completes
      loading.value = false
    }
  }

  return {
    movies,
    loading,
    movieDetails,
    topRatedMovies,
    error,
    searchMovies,
    fetchMovies,
    fetchMoviesDetails,
    fetchMovieVideos,
    fetchTopRatedMovies,
  }
}

import { ref } from 'vue'

// --- HOME PAGE CAROUSEL STATES (Limited to 15) ---
const trendingMovies = ref([])
const topRatedMoviesHome = ref([])
const actionMovies = ref([])
const comedyMovies = ref([])

// --- DEDICATED PAGE STATES (Full List + Pagination) ---
const trendingFullList = ref([]) // For /trending
const topRatedMovies = ref([]) // For /top-rated
const popularMovies = ref([]) // For /popular
const upcomingMovies = ref([]) // For /upcoming

// --- PAGINATION STATES ---
// We reuse the popular/upcoming pagination refs for other full-list pages for simplicity
const popularTotalPages = ref(1)
const popularPage = ref(1)
const upcomingTotalPages = ref(1)
const upcomingPage = ref(1)

// --- DETAILS & GENERAL STATES ---
const movieDetails = ref(null)
const loading = ref(false)
const error = ref(null)

// --- CONFIGURATION ---
// IMPORTANT: Ensure VITE_APP_API_KEY is correctly set in your .env file
const apikey = import.meta.env.VITE_APP_API_KEY
const baseUrl = 'https://api.themoviedb.org/3'

// Helper to limit results for home page carousels
const CAROUSEL_LIMIT = 15

// Helper function to fetch 24 results by combining two TMDb pages (20 + 4)
const fetchCombinedMovies = async (
  endpoint,
  page,
  movieStateRef,
  totalPagesRef,
  currentPageRef,
) => {
  loading.value = true
  error.value = null

  // Calculate the two TMDb pages needed for the current application page
  // App Page 1 = TMDb Pages 1 and 2
  const tmdbPage1 = page * 2 - 1
  const tmdbPage2 = page * 2

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${baseUrl}/${endpoint}?api_key=${apikey}&page=${tmdbPage1}`),
      fetch(`${baseUrl}/${endpoint}?api_key=${apikey}&page=${tmdbPage2}`),
    ])

    if (!res1.ok || !res2.ok) {
      throw new Error(`HTTP error: ${res1.status || res2.status}`)
    }

    const data1 = await res1.json()
    const data2 = await res2.json()

    // Combine page 1 (all 20) with the first 4 from page 2 to get 24
    const combinedResults = [...data1.results, ...data2.results.slice(0, 4)]

    // Calculate the total pages for the user (TMDb total / 2, rounded up)
    totalPagesRef.value = Math.ceil(data1.total_pages / 2)

    movieStateRef.value = combinedResults
    currentPageRef.value = page
  } catch (err) {
    error.value = err.message
    movieStateRef.value = []
    console.error(`Failed to fetch 24 movies for ${endpoint}:`, err)
  } finally {
    loading.value = false
  }
}

export function useMovies() {
  // --- DEDICATED PAGE FETCH FUNCTIONS (24 results per page using fetchCombinedMovies) ---

  const fetchTrendingMovies = async (page = 1) => {
    await fetchCombinedMovies(
      'trending/movie/week',
      page,
      trendingFullList,
      popularTotalPages, // Using popular pagination refs
      popularPage,
    )
  }

  const fetchTopRatedMovies = async (page = 1) => {
    await fetchCombinedMovies(
      'movie/top_rated',
      page,
      topRatedMovies,
      popularTotalPages, // Using popular pagination refs
      popularPage,
    )
  }

  const fetchPopularMovies = async (page = 1) => {
    await fetchCombinedMovies('movie/popular', page, popularMovies, popularTotalPages, popularPage)
  }

  const fetchUpcomingMovies = async (page = 1) => {
    await fetchCombinedMovies(
      'movie/upcoming',
      page,
      upcomingMovies,
      upcomingTotalPages,
      upcomingPage,
    )
  }

  // --- HOME PAGE CAROUSEL FETCH FUNCTIONS (15 results, no pagination) ---

  // Fetch Movies by Genre (Used for Action/Comedy carousels)
  const fetchGenreMovies = async (genreId, stateRef) => {
    try {
      const response = await fetch(
        `${baseUrl}/discover/movie?api_key=${apikey}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const movieData = await response.json()
      stateRef.value = movieData.results.slice(0, CAROUSEL_LIMIT)
    } catch (err) {
      console.error(`Failed to fetch movies for genre ${genreId}:`, err)
      stateRef.value = []
    }
  }

  // Master Fetch for Home Page (Runs all carousel fetches concurrently)
  const fetchAllHomeCarousels = async () => {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        // Fetch Trending (limited)
        fetch(`${baseUrl}/trending/movie/week?api_key=${apikey}&page=1`)
          .then((res) => res.json())
          .then((data) => {
            trendingMovies.value = data.results.slice(0, CAROUSEL_LIMIT)
          }),

        // Fetch Top Rated (limited)
        fetch(`${baseUrl}/movie/top_rated?api_key=${apikey}&page=1`)
          .then((res) => res.json())
          .then((data) => {
            topRatedMoviesHome.value = data.results.slice(0, CAROUSEL_LIMIT)
          }),

        fetchGenreMovies(28, actionMovies), // Action (ID 28)
        fetchGenreMovies(35, comedyMovies), // Comedy (ID 35)
      ])
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // --- OTHER FETCH FUNCTIONS ---

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
  }

  const searchMovies = async (query) => {
    if (!query) return
    loading.value = true
    error.value = null

    try {
      const res = await fetch(
        `${baseUrl}/search/movie?api_key=${apikey}&query=${encodeURIComponent(query)}`,
      )

      const data = await res.json()
      trendingFullList.value = data.results // Using the full list state for search results
    } catch (err) {
      err.value = 'Failed to fetch movies'
    } finally {
      loading.value = false
    }
  }
  // This function uses the same endpoint as searchMovies but is designed for lightweight, debounced calls
  const fetchSearchSuggestions = async (query) => {
    if (!query) return

    try {
      const res = await fetch(
        `${baseUrl}/search/movie?api_key=${apikey}&query=${encodeURIComponent(query)}&page=1`,
      )

      const data = await res.json()
      // Use the trendingFullList state to temporarily store the results for SearchBar consumption
      trendingFullList.value = data.results
    } catch (err) {
      console.error('Failed to fetch search suggestions:', err)
    }
    // IMPORTANT: Note that this function does *not* touch the global 'loading' ref,
    // ensuring the main page loading state is unaffected.
  }

  // --- EXPOSED INTERFACE ---
  return {
    // Home Carousels (Limited)
    trendingMovies,
    topRatedMoviesHome,
    actionMovies,
    comedyMovies,

    // Dedicated Pages Data (Full List - 24 per page)
    trendingFullList,
    topRatedMovies,
    popularMovies,
    upcomingMovies,

    // Pagination
    popularTotalPages,
    popularPage,
    upcomingTotalPages,
    upcomingPage,

    // Details & General
    movieDetails,
    loading,
    error,

    // Functions
    searchMovies,
    fetchTrendingMovies,
    fetchTopRatedMovies,
    fetchPopularMovies,
    fetchUpcomingMovies,
    fetchAllHomeCarousels,
    fetchMoviesDetails,
    fetchMovieVideos,
    fetchSearchSuggestions,
  }
}

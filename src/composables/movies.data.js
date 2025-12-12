import { ref } from "vue";

export function useMovies() {
  const movies = ref([]);
  const movieDetails = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const apikey = import.meta.env.VITE_APP_API_KEY;
  const baseUrl = 'https://api.themoviedb.org/3';

  const searchMovies = async (query) => {
    if (!query) return;
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(
        `${baseUrl}/search/movie?api_key=${apikey}&query=${encodeURIComponent(
          query
        )}`
      );

      const data = await res.json();
      movies.value = data.results;
    } catch (err) {
      err.value = "Failed to fetch movies";
    } finally {
      loading.value = false;
    }
  };

  const fetchMoviesDetails = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(
        `${baseUrl}/movie/${id}?api_key=${apikey}`
      )
      movieDetails.value = await res.json()
    } catch (err) {
      error.value = "Failed to fetch movie details"
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


  const fetchMovies = async () => {
    loading.value = true
    error.value = null
    try{
      const response = await fetch(
        `${baseUrl}/movie/popular?api_key=${apikey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const movieData = await response.json();
      movies.value= await movieData.results;
    }
    catch (error){
      error.value = error.message
      console.log('Failed Displaying data.')
    }
  };

  return {
    movies,
    loading,
    movieDetails,
    error,
    searchMovies,
    fetchMovies,
    fetchMoviesDetails,
    fetchMovieVideos,
  };
}



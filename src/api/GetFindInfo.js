import { API_KEY } from "./apiKey";

export default class GetFindInfo {

  static async getFilmsByQuery(page,movieQuery) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ru&query=${movieQuery}&page=${page}`)
      const premiereData = await response.json();

      return premiereData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getSerialsByQuery(page,serialQuery) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=ru&query=${serialQuery}&page=${page}`)
      const premiereData = await response.json();

      return premiereData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getFilterMovies(page,years,id,query) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&query=${query}&page=${page}&primary_release_year=${years}&with_genres=${id}&with_watch_monetization_types=flatrate&language=ru`)
      const filterData = await response.json();

      return filterData;

    } catch (error) {
      console.error(error);
    }
  }
}

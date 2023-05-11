import { API_KEY } from "./apiKey";

export default class GetSerials {
  static async getRecommendation(genres,actors) {

    try {
      const responseGenres =  await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=uk&with_genres=${genres.join(',')}`);
      const responseActors =  await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=uk&with_cast=${actors.join(',')}`);
      const responseMix =  await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=uk&with_genres=${genres.join(',')}&with_cast=${actors.join(',')}`);
      const genreData = await responseGenres.json();
      const actorsData = await responseActors.json();
      const mixData = await responseMix.json();
      const data=genreData.results.concat(actorsData.results).concat(mixData.results).filter((item, index, self) =>
        index === self.findIndex((i) => i.id === item.id)
      ).slice(0,10);
      // console.log('ds',data)
      return data

    } catch (error) {
      console.error(error);
    }
  }
  static async getTopSerials() {

    try {
      const response =  await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=uk`);
      const topData = await response.json();

      return topData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getLatestSerials() {

    try {
      const response =  await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=uk`);
      const topData = await response.json();

      return topData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getPopularSerials(page) {

    try {
      const response =  await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=uk&page=${page}`)
      const popularData = await response.json();

      return popularData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getDetailSerial(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=uk&append_to_response=credits`)
      const detailData = await response.json();

      return detailData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getDetailSeason(id,season){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=uk&append_to_response=credits`)
      const detailData = await response.json();

      return detailData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getSimilarSerial(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=uk&sort_by=popularity.desc`)
      const similarSerialData = await response.json();

      return similarSerialData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getReviews(id){
    try {

      const response =    await fetch(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${API_KEY}&language=uk`)
      const reviewsData = await response.json();

      return reviewsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getRatings(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=external_ids`).then(data => data.json()).then(async data2 => {

        await fetch(`http://www.omdbapi.com/?i=${data2.external_ids["imdb_id"]}&apikey=1d2aeb4f`)})
      const reviewsData = await response.json();

      return reviewsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getSerialTrailer(serial_id){
    try {
      const response=await fetch(`https://api.themoviedb.org/3/tv/${serial_id}/videos?api_key=${API_KEY}&language=uk&language=en-US`)
      const trailer=await response.json()
      return trailer.results
    }catch (error){
      console.log(error)
    }
  }
}

import { API_KEY } from "./apiKey";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class GetActorsInfo {
  static async getActorsInfo(id) {

    try {
      const locale=await AsyncStorage.getItem('locale')
      const response =   await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=ee712ed3d9a31ac90e78463a3c77245f&language=${locale==='ukr'?'uk':'en'}`)
      const actorsData = await response.json();

      return actorsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getActorsFilms(id) {

    try {
      const locale=await AsyncStorage.getItem('locale')
      const response = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&sort_by=popularity.desc&language=${locale==='ukr'?'uk':'en'}`)
      const actorsFilmsData = await response.json();

      return actorsFilmsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getPopularActors(page) {

    try {
      const locale=await AsyncStorage.getItem('locale')
      const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}&language=${locale==='ukr'?'uk':'en'}`)
      const actorsData = await response.json();

      return actorsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getActorsByQuery(page,query) {

    try {
      const locale=await AsyncStorage.getItem('locale')
      const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale==='ukr'?'uk':'en'}`)
      const actorsData = await response.json();

      return actorsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getActorImages(id) {

    try {

      const response = await fetch(`https://api.themoviedb.org/3/person/${id}/images?api_key=${API_KEY}`)
      const actorsData = await response.json();

      return actorsData;

    } catch (error) {
      console.error(error);
    }
  }
}

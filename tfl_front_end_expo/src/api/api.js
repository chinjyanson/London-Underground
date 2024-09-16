import Constants from 'expo-constants';
import {
    postJsonFetchRequest,
    getFetchRequest,
} from './api_utils';

const getApiUrl = () => {
    if (Constants.expoConfig && Constants.expoConfig.extra) {
      return Constants.expoConfig.extra.API_URL;
    }
    return null;
  };

const apiUrl = getApiUrl();

export const find_optimal_path = async (start_lng, start_lat, end_lng, end_lat) => {
    console.log(start_lng, start_lat, end_lng, end_lat);
    const response = await getFetchRequest(
      `${apiUrl}/find_optimal_path?start_lng=${start_lng}&start_lat=${start_lat}&end_lng=${end_lng}&end_lat=${end_lat}`);
    return response;
};
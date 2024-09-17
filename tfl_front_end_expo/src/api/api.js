import { API_URL } from '@env';
import {
    postJsonFetchRequest,
    getFetchRequest,
} from './api_utils';


export const find_optimal_path = async (start_lng, start_lat, end_lng, end_lat) => {
    const response = await getFetchRequest(
      `${API_URL}/find_optimal_path?start_lng=${start_lng}&start_lat=${start_lat}&end_lng=${end_lng}&end_lat=${end_lat}`);
    return response;
};

export const get_all_stations = async () => {
    const response = await getFetchRequest(`${API_URL}/get_all_stations`);
    return response;
}
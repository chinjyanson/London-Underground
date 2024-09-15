import { apiUrl } from '../config';
import {
    postJsonFetchRequest,
    getFetchRequest,
} from './api_utils';

// export const find_optimal_path = async (startLocation, destination) => {
//     const apiEndpoint = `${apiUrl}/find_optimal_path`;
//     console.log('Calling API:', apiEndpoint);

//     try {
//         const data = await postJsonFetchRequest(apiEndpoint, {}, {
//             start: startLocation,
//             end: destination,
//         });
//         console.log(data); // `data` already contains the parsed JSON response
//     } catch (error) {
//         console.error('Error in find_optimal_path:', error);
//         throw error;
//     }
// };

export const find_optimal_path = async (startLocation, destination) => {
    const response = await getFetchRequest(`${apiUrl}/find_optimal_path?start=${startLocation}&end=${destination}`);
    return response;
};
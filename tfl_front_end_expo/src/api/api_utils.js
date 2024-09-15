// General HTTP Request function for flexibility
export function makeHttpRequest(url, method, headers = {}, body = null) {
    return fetch(url, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error in HTTP request:', error);
            throw error;
        });
}

/**
 * GET fetch request
 * @param {String} url 
 * @param {JSON} headers 
 * @returns {Promise<JSON>}
 */
export function getFetchRequest(url, headers = {}) {
    return fetch(url, {
        method: 'GET',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error in GET request:', error);
            throw error;
        });
}

/**
 * POST request with FormData
 * @param {String} url 
 * @param {JSON} headers 
 * @param {FormData} body 
 * @returns {Promise<JSON>}
 */
export function postFormDataFetchRequest(url, headers = {}, body) {
    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error in POST FormData request:', error);
            throw error;
        });
}

/**
 * POST request with JSON
 * @param {String} url 
 * @param {JSON} headers 
 * @param {JSON} body 
 * @returns {Promise<JSON>}
 */
export function postJsonFetchRequest(url, headers = {}, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();  // Parse the JSON response here
        })
        .catch((error) => {
            console.error('Error in POST JSON request:', error);
            throw error;
        });
}

/**
 * PUT fetch request
 * @param {String} url 
 * @param {JSON} headers 
 * @param {FormData | JSON} body 
 * @returns {Promise<JSON>}
 */
export function putFetchRequest(url, headers = {}, body) {
    return fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error in PUT request:', error);
            throw error;
        });
}

/**
 * PATCH fetch request
 * @param {String} url 
 * @param {JSON} headers 
 * @param {FormData | JSON} body 
 * @returns {Promise<JSON>}
 */
export function patchFetchRequest(url, headers = {}, body) {
    return fetch(url, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error in PATCH request:', error);
            throw error;
        });
}

/**
 * DELETE fetch request
 * @param {String} url 
 * @param {JSON} headers 
 * @returns {Promise<JSON>}
 */
export function deleteFetchRequest(url, headers = {}) {
    return fetch(url, {
        method: 'DELETE',
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error in DELETE request:', error);
            throw error;
        });
}

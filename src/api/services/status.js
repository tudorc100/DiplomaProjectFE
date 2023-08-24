import authHeader, { BASE_URL, HTTP } from "../http";

export default {
    allStatuses() {
        return HTTP.get(BASE_URL + "/status", { headers: authHeader() }).then(
            (response) => {
                return response.data;
            }
        );
    },
    getAllStatusesForUser(userId) {
        return HTTP.get(`${BASE_URL}/status/${userId}`, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    },

    createStatus(status) {
        return HTTP.post(`${BASE_URL}/status`, status, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    },

    updateStatus(status) {
        return HTTP.patch(BASE_URL+"/status/"+status.id,status, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    },

    deleteStatus(status) {
        return HTTP.delete(BASE_URL+"/status/"+status.id, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }
}
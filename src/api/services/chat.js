import authHeader, { BASE_URL, HTTP } from "../http";

export default {
    allChats() {
        return HTTP.get(BASE_URL + "/chat", { headers: authHeader() }).then(
            (response) => {
                return response.data;
            }
        );
    },

    send(chat) {
        return HTTP.post(`${BASE_URL}/chat`, chat, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    },
}
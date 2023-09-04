import authHeader, { BASE_URL} from "../http";
import axios from "axios";

export default {


    async send(formData) {
        try {
            const response = await axios.post(BASE_URL + "/email", formData, {headers: authHeader()});
            console.log('Email sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },
}
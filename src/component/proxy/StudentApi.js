import axios from "axios";

const BASE_URL = 'http://localhost:8080/v1/api/student';


class StudentAPI {
  

    addStudent(requestData, token){
        return axios.post(BASE_URL + '/add', requestData, { headers: {"Authorization":`Bearer ${JSON.parse(token)}`}});
    }

    
}

export default new StudentAPI();

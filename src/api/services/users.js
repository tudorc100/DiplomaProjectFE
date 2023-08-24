import authHeader, { BASE_URL, HTTP } from "../http";

export default {
  allUsers() {
    return HTTP.get(BASE_URL + "/users", { headers: authHeader() }).then(
      (response) => {
        return response.data;
      }
    );
  },
  create(user) {
    return HTTP.post(BASE_URL + "/users", user, { headers: authHeader() }).then(
      (response) => {
        return response.data;
      }
    );
  },
  edit(user) {
    return HTTP.patch(BASE_URL + "/users/" + user.id, user, {
      headers: authHeader(),
    }).then((response) => {
      return response.data;
    });
  },
  delete(user) {
    return HTTP.delete(BASE_URL + "/users/" + user.id, {
      headers: authHeader(),
    }).then((response) => {
      return response.data;
    });
  },
  sendMessage(username,msg) {
    return HTTP.post(BASE_URL + "/users/" + username, msg, {
      headers: authHeader(),
    }).then((response) => {
      return response.data;
    });
  },
  makeAdmin(id) {
    return HTTP.post(BASE_URL + "/users/admin/" + id, {}, {
      headers: authHeader(),
    }).then((response) => {
      return response.data;
    });
  },
  addFamilyMember(id, cnp) {
    return HTTP.post(BASE_URL + "/users/add-family/" + id, { cnp }, {
      headers: authHeader(),
    }).then((response) => {
      return response.data;
    });
  },
  findFamilyMembers(username) {
    return HTTP.get(BASE_URL + "/users/family/" + username, { headers: authHeader() }).then(
        (response) => {
          return response.data;
        }
    );
  }
}
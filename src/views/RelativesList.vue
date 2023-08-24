<template>
  <v-card class="user-list">
    <v-card-title class="user-list__title">
      Relatives
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="user-list__search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        @click:row="editUser"
        class="user-list__table"
    ></v-data-table>
    <UserDialog
        :opened="dialogVisible"
        :user="selectedUser"
        @refresh="refreshList"
    ></UserDialog>
  </v-card>
</template>

<script>
import api from "../api";
import UserDialog from "../components/UserDialog";
export default {
  name: "RelativesList",
  components: { UserDialog },
  data() {
    return {
      users: [],
      search: "",
      headers: [
        {
          text: "Username",
          align: "start",
          sortable: false,
          value: "username",
        },
        { text: "Name", value: "name" },
        { text: "Cnp", value: "cnp" },
        { text: "Email", value: "email" },
        { text: "Roles", value: "roles" },
      ],
      dialogVisible: false,
      selectedUser: {},
    };
  },
  methods: {
    editUser(user) {
      this.selectedUser = user;
      this.dialogVisible = true;
    },
    addUser() {
      this.dialogVisible = true;
    },
    deleteUser(user) {
      this.selectedUser = user;
      this.dialogVisible = true;
    },
    async refreshList() {
      this.dialogVisible = false;
      this.selectedUser = {};
       const user = JSON.parse(localStorage.getItem("user"));
      this.users = await api.users.findFamilyMembers(user.username);
    },
  },
  created() {
    this.refreshList();
  },
};
</script>

<style scoped>
.user-list {
  max-width: 800px;
  margin: 0 auto;
}

.user-list__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-list__search {
  width: 200px;
}


.user-list__table {
  margin-top: 16px;
}
</style>

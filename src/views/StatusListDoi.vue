<template>
  <v-card class="user-list">
    <v-card-title class="user-list__title">
      Statuses
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="user-list__search"
      ></v-text-field>
      <v-btn @click="addStatus" class="user-list__btn" v-if="isAdmin">Add Status</v-btn>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="statusuri"
        :search="search"
        @click:row="editStatus"
        class="user-list__table"
    ></v-data-table>
    <StatusDialog
        @clickOutside="dialogVisible = false"
        :opened="dialogVisible"
        :status="selectedStatus"
        @refresh="refreshList"
    ></StatusDialog>
  </v-card>
</template>

<script>
import api from "../api";
import StatusDialog from "@/components/StatusDialog.vue";
export default {
  name: "RelativesListDoi",
  components: { StatusDialog },
  data() {
    return {
      statusuri: [],
      search: "",
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Timestamp", value: "timestamp" },
        { text: "Status", value: "status" },
      ],
      dialogVisible: false,
      selectedStatus: {},
    };
  },
  methods: {
    editStatus(status) {
      this.selectedStatus = status;
      this.dialogVisible = true;
    },
    addStatus() {
      this.dialogVisible = true;
    },
    async refreshList() {
      console.log(localStorage.getItem("userId"));
      this.dialogVisible = false;
      this.selectedStatus = {};
      this.statusuri = await api.status.getAllStatusesForUser(localStorage.getItem("userId"));
    },
  },
  created() {
    console.log(localStorage.getItem("userId"));
    this.refreshList();
  },
  computed: {
    isNew: function () {
      return !this.user.id;
    },
    isAdmin: function ()
    {
      return this.$store.getters["auth/isAdmin"];
    },
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

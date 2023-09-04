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
      <v-btn @click="downloadTableAsPDF">Download Status</v-btn>
      <v-btn @click="addStatus" class="user-list__btn" v-if="isAdmin">Add Status</v-btn>
      <v-btn @click="sendTableViaEmail">E-mail Status</v-btn>
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
import {jsPDF} from "jspdf";
export default {
  name: "RelativesList",
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
    downloadTableAsPDF() {
      const doc = new jsPDF();
      const tableData = [];

      this.statusuri.forEach(item => {
        const rowData = [];
        rowData.push(item.id);
        rowData.push(item.timestamp);
        rowData.push(item.status);


        tableData.push(rowData);
      });

      doc.autoTable({
        head: [['Id', 'Timestamp', 'Status']], // column headers
        body: tableData,
      });

      doc.save('table-data.pdf');
    },
    sendTableViaEmail() {
      const doc = new jsPDF();
      const tableData = [];

      this.statusuri.forEach(item => {
        const rowData = [];
        rowData.push(item.id);
        rowData.push(item.timestamp);
        rowData.push(item.status);


        tableData.push(rowData);
      });

      doc.autoTable({
        head: [['Id', 'Timestamp', 'Status']], // column headers
        body: tableData,
      });
      const user = JSON.parse(localStorage.getItem("user"));
      const blob = new Blob([doc.output('arraybuffer')], {type: 'application/pdf'});

      // Create form data to send Blob and username
      const formData = new FormData();
      formData.append('document', blob, 'table-data.pdf');
      formData.append('username', user.username); // replace with the actual username
      api.email.send(formData);
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

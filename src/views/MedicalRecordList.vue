<template>
  <v-card class="user-list">
    <v-card-title class="user-list__title">
      Medical Records
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="user-list__search"
      ></v-text-field>
      <v-btn @click="addMedicalRecord" class="user-list__btn" v-if="isAdmin">Add Medical Record</v-btn>
      <v-btn @click="downloadTableAsPDF">Download Records</v-btn>
      <v-btn @click="sendTableViaEmail">E-mail Medical Records</v-btn>

    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="medicalRecords"
        :search="search"
        @click:row="editMedicalRecord"
        class="user-list__table"
    ></v-data-table>
    <MedicalRecordDialog
        @clickOutside="dialogVisible = false"
        :opened="dialogVisible"
        :medicalRecord="selectedMedicalRecord"
        @refresh="refreshList"
    ></MedicalRecordDialog>
  </v-card>
</template>

<script>
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import api from "../api";
import MedicalRecordDialog from "@/components/MedicalRecordDialog.vue";

export default {
  name: "MedicalRecordList",
  components: { MedicalRecordDialog },
  data() {
    return {
      medicalRecords: [],
      search: "",
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Title", value: "title" },
        { text: "Department", value: "department" },
        { text: "Description", value: "description" },
        { text: "Entry Date", value: "entryDate" },
      ],
      dialogVisible: false,
      selectedMedicalRecord: {},
    };
  },
  methods: {
    editMedicalRecord(medicalRecord) {
      this.selectedMedicalRecord = medicalRecord;
      this.dialogVisible = true;
    },
    addMedicalRecord() {
      this.dialogVisible = true;
    },
    async refreshList() {
      this.dialogVisible = false;
      this.selectedMedicalRecord = {};
      this.medicalRecords = await api.medicalRecords.allItemsForUser(localStorage.getItem("userId"));
    },
    downloadTableAsPDF() {
      const doc = new jsPDF();
      const tableData = [];

      // Assuming your table's data is stored in a data property named 'items'
      this.medicalRecords.forEach(item => {
        const rowData = [];

        // Assuming columns are: 'name', 'status', 'date' (modify as needed)
        rowData.push(item.id);
        rowData.push(item.title);
        rowData.push(item.department);
        rowData.push(item.description);
        rowData.push(item.entryDate);


        tableData.push(rowData);
      });

      doc.autoTable({
        head: [['Id', 'Title', 'Department','Description','Date']], // column headers
        body: tableData,
      });

      doc.save('table-data.pdf');
    },
    async sendTableViaEmail() {
      const doc = new jsPDF();
      const tableData = [];

      // Assuming your table's data is stored in a data property named 'items'
      this.medicalRecords.forEach(item => {
        const rowData = [];

        // Assuming columns are: 'name', 'status', 'date' (modify as needed)
        rowData.push(item.id);
        rowData.push(item.title);
        rowData.push(item.department);
        rowData.push(item.description);
        rowData.push(item.entryDate);


        tableData.push(rowData);
      });

      doc.autoTable({
        head: [['Id', 'Title', 'Department', 'Description', 'Date']], // column headers
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
    this.refreshList();
  },
  computed: {
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
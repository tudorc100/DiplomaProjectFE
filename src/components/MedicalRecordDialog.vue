<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    :value="opened"
  >
    <template>
      <v-card class="medical-record-dialog">
        <v-toolbar color="primary" dark class="medical-record-dialog-title">
          {{ isNew ? "Create Medical Record" : "Edit Medical Record" }}
        </v-toolbar>
        <v-form>
          <v-text-field v-model="medicalRecord.id" label="Id" />
          <v-text-field v-model="medicalRecord.title" label="Title" />
          <v-text-field v-model="medicalRecord.description" label="Description" />
          <v-text-field v-model="medicalRecord.department" label="Department" />
          <v-text-field v-model="medicalRecord.entryDate" label="Date"  />
        </v-form>
        <v-card-actions>
          <v-btn @click="persist" class="medical-record-dialog-button">
            {{ isNew ? "Create" : "Save" }}
          </v-btn>
          <v-btn @click="deleteMedicalRecord" v-if="!isNew" class="medical-record-dialog-button">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import api from "../api";

export default {
  name: "MedicalRecordDialog",
  props: {
    medicalRecord: Object,
    opened: Boolean,
  },
  computed: {
    isNew() {
      return !this.medicalRecord.id;
    },
    formattedDate() {
      const timestamp = new Date(this.medicalRecord.date);
      const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
      return timestamp.toLocaleDateString(undefined, options);
    },
  },
  methods: {
    persist() {
      if (this.isNew) {
        api.medicalRecords
          .create({
            title: this.medicalRecord.title,
            department: this.medicalRecord.department,
            description: this.medicalRecord.description,
            entryDate: this.medicalRecord.entryDate,
            userId: this.usrId,

          })
          .then(() => this.$emit("refresh"));
      } else {
        api.medicalRecords
          .edit({
            id: this.medicalRecord.id,
            title: this.medicalRecord.title,
            department: this.medicalRecord.department,
            description: this.medicalRecord.description,
            entryDate: this.medicalRecord.entryDate,
            userId: this.usrId,
          })
          .then(() => this.$emit("refresh"));
      }
    },
    deleteMedicalRecord() {
      if (!this.isNew) {
        api.medicalRecords
          .delete({
            id: this.medicalRecord.id,
          })
          .then(() => this.$emit("refresh"));
      }
    },
  },
  data() {
    return {
      usrId: ''
    };
  },
  created() {
    this.usrId = localStorage.getItem('userId') || '';
  },
};
</script>

<style scoped>
.medical-record-dialog {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.medical-record-dialog-title {
  font-size: 24px;
  font-weight: bold;
  padding: 24px;
  background-color: #2196f3;
  color: white;
  border-radius: 8px 8px 0 0;
  margin-bottom: 16px;
}

.medical-record-dialog-title::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: #2196f3;
  border-radius: 8px 8px 0 0;
}

.medical-record-dialog-title::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
}
</style>

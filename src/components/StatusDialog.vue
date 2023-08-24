<template>
  <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      :value="opened"
  >
    <template>
      <v-card class="status-dialog">
        <v-toolbar color="primary" dark class="status-dialog-title" v-if="isAdmin">
          {{ isNew ? "Create Status" : "Edit Status" }}
        </v-toolbar>
        <v-form>
          <v-text-field v-model="status.timestamp" label="Time" :readonly="!isAdmin" />
          <v-text-field v-model="status.status" label="Status" :readonly="!isAdmin" />
        </v-form>
        <v-card-actions>
          <v-btn @click="persist" class="status-dialog-button" v-if="isAdmin">
            {{ isNew ? "Create" : "Save" }}
          </v-btn>
          <v-btn @click="deleteStatus" v-if="!isNew && isAdmin" class="status-dialog-button">
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
  name: "StatusDialog",
  props: {
    status: Object,
    opened: Boolean,
  },
  computed: {
    isNew() {
      return !this.status.id;
    },
    isAdmin: function ()
    {
      return this.$store.getters["auth/isAdmin"];
    },
  },
  methods: {
    persist() {
      if (this.isNew) {
        api.status
            .createStatus({
              timestamp: this.status.timestamp,
              status: this.status.status,
              userId: this.usrId,
            })
            .then(() => this.$emit("refresh"));
      } else {
        api.status
            .updateStatus({
              id: this.status.id,
              timestamp: this.status.timestamp,
              status: this.status.status,
              userId: this.usrId,
            })
            .then(() => this.$emit("refresh"));
      }
    },
    deleteStatus() {
      if (!this.isNew) {
        api.status
            .deleteStatus({
              id: this.status.id,
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
.status-dialog {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.status-dialog-title {
  font-size: 24px;
  font-weight: bold;
  padding: 24px;
  background-color: #2196f3;
  color: white;
  border-radius: 8px 8px 0 0;
  margin-bottom: 16px;
}

.status-dialog-title::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 8px;
  background-color: #2196f3;
  border-radius: 8px 8px 0 0;
}

.status-dialog-title::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2196f3;
}
.status-dialog-button {
  color: white;
}
</style>

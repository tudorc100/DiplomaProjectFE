<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    :value="opened"
  >
    <template>
      <v-card>
        <v-toolbar color="primary" dark v-if="isAdmin">
          {{ isNew ? "Create user" : "Edit user" }}
        </v-toolbar>
        <v-form>
          <v-text-field v-model="user.username" label="Username" :readonly="!isAdmin"/>
          <v-text-field v-model="user.name" label="Name" :readonly="!isAdmin"/>
          <v-text-field v-model="user.email" label="Email" :readonly="!isAdmin"/>
          <v-text-field v-model="user.cnp" label="Cnp" :readonly="!isAdmin"/>
          <v-text-field v-model="user.password" label="Password" :readonly="!isAdmin"/>
        </v-form>
        <v-card-actions>
          <v-btn v-if="isAdmin" @click="persist">
            {{ isNew ? "Create" : "Save" }}
          </v-btn>
          <v-btn @click="deleteFunc" v-if="!isNew && isAdmin">
            Delete
          </v-btn>
          <v-btn @click="medicalRecordsList" v-if="!isNew">
            See medical records
          </v-btn>
          <v-btn @click="statusList" v-if="!isNew">
            See status
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import api from "../api";
import router from "@/router";

export default {
  name: "UserDialog",
  props: {
    user: Object,
    opened: Boolean,
  },
  methods: {
    persist() {
      if (this.isNew) {
        api.users
          .create({
            username: this.user.username,
            name:this.user.name,
            email: this.user.email,
            cnp:this.user.cnp,
            password: this.user.password,
          })
          .then(() => this.$emit("refresh"));
      } else {
        api.users
          .edit({
            id: this.user.id,
            username: this.user.username,
            name:this.user.name,
            email: this.user.email,
            cnp:this.user.cnp,
            password: this.user.password
          })
          .then(() => this.$emit("refresh"));
      }
    },
    deleteFunc(){
        if (!this.isNew) {
        api.users
          .delete({
            id: this.user.id,
          })
          .then(() => this.$emit("refresh"));
      }
    },
    medicalRecordsList()
    {
      localStorage.setItem('userId', this.user.id);
      router.push("/medicalRecords");
    },
    statusList()
    {
      localStorage.setItem('userId', this.user.id);
      router.push("/status");
    },
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

<style scoped></style>

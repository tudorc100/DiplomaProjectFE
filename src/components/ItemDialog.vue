<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    :value="opened"
  >
    <template>
      <v-card>
        <v-toolbar color="primary" dark>
          {{ isNew ? "Create item" : "Edit item" }}
        </v-toolbar>
        <v-form>
          <v-text-field v-model="item.description" label="Description" />
          <v-text-field v-model="item.department" label="Department" />
          <v-text-field v-model="item.userId" label="User ID" />

        </v-form>
        <v-card-actions>
          <v-btn @click="persist">
            {{ isNew ? "Create" : "Save" }}
          </v-btn>
          <v-btn @click="deleteItem" v-if="!isNew"> Delete </v-btn>

        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import api from "../api";

export default {
  name: "ItemDialog",
  props: {
    item: Object,
    opened: Boolean,
  },
  methods: {
    persist() {
      if (this.isNew) {
        api.items
          .create({
             description: this.item.description,
            address: this.item.department,
            userId: this.item.userId,
          })
          .then(() => this.$emit("refresh"));
      } else {
        api.items
          .edit({
            id:this.item.id,
            description: this.item.description,
            address: this.item.department,
            userId: this.item.userId,
          })
          .then(() => this.$emit("refresh"));
      }
    },
     deleteItem() {
      if (!this.isNew) {
        api.items
          .delete({
            id: this.item.id,
          })
          .then(() => this.$emit("refresh"));
      }
    },
  },
  computed: {
    isNew: function () {
      return !this.item.id;
    },
  },
};
</script>

<style scoped></style>

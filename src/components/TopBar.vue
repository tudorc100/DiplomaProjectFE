<template>
  <v-card class="top-bar" flat tile>
    <v-toolbar color="blue darken-2" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title class="title">Medical App</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import router from "../router";

export default {
  name: "TopBar",
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      router.push("/");
    },
  },
};
</script>

<style scoped>
.top-bar {
  background-color: #3f51b5;
}

.title {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
}
</style>

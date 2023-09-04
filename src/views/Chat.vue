<template>
  <v-card class="user-list">
    <v-card-title class="user-list__title">
      Users
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
        :items="chats"
        :search="search"
        class="user-list__table"
    >
      <template v-slot:item.time="{ item }">
        {{ formatDateTime(item.time) }}
      </template>
    </v-data-table>
    <v-text-field
        label="New Message"
        v-model="newMessageText"
        outlined
    ></v-text-field>
    <v-btn @click="sendMessage" color="primary">Send</v-btn>
  </v-card>
</template>

<script>
import api from "../api";
export default {
  name: "Chat",
  data() {
    return {
      chats: [],
      search: "",
      newMessageText: "",
      headers: [
        {
          text: "Time",
          align: "start",
          sortable: false,
          value: "time",
        },
        { text: "Text", value: "text" },
        { text: "Author", value: "author" },
      ],
    };
  },
  methods: {
    async refreshList() {
      this.chats = await api.chat.allChats();
    },
    formatDateTime(isoString) {
      let date = new Date(isoString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    async sendMessage() {
      if (!this.newMessageText.trim()) return;
      const user = JSON.parse(localStorage.getItem("user"));

      const message = {
        author: user.username,
        text: this.newMessageText,
      };

      try {
        api.chat.send(message);
        this.chats.push({
          author: user.username,
          text: this.newMessageText,
          time: new Date().toISOString(),
        });
        this.newMessageText = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
      await this.refreshList();
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

.user-list__btn {
  margin-left: 8px;
}

.user-list__table {
  margin-top: 16px;
}
</style>

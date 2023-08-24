<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong>{{ message.author }}</strong> {{ message.text }} <span class="timestamp">{{ formatTime(message.time) }}</span>
      </div>
    </div>
    <div class="input-group">
      <v-text-field v-model="text" placeholder="Message" @keyup.enter="sendMessage" solo></v-text-field>
      <v-btn color="primary" @click="sendMessage">Send</v-btn>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: "ChatPage",
  data() {
    return {
      stompClient: null,
      messages: [],
      author: localStorage.getItem('username'),  // assuming the username is stored in local storage
      text: ''
    };
  },
  created() {
    const socket = new SockJS('http://localhost:8080/chat');
    this.stompClient = Stomp.over(socket);
    // eslint-disable-next-line no-unused-vars
    this.stompClient.connect({}, frame => {
      this.stompClient.subscribe('/topic/messages', message => {
        this.messages.push(JSON.parse(message.body));
      });
    });
  },
  methods: {
    sendMessage() {
      console.log(JSON.stringify({
        author: this.author,
        text: this.text
      }));
      if (this.text.trim() !== '') {
        this.stompClient.send("/app/send", {}, JSON.stringify({
          author: this.author||"Anonymous",
          text: this.text
        }));
        this.text = '';
      }
    },
    formatTime(time) {
      const date = new Date(time);
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.messages {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e1e1e1;
  padding: 10px;
  margin-bottom: 10px;
}
.message {
  margin-bottom: 10px;
}
.timestamp {
  color: #aaa;
  margin-left: 10px;
}
.input-group {
  display: flex;
}
</style>

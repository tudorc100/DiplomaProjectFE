<template>
  <div>
    <v-card>
      <v-card-title>
        Messages
      </v-card-title>
      <v-data-table
          :headers="headers1"
          :items="received_messages">
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.fromUsername }}</td>
            <td>{{ row.item.message }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <ChatDialog
          @sentMessage="(message) => this.received_messages.push(message)"></ChatDialog>
    </v-card>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import ChatDialog from "@/components/ChatDialog";
let user = JSON.parse(localStorage.getItem("user"));
export default {
  name: "Chat",
  components: {ChatDialog},
  data() {
    return {
      headers1: [
        {text: "From", value: "from"},
        {text: "Message", value: "message"},
      ],
      dialogVisible: false,
      measurementDialogVisible: false,
      allUsers: [],
      loggedUser: user,
      received_messages: [],
      connected: false
    };
  },
  methods: {
    async refreshList() {
      user = JSON.parse(localStorage.getItem("user"));
      this.loggedUser = user;
      this.dialogVisible = false;
    },
    connect() {
      this.socket = new SockJS("http://localhost:8088/api/websocket");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
          {},
          frame => {
            console.log(frame);
            this.connected = true;
            this.stompClient.subscribe("/topic/greetings/" + this.loggedUser.id, tick => {
              this.received_messages.push(JSON.parse(tick.body));
              alert(tick.body);
            });
          },
          error => {
            console.log("error " + error);
            this.connected = false;
          }
      )
    }
  },
  created() {
    this.refreshList();
    this.connect();
  },
};
</script>

<style scoped></style>
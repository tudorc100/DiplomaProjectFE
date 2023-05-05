<template>
  <v-card>
    <v-card-title>
      Devices
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
    ></v-data-table>
    <ItemDialog
        :opened="dialogVisible"
        :item="selectedItem"
        @refresh="refreshList"
    ></ItemDialog>
  </v-card>
</template>

<script>
import api from "../api";
import ItemDialog from "../components/ItemDialog";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client"

export default {
  name: "ItemList",
  components: { ItemDialog },
  data() {
    return {
      items: [],
      received_messages: [],
      send_message: null,
      connected:false,
      search: "",
      headers: [
        {
          text: "Id",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Description", value: "description" },
        { text: "Address", value: "address" },
        { text: "Consumption", value: "consumption" },
      ],
      dialogVisible: false,
      selectedItem: {},
    };
  },
  methods: {

    async refreshList() {
      this.dialogVisible = false;
      this.selectedItem = {};
      this.items = await api.items.allItemsForUser();
    },

  connect() {
    this.socket = new SockJS("http://localhost:8088/api/websocket");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true;
          console.log(frame);
          this.stompClient.subscribe("/topic", (tick) => {
            console.log(tick);
            const str = tick.body.split(":");
            if (
                JSON.parse(localStorage.getItem("user")).id === Number(str[0])
            ) {
              alert(tick.body);
            }
            this.received_messages.push(JSON.parse(tick.body).content);
          });
        },
        (error) => {
          console.log(error);
          this.connected = false;
        }
    );
  },
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    this.connected=false;
  },
  },
  created() {
    this.refreshList();
    this.connect();
  },

};
</script>

<style scoped></style>

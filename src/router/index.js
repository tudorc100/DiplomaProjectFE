import Vue from "vue";
import VueRouter from "vue-router";
import UserList from "../views/UserList.vue";
import ItemList from "../views/ItemList.vue";
import { auth as store } from "../store/auth.module";
import Login from "../views/Login";
import ItemListForUser from "@/views/ItemListForUser";
import Chat from "@/views/Chat.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/users",
    name: "Users",
    component: UserList,
    beforeEnter: (to, from, next) => {
      if (store.getters.isAdmin) {
        next();
      } else {
        next({ name: "Sell" });
      }
    },
  },

  {
    path: "/items",
    name: "Items",
    component: ItemList,
    beforeEnter: (to, from, next) => {
      if (store.state.status.loggedIn) {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    beforeEnter: (to, from, next) => {
      if (store.state.status.loggedIn) {
        next();
      } else {
        next({ name: "Home" });
      }
    },
  },
  {
    path: "/itemsforusr",
    name: "ItemsForUser",
    component: ItemListForUser,
    beforeEnter: (to, from, next) => {
      if (store.state.status.loggedIn) {
        next();
      } else {
        next({name: "Home"});
      }
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;

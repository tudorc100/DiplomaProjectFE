<template>
  <v-container class="login-container">
    <v-layout row justify-center>
      <v-flex xs12 md8 lg6>
        <v-card class="elevation-12">
          <v-toolbar class="primary lighten-1">
            <v-toolbar-title>
              <span class="white--text">Medical Emergency Platform Login</span>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                  v-if="mode === 'register'"
                  prepend-icon="mdi-account"
                  name="name"
                  label="Name"
                  v-model="login.name"
                  validate-on-blur
                  required
              >
              </v-text-field>
              <v-text-field
                  v-if="mode === 'register'"
                  prepend-icon="mdi-account"
                  name="cnp"
                  label="Cnp"
                  v-model="login.cnp"
                  validate-on-blur
                  required
              >
              </v-text-field>
              <v-text-field
                  v-if="mode === 'register'"
                  prepend-icon="mdi-email"
                  name="email"
                  label="Email"
                  v-model="login.email"
                  validate-on-blur
                  type="email"
                  required
              >
              </v-text-field>
              <v-text-field
                  prepend-icon="mdi-account"
                  name="username"
                  label="Username"
                  v-model="login.username"
                  validate-on-blur
                  required
              ></v-text-field>
              <v-text-field
                  prepend-icon="mdi-lock"
                  name="password"
                  label="Password"
                  type="password"
                  v-model="login.password"
                  validate-on-blur
                  required
              ></v-text-field>
              <v-card-actions>
                <v-btn
                    class="mr-4"
                    :color="inLoginMode ? 'primary' : 'secondary'"
                    @click=" inLoginMode ? attemptLogin() : attemptRegister()"
                >
                  {{ inLoginMode ? 'Login' : 'Register' }}
                </v-btn>

                <v-btn
                    text
                    small
                    @click="toggleMode"
                >
                  {{ inLoginMode ? 'Create an account' : 'I already have an account' }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import router from "../router";

export default {
  name: "LoginPage",

  data: () => ({
    mode: "login",
    login: {

      name:"",
      cnp:"",
      email: "",
      username: "",
      password: "",
    },
  }),

  methods: {
    attemptLogin() {
      this.$store.dispatch("auth/login", this.login).then(() => {
        if (this.$store.state.auth.status.loggedIn) {
          if (this.$store.getters["auth/isAdmin"]) {
            router.push("/users");
          } else {
            router.push("/relatives");
          }
        } else {
          alert("Invalid credentials!");
        }
      });
    },

    async attemptRegister() {
      await this.$store.dispatch("auth/register", this.login);
      router.push("/relatives");
    },

    toggleMode() {
      this.mode = this.mode === "login" ? "register" : "login";
    },

    logout() {
      this.$store.dispatch("auth/logout");
    },
  },

  computed: {
    isLoggedIn: function () {
      return this.$store.state.auth.status.loggedIn;
    },

    inLoginMode: function () {
      return this.mode === "login";
    },
  },
};
</script>

<style>
.login-card {
  background-color: #f2f2f2;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
}

.login-card h4 {
  margin: 0 0 20px;
  font-size: 32px;
  font-weight: bold;
  color: #4caf50;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form input {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.login-form input:focus {
  outline: none;
  box-shadow: 0px 0px 10px rgba(76, 175, 80, 0.8);
}

.login-form button {
  margin: 20px 0 10px;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.login-form button:hover {
  background-color: #388e3c;
}

.login-form p {
  margin-top: 20px;
  font-size: 18px;
  color: #4caf50;
  text-align: center;
}

.login-form p a {
  color: #4caf50;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.login-form p a:hover {
  color: #388e3c;
}
</style>

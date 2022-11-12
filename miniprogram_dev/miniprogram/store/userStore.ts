import { defineStore } from "../libs/index";

export const userStore = defineStore({
  state: {
    user: {
      age: 0,
      firstname: "greet",
      lastname: "bar",
    },
  },
  actions: {
    changeName(state) {
      state.user.firstname = 'foo';
    },
  },
  computed: {
    fullname(state) {
      return state.user.firstname + state.user.lastname;
    },
  },
});

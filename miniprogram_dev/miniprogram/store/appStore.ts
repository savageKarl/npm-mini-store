import { defineStore } from "../libs/index";

export const useAppStore = defineStore({
  state: {
    count: 0,
  },
  actions: {
    increment() {
      // this 指向 store，可以直接访问 this.count
      this.count += 1;
    },
  },
  computed: {
    dbCount(store) {
      // this 指向 store，可以直接访问 this.count
      return store.count * 2;
    },
  },
});

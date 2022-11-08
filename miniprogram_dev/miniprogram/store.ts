import {defineStore} from './libs/index'

export const useAppStore = defineStore({
  state: {
    count: 0,
    user: {
      age:0,
    }
  },
  actions: {
    increment() {
      console.debug(this);
    }
  },
})
import {defineStore} from './libs/index'

export const useAppStore = defineStore({
  state: {
    count: 0,
  },
  actions: {
    increment() {
      console.debug(this);
    }
  },
})
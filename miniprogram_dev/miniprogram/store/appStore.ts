import {defineStore} from '../libs/index'

export const useAppStore = defineStore({
  state: {
    count: 0,
  },
  actions: {
    increment() {
      this.count += 1;
    }
  },
  computed: {
    dbCount(state) {
      return state.count * 2;
    }
  }
})
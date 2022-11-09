import {defineStore} from './libs/index'

export const useAppStore = defineStore({
  state: {
    count: 0,
    user: {
      age:0,
    },
    firstname: 'fuck',
    lastname: 'shit',
  },
  actions: {
    increment() {
      this.count += 1;
    }
  },
  computed: {
    fullname(state) {
      return state.firstname + state.lastname;
    }
  }
})
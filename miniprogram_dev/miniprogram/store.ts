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
      console.debug(this);
    }
  },
  computed: {
    fullname(state) {
      // console.debug(this,state)
      return state.firstname + state.lastname;
    }
  }
})
import { useAppStore } from "../../store";

Component({
  /**
   * 组件的属性列表
   */
  stores: [
    // {
    //   storeKey: 'appStore',
    //   useStoreRef: useAppStore,
    // },
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ['count'],
      watch: {

      },
    },
    {
      storeKey: "indexStore",
      useStoreRef: useAppStore,
    },
  ],
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    attached() {
      // console.debug(this);
    }}
})

const a = {name: 'a'}


const b = new Proxy(a, {})


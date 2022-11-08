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
      mapState: ["navBarHeight", "shopList", "shopIndex", "openid"],
      watch: {
        shopIndex(oldValue: any, value: any) {},
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
      console.debug(this);
    }}
})

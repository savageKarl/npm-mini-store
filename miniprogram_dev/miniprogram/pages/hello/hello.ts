import { useAppStore } from "../../store/appStore";

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
      mapState: ["count"],
      mapComputed: ["dbCount"],
      watch: {
        count(oldV, vlaue) {
          console.debug("fuck", oldV, vlaue);
        },
      },
    },
    // {
    //   storeKey: "indexStore",
    //   useStoreRef: useAppStore,
    // },
  ],
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
  lifetimes: {
    attached() {
      console.debug(this);
    },
  },
});

const a = { name: "a" };

const b = new Proxy(a, {});

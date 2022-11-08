import { foo, bar, test } from "../../libs/index";

import { useAppStore } from "../../store";

Page({
  stores: [
    // {
    //   storeKey: 'appStore',
    //   useStoreRef: useAppStore,
    // },
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ["count"],
      watch: {
        count(oldValue: any, value: any) {},
      },
    },
    {
      storeKey: "indexStore",
      useStoreRef: useAppStore,
    },
  ],
  data: {},
  onLoad() {
    console.debug(this, '执行')
    // console.debug(this.route);
  },
});

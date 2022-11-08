import { foo, bar, test } from "../../libs/index";

import { useAppStore } from "../../store";

Page({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ["count", "user"],
      watch: {
        user(oldValue: any, value: any) {
          console.debug('count', oldValue, value)
        },
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
  onAdd() {
    this.appStore.patch((store:any) => {
      store.user.age+=1
      // console.debug(store)
      console.debug(this)
    })
  }
});

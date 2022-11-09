
import { useAppStore } from "../../store";

Page({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ["count", "user"],
      mapComputed: ['fullname'],
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
    // console.debug(this, '执行')
    // console.debug(this.route);
  },
  onAdd() {
    this.appStore.patch((store:any) => {
      store.user.age+=1
      store.count+=1
      store.firstname = 'foo';
      // console.debug(store)
      // console.debug(this.appStore)
    })
  }
});

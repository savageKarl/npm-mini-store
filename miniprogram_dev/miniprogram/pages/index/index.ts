import { useAppStore } from "../../store";

Page({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ["count", "user"],
      mapComputed: ["fullname"],
      watch: {
        user(oldValue: any, value: any) {
          console.debug("user", oldValue, value);
        },
        count(oldValue: any, value: any) {
          console.debug("count", oldValue, value);
        },
      },
    },
    // {
    //   storeKey: "indexStore",
    //   useStoreRef: useAppStore,
    // },
  ],
  data: {
    show: false,
  },
  onLoad() {
    // console.debug(this, '执行')
    // console.debug(this.route);
  },
  onChangeToggle() {
    this.setData({ show: !this.data.show });
  },
  onAdd() {
    // this.appStore.increment();
    // return;
    this.appStore.patch((store: any) => {
      for (let i = 1; i < 10; i++) {
        console.info('i', i)
        store.user.age += 1;
        console.info(store.user.age)
      }
      // store.count+=1
    });
  },
});

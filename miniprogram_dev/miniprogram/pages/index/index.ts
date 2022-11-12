import { useAppStore } from "../../store/appStore";
import { userStore } from "../../store/userStore";

Page({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ["count"],
      watch: {
        count(oldValue: any, value: any) {
          console.debug("count", oldValue, value);
        },
      },
    },
    {
      storeKey: "userStore",
      useStoreRef: userStore,
      mapState: ["user"],
      mapComputed: ["fullname"],
      watch: {
        user(oldValue: any, value: any) {
          // console.debug("user", oldValue, value);
        },
      },
    },
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
      // store.user.age += 2;
      store.user.firstname='foo'
      // store.count+=1
      console.debug(store)
    });
  },
});

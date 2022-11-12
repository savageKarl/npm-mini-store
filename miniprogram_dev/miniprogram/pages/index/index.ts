import { useAppStore } from "../../store/appStore";
import { userStore } from "../../store/userStore";

Page({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
      mapState: ["count"],
      mapActions: ["increment"],
      watch: {
        count(oldValue: any, value: any) {
          console.debug("count", oldValue, value, this);
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
          console.debug("user", oldValue, value);
        },
      },
    },
  ],
  data: {
    show: false,
  },
  onChangeToggle() {
    this.setData({ show: !this.data.show });
  },
  onLoad() {
    // console.debug('onload')
  },
  onAdd() {
    this.appStore.increment();
  },
});

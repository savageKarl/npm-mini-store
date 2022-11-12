import { useAppStore } from "../../store/appStore";
import { userStore } from "../../store/userStore";

Page({
  stores: [
    {
      // 引入 store，这里要注意，传入 useAppStore 即可
      useStoreRef: useAppStore,
      // 表示当前使用store的名字，可以在 this.appStore 获取 store
      storeKey: "appStore",
      // 表示需要使用的全局状态，会自动挂载在到当前页面或组件实例 data 里面，自带响应式
      mapState: ["count"],
      // 表示需要使用的计算属性，会自动挂载在到当前页面或组件实例 data 里面，自带响应式
      mapComputed: ["dbCount"],
      // 表示想要映射的全局 actions，可以直接在当前页面调用 ，例如：this.increment()
      mapActions: ["increment"],
      // 表示要监听的 state 字段
      watch: {
        count(oldValue: any, value: any) {
          // 可以访问当前页面或组件的实例 this
          console.debug(this);
          console.debug("count", oldValue, value);
        },
      },
    },
    {
      storeKey: "userStore",
      useStoreRef: userStore,
      mapState: ["user"],
      mapActions: ["changeName"],
      mapComputed: ["fullname"],
      watch: {
        user(oldValue: any, value: any) {
          console.debug("user", oldValue, value);
        },
      },
    },
  ],
  onIncrement1() {
    // 不推荐
    this.appStore.count++;
  },
  onIncrement2() {
    this.appStore.patch({
      count: this.appStore.count + 1,
    });
  },
  onIncrement3() {
    this.appStore.patch((store) => {
      store.count++;
    });
  },
  onIncrement4() {
    this.appStore.increment();
  },

  data: {
    show: false,
  },
  onChangeToggle() {
    this.setData({ show: !this.data.show });
  },
});

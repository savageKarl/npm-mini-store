import { proxyApp, proxyPage, proxyComponent } from "./libs/index";

import { useAppStore } from "./store/appStore";
import { userStore } from "./store/userStore";

proxyApp();
proxyPage();
proxyComponent();

App({
  stores: [
    {
      // 引入 store，这里要注意，传入 useAppStore 即可
      useStoreRef: useAppStore,
      // 表示当前使用store的名字，可以在 this.appStore 获取 store
      storeKey: "appStore",
    },
    {
      storeKey: "userStore",
      useStoreRef: userStore,
    },
  ],
  onLaunch() {
    console.debug(this.appStore);
    console.debug(this.userStore);
  }
});

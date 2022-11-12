import { proxyApp, proxyPage, proxyComponent } from "./libs/index";

import { useAppStore } from "./store/appStore";
import { userStore } from "./store/userStore";

proxyApp();
proxyPage({
  onReady() {
    // console.debug('onReady')
  }
});
proxyComponent({
  created() {
    // console.debug('created')
  }
});


App({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
    },
    {
      storeKey: "userStore",
      useStoreRef: userStore,
    },
  ],
  onLaunch() {
  },
});

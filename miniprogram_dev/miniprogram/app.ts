import { proxyApp, proxyPage, proxyComponent } from "./libs/index";

import { useAppStore } from "./store";

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
  ],
  onLaunch() {
    // console.debug(this);
  },
});

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

const stores = [
  {
    storeKey: "appStore",
    useStoreRef: useAppStore,
  },
] as const;

type Store = typeof stores;
type StoreOne = Store[0]["storeKey"];

type SA = {
  StoreOne: any;
};

App({
  stores: [
    {
      storeKey: "appStore",
      useStoreRef: useAppStore,
    },
  ],
  onLaunch() {
    console.debug(this);
  },
});

export const setTip = (function () {
  setTimeout(() => {
    function tip(text: string) {
      console.error(
        `必须在 app.js 文件 调用 ${text}()，参考：https://www.npmjs.com/package/@savage181855/mini-store`
      );
    }
    if (!types.isProxyPage) tip("proxyPage");
    if (!types.isProxyComponent) tip("proxyComponent");
    if (!types.isProxyApp) tip("proxyApp");
  });


  const types = {
    isProxyPage: false,
    isProxyComponent: false,
    isProxyApp: false,
  }

  return function (text: keyof typeof types) {
    types[text] = true;
  };
})();


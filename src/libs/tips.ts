let isProxyPage = false;
let isProxyComponent = false;
let isProxyApp = false;



setTimeout(() => {
  function tip(text: string) {
    console.error(
      `必须在 app.js 文件 调用 ${text}()，参考：https://www.npmjs.com/package/@savage181855/mini-store`
    );
  }
  if (!isProxyPage) tip("proxyPage");
  if (!isProxyComponent) tip("proxyComponent");
  if (!isProxyApp) tip("proxyApp");
});
type InputType = {
  detail: {
    value: string;
  };
};

// 这里如何能够抄一套style ts类型就好了
type Style = Record<string, string>;

// 给 css in js 添加 px 单位
function addPx(n: number | string) {
  return Number(n) + "px";
}

// 将 style对象转为 style 字符串
function strStyle(o: Record<string, string>) {
  return JSON.stringify(o)
    .replace(/{|}|\"/g, "")
    .replace(/,/g, ";");
}

Component({
  options: {
    addGlobalClass: true, // 要加这个，要不然全局样式不生效
  },
  properties: {
    isShowBackArea: {
      type: Boolean,
      value: false,
    },
    customBackFun: {
      type: Function as any,
      value: null,
    },
    navTitle: {
      type: String,
      value: "我是标题",
    },
    navTitleAlign: {
      type: String,
      value: "left",
    },
    navTitleFillBackArea: {
      type: Boolean,
      value: true,
    },
    navTitleOrSearch: {
      type: String,
      value: 'search',
    },
    backText: {
      type: String,
      value: "返回",
    },
    navBarTextColor: {
      type: String,
      value: "#fff",
    },
    navBarBackground: {
      type: String,
      value: "#0081ff",
    },
  },
  data: {
    navHeight: 0,
    statusBarStyle: "",
    navBarStyle: "",
    navAreaStyle: "",
    navAreaMiddleStyle: "",
  },
  methods: {
    onBack() {
      this.data.customBackFun && this.data.customBackFun();
      wx.navigateBack();
    },
    // todo 记得做防抖
    onInput(e: InputType) {
      const value = e.detail.value;
      this.triggerEvent("input", value, { bubbles: true });
    },
  },
  lifetimes: {
    async attached() {
      const systemInfo = wx.getSystemInfoSync();
      const capsuleInfo = wx.getMenuButtonBoundingClientRect();

      const navAreaHeight =
        capsuleInfo.bottom + capsuleInfo.top - systemInfo.statusBarHeight * 2;
      const statusBarHeight = systemInfo.statusBarHeight;
      const navHeight = navAreaHeight + statusBarHeight;

      const navAreaStyle: Style = {
        height: addPx(navAreaHeight),
      };

      const statusBarStyle: Style = {
        height: addPx(statusBarHeight),
      };

      const navBarStyle: Style = {
        background: this.properties.navBarBackground,
        color: this.properties.navBarTextColor,
      };

      const navAreaMiddleStyle = {
        "text-align": this.properties.navTitleAlign,
      };

      if (
        !this.properties.isShowBackArea &&
        this.properties.navTitleFillBackArea
      ) {
        Object.assign(navAreaMiddleStyle, {
          width: "calc(100% - 240rpx)",
          margin: "auto 20rpx",
        });
      }

      this.setData({
        navAreaStyle: strStyle(navAreaStyle),
        statusBarStyle: strStyle(statusBarStyle),
        navBarStyle: strStyle(navBarStyle),
        navHeight,
        navAreaMiddleStyle: strStyle(navAreaMiddleStyle),
      });
    },
  },
});

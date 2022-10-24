Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: 0,
    buttonTopHeight: 0, // 胶囊上面的高度
    searchWidth: 0, // 搜索框宽度
    searchHeight: 0, // 搜索框高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e) {
      const value = e.detail.value;
      // console.debug(value, e)
      this.triggerEvent("input", value, { bubbles: true });
    },
  },
  lifetimes: {
    async ready() {
      const { top, width, height, right } =
        wx.getMenuButtonBoundingClientRect();
      const res = await wx.getSystemInfo();
      const { statusBarHeight } = res;
      const margin = top - statusBarHeight;
      this.setData({
        navHeight: height + statusBarHeight + margin * 2,
        buttonTopHeight: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
        searchHeight: height, // 与胶囊按钮同高
        searchWidth: right - width, // 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
      });
    },
  },
});

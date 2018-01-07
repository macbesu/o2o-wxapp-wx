Page({
  data: {
    type: "",
    label: "",
    val: "",
  },
  onLoad: function (options) {
    const { type, label, val } = options;
    console.log(options);
    this.setData({ type, label, val });
    wx.setNavigationBarTitle({ title: `设置${label}` });
  },
  changeValue: function(val) {
    this.setData({ val: val.detail.value });
  },
});
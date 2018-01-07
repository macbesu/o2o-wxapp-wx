Page({
  data: {
    fullName: "",
    phone: "",
    password: "",
    email: "",
    address: "",
    birthday: "",
  },
  onLoad: function () {
    this.fetchData();
  },
  fetchData: function() {
    const self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    wx.getStorage({
      key: 'appUser',
      success: function(res) {
        console.log(res);
      },
      fail: function(e) {
        wx.hideLoading();
      },
    });
  },
  changeFullName: function(val) {
    this.setData({ fullName: val.detail.value });
  },
  changePhone: function(val) {
    this.setData({ phone: val.detail.value });
  },
  changePassword: function(val) {
    this.setData({ password: val.detail.value });
  },
  changeEmail: function(val) {
    this.setData({ email: val.detail.value });
  },
  changeAddress: function(val) {
    this.setData({ address: val.detail.value });
  },
  changeBirthdayChange: function(val) {
    this.setData({ birthday: val.detail.value });
  },
});
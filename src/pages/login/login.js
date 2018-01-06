const { URL } = require('../../utils/api');

Page({
  data: {
    phone: "",
    password: "",
  },
  onLoad: function() {
    this.auth();
  },
  auth() {
    wx.getStorage({
      key: 'appUser',
      success: function(res) {
        wx.switchTab({
          url: '/pages/home/home'
        });
      },
    });
  },
  changePhone: function(val) {
    this.setData({ phone: val.detail.value });
  },
  changePassword: function(val) {
    this.setData({ password: val.detail.value });
  },
  confirmLogin: function() {
    const self = this;
    console.log(URL + 'users/login');
    wx.request({
      url: URL + 'users/login',
      method: 'POST',
      data: {
        phone: self.data.phone,
        password: self.data.password,
      },
      success: function(res) {
        wx.setStorage({
          key: "appUser",
          data: {
            user_id: res.data._id,
            token: res.data.token,
          },
          success: function() {
            wx.switchTab({
              url: '/pages/home/home'
            });
          },
        });
      },
      fail: function(e) {
        console.error(e);
      },
    });
  },
});
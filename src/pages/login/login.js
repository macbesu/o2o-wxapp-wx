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
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000,
    });
    wx.request({
      url: URL + 'users/login',
      method: 'POST',
      data: {
        phone: self.data.phone,
        password: self.data.password,
      },
      success: function(res) {
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 3000,
          success: function() {
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
          }
        });
        
      },
      fail: function(e) {
        console.error(e);
      },
    });
  },
});
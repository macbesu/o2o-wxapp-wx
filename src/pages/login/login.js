const { URL } = require('../../utils/api');

const app = getApp();

Page({
  data: {
    phone: "",
    password: "",
    showLogin: false,
    showErrorText: false,
  },
  onLoad: function() {
    this.auth();
  },
  auth() {
    const self = this;
    wx.showLoading({
      title: '自动登录中...',
      mask: true,
    });
    wx.getStorage({
      key: 'appUser',
      success: function(res) {
        app.globalData._id = res.data._id;
        app.globalData.phone = res.data.phone;
        app.globalData.address = res.data.address;
        app.globalData.token = res.data.token;
        wx.switchTab({
          url: '/pages/home/home'
        });
        wx.showToast({
          title: '自动登录成功！',
          icon: 'success',
          duration: 2000,
        });
      },
      fail: function(e) {
        wx.hideLoading();
        self.setData({ showLogin: true });
      },
    });
  },
  changePhone: function(val) {
    this.setData({ phone: val.detail.value, showErrorText: false, });
  },
  changePassword: function(val) {
    this.setData({ password: val.detail.value, showErrorText: false, });
  },
  confirmLogin: function() {
    const self = this;
    wx.showLoading({
      title: '登录中...',
      mask: true,
    });
    wx.request({
      url: URL + 'users/login',
      method: 'POST',
      data: {
        phone: self.data.phone,
        password: self.data.password,
      },
      success: function(res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '登录成功！',
            icon: 'success',
            duration: 3000,
            success: function() {
              wx.setStorage({
                key: "appUser",
                data: {
                  _id: res.data._id,
                  phone: res.data.phone,
                  address: res.data.address,
                  token: res.data.token,
                },
                success: function() {
                  app.globalData._id = res.data._id;
                  app.globalData.phone = res.data.phone;
                  app.globalData.address = res.data.address;
                  app.globalData.token = res.data.token;
                  wx.switchTab({
                    url: '/pages/home/home'
                  });
                },
              });
            },
          });
        } else {
          wx.hideLoading();
          self.setData({ 
            showErrorText: true,
          });
        }
      },
      fail: function(e) {
        console.error(e);
        wx.hideLoading();
        self.setData({ 
          showErrorText: true,
        });
      },
    });
  },
});
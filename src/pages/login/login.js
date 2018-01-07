const { URL } = require('../../utils/api');

Page({
  data: {
    phone: "",
    password: "",
    isLogged: false,
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
        wx.switchTab({
          url: '/pages/home/home'
        });
        wx.showToast({
          title: '登录成功！',
          icon: 'success',
          duration: 3000,
        });
      },
      fail: function(e) {
        wx.hideLoading();
        self.setData({ isLogged: true });
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
        console.log(res);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '登录成功！',
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
        } else {
          wx.hideLoading();
          self.setData({ 
            showErrorText: true,
          });
        }
      },
      fail: function(e) {
        wx.hideLoading();
        self.setData({ 
          showErrorText: true,
        });
      },
    });
  },
});
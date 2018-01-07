const { URL } = require('../../../utils/api');

const app = getApp();

Page({
  data: {
    _id: "",
    fullName: "",
    phone: "",
    password: "****************",
    email: "",
    address: "",
    addressShort: "",
    birthday: "",
    show: false,
  },
  onShow: function () {
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
        const { _id, token } = res.data;
        wx.request({
          url: URL + 'users/id=' + _id,
          method: 'GET',
          header: {
            'Authorization': token,
          },
          success: function(res) {
            if (res.statusCode === 200 ){
              self.setData({
                _id: res.data._id,
                fullName: res.data.fullName,
                phone: res.data.phone,
                password: res.data.password,
                email: res.data.email,
                address: res.data.address,
                addressShort: res.data.address.length > 12 ? res.data.address.substr(0, 12) + '...' : res.data.address,
                birthday: res.data.birthday,
                show: true,
              });
            }
            wx.hideLoading();
          },
          fail: function(e) {
            wx.hideLoading();
          },
        });
      },
    })
  },
  logout: function() {
    wx.removeStorage({
      key: 'appUser',
      success: function(res) {
        wx.reLaunch({
          url: '/pages/login/login'
        });
      } 
    });
  },
});
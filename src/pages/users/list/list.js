const { SERVER, URL } = require('../../../utils/api');

const app = getApp();

Page({
  data: {
    SERVER: SERVER,
    _id: '',
    avatar: '',
    fullName: '',
    phone: '',
    password: "****************",
    email: '',
    address: '',
    addressShort: '',
    birthday: '',
    show: false,
  },
  onShow: function () {
    this.fetchData();
  },
  fetchData: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const self = this;
    const { _id, token } = app.globalData;
    console.log(_id, token);
    wx.request({
      url: URL + 'users/id=' + _id,
      method: 'GET',
      header: {
        'Authorization': token,
      },
      success: function(res) {
        if (res.statusCode === 200 ){
          wx.hideLoading();
          self.setData({
            _id: res.data._id,
            avatar: res.data.avatar,
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
      },
      fail: function(e) {
        wx.hideLoading();
      },
    });
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
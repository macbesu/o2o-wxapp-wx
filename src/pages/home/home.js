const { SERVER, URL } = require('../../utils/api');

const app = getApp();
const { _id, token } = app.globalData;

Page({
  data: {
    SERVER: SERVER,
    inputShowed: false,
    inputVal: "",
    foods: [],
    categories: [],
    categories_index: 0,
    currentCategory: "全部",
  },
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    });
    this.getCategories();
    this.getFoods();
  },
  getCategories: function() {
    const self = this;
    const { _id, token } = app.globalData;
    wx.request({
      url: URL + 'categories',
      method: 'GET',
      header: {
        'Authorization': token,
      },
      success: function(res) {
        if (res.statusCode === 200 ){
          self.setData({
            categories: res.data,
          });
        }
      },
      fail: function(e) {
      },
    });
  },
  getFoods: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const self = this;
    const { _id, token } = app.globalData;
    wx.request({
      url: URL + 'foods',
      method: 'GET',
      header: {
        'Authorization': token,
      },
      success: function(res) {
        if (res.statusCode === 200 ){
          wx.hideLoading();
          self.setData({
            foods: res.data,
          });
        }
      },
      fail: function(e) {
        wx.hideLoading();
      },
    });
  },
  showInput: function () {
    this.setData({
        inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  bindPickerChange: function(e) {
    const self = this;
    this.setData({
      categories_index: e.detail.value,
      currentCategory: self.data.categories[e.detail.value].categoryName,
    });
  },
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '13286488084',
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'text') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
});

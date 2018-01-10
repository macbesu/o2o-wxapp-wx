const { SERVER, URL } = require('../../utils/api');

const app = getApp();
const { _id, token } = app.globalData;

Page({
  data: {
    SERVER: SERVER,
    inputShowed: false,
    categoryFilter: '*',
    foodFilter: '*',
    foods: [],
    categories: [],
    orders: {},
    categories_index: 0,
    currentCategory: '(全部)',
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
          const defaultCategory = [{
            _id: '*',
            categoryName: '(全部)',
          }];
          const arr = defaultCategory.concat(res.data);
          self.setData({
            categories: arr,
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
      url: `${URL}foods/category=${self.data.categoryFilter?self.data.categoryFilter:'*'}&foodName=${self.data.foodFilter?self.data.foodFilter:'*'}`,
      method: 'GET',
      header: {
        'Authorization': token,
      },
      success: function(res) {
        if (res.statusCode === 200 ){
          wx.hideLoading();
          const data = res.data;
          data.forEach((item, index) => {
            if (self.data.orders.hasOwnProperty(item._id)) {
              item.amount = self.data.orders[item._id];
            }
            if (item.coupon) {
              if (item.coupon.couponType === 0) {
                item.newPrice = (item.price * item.coupon.value).toFixed(1);
              } else if (item.coupon.couponType === 1 && item.coupon.limit < item.price) {
                item.newPrice = item.price - item.coupon.value;
              }
              
            }
          });
          self.setData({ foods: data });
        }
      },
      fail: function(e) {
        wx.hideLoading();
      },
    });
  },
  buyAddOne: function(e) {
    const { id, index } = e.target.dataset;
    const orders = Object.assign({}, this.data.orders);
    const foods = this.data.foods;
    if (orders.hasOwnProperty(id)) {
      if (orders[id] < 20) {
        orders[id] += 1;
      }
    } else {
      orders[id] = 1;
    }
    foods.forEach((item, index) => {
      if (orders.hasOwnProperty(item._id)) {
        item.amount = orders[item._id];
      }
    });
    this.setData({ orders: orders, foods: foods });
  },
  buyRemoveOne: function(e) {
    const { id, index } = e.target.dataset;
    const orders = Object.assign({}, this.data.orders);
    const foods = this.data.foods;
    if (orders[id] > 0) {
      orders[id] -= 1;
    }
    foods.forEach((item, index) => {
      if (orders.hasOwnProperty(item._id)) {
        item.amount = orders[item._id];
      }
    });
    this.setData({ orders: orders, foods: foods });
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      foodFilter: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      foodFilter: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      foodFilter: e.detail.value
    }, () => {
      this.getFoods();
    });
  },
  bindPickerChange: function(e) {
    const self = this;
    this.setData({
      categories_index: e.detail.value,
      currentCategory: self.data.categories[e.detail.value].categoryName,
      categoryFilter: self.data.categories[e.detail.value]._id,
    });
    this.getFoods();
  },
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '13286488084',
    });
  },
});

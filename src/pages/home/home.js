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
    ordersCount: 0,
    categoriesIndex: 0,
    totalBeforePrice: 0,
    totalFinalPrice: 0,
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
              item.amount = self.data.orders[item._id].count;
            }
            if (item.coupon) {
              if (item.coupon.couponType === 0) {
                item.newPrice = (item.price * item.coupon.value).toFixed(1);
              } else if (item.coupon.couponType === 1 && item.coupon.limit < item.price) {
                item.newPrice = item.price - item.coupon.value;
              } else {
                item.newPrice = item.price;
              }
            } else {
              item.newPrice = item.price;
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
    const { id, index, price, newprice } = e.target.dataset;
    const orders = Object.assign({}, this.data.orders);
    const foods = this.data.foods;
    if (orders.hasOwnProperty(id)) {
      if (orders[id].count < 20) {
        orders[id].count += 1;
      }
    } else {
      orders[id] = {};
      orders[id].count = 1;
      orders[id].price = parseFloat(price);
      orders[id].newprice = parseFloat(newprice);
    }
    foods.forEach((item, index) => {
      if (orders.hasOwnProperty(item._id)) {
        item.amount = orders[item._id].count;
      }
    });
    this.setData({ orders, foods }, () => {
      this.calculateTotal();
    });
  },
  buyRemoveOne: function(e) {
    const { id, index, price, newprice } = e.target.dataset;
    const orders = Object.assign({}, this.data.orders);
    const foods = this.data.foods;
    if (orders[id].count > 0) {
      orders[id].count -= 1;
    }
    foods.forEach((item, index) => {
      if (orders.hasOwnProperty(item._id)) {
        item.amount = orders[item._id].count;
      }
    });
    if (orders[id].count === 0) {
      delete orders[id];
    }
    this.setData({ orders, foods }, () => {
      this.calculateTotal();
    });
  },
  calculateTotal: function() {
    let { orders } = this.data;
    let [ ordersCount, totalBeforePrice, totalFinalPrice ] = [ 0, 0, 0 ];
    for (let key in orders) {
      ordersCount += 1;
      totalBeforePrice += orders[key].count * orders[key].price;
      totalFinalPrice += orders[key].count * orders[key].newprice;
    }
    this.setData({
      ordersCount,
      totalBeforePrice: this.handleFloatFixed(totalBeforePrice),
      totalFinalPrice: this.handleFloatFixed(totalFinalPrice),
    });
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
      categoriesIndex: e.detail.value,
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
  handleFloatFixed: function(number) {
    const str = `${number}`
    const idx = str.indexOf('.');
    if (idx !== -1) {
      if (str.length - idx > 2) {
        return parseFloat(number.toFixed(2));
      } else {
        return parseFloat(number.toFixed(1));
      }
    } else {
      return number;
    }
  },
});

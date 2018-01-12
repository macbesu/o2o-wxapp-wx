const { SERVER, URL } = require('../../utils/api');
const { formatTime } = require('../../utils/util');

const app = getApp();

Page({
  data: {
    orders: [],
    statusTextList: ['下单', '配送', '完成', '取消'],
    statusBtnList: ['取消订单', '配送中', '已完成', '已取消']
  },
  onShow: function () {
    this.getOrders();
  },
  getOrders: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    const self = this;
    const { _id, token } = app.globalData;
    wx.request({
      url: URL + 'orders/user=' + _id,
      method: 'GET',
      header: {
        'Authorization': token,
      },
      success: function(res) {
        if (res.statusCode === 200 ){
          const orders = res.data;
          const arr = [];
          orders.forEach((item, index) => {
            item.statusText = self.data.statusTextList[item.status];
            item.statusBtn = self.data.statusBtnList[item.status];
            item.time = formatTime(new Date(item.time));
            arr.push(item);
          });
          self.setData({
            orders: arr,
          }, () => {
            wx.hideLoading();
          });
        }
      },
      fail: function(e) {
        wx.hideLoading();
      },
    });
  },
})
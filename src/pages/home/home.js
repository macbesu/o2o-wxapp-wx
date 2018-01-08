const { SERVER, URL } = require('../../utils/api');

const app = getApp();

Page({
  data: {
    inputShowed: false,
    inputVal: ""
  },
  onLoad: function() {

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
});

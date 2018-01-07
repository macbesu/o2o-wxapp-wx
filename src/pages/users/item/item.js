const { URL } = require('../../../utils/api');

const app = getApp();

Page({
  data: {
    _id: "",
    type: "",
    label: "",
    key: "",
    val: "",
    token: "",
    showErrorText: false,
  },
  onLoad: function (options) {
    const { _id, type, label, key, val } = options;
    this.setData({ _id, type, label, key, val });
    const self = this;
    wx.setNavigationBarTitle({ 
      title: `设置${label}` 
    });
    wx.getStorage({
      key: 'appUser',
      success: function(res) {
        self.setData({
          token: res.data.token,
        });
      },
    })
  },
  changeValue: function(val) {
    this.setData({ val: val.detail.value });
  },
  confirm: function() {
    const obj = {};
    const self = this;
    obj[self.data.key] = self.data.val;
    wx.request({
      url: URL + 'users/' + self.data._id,
      method: 'PATCH',
      header: {
        'Authorization': self.data.token,
      },
      data: obj,
      success: function(res) {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 2000,
          success: function() {
            wx.switchTab({
              url: '/pages/users/list/list'
            });
          }
        });
      },
      fail: function(e) {
        self.setData({ 
          showErrorText: true,
        });
      },
    });
  },
});
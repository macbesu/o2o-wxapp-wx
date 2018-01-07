const { URL } = require('../../../utils/api');

const app = getApp();

Page({
  data: {
    _id: "",
    type: "",
    label: "",
    key: "",
    val: "",
    valAgain: "",
    token: "",
    errorText: "修改失败！",
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
    });
  },
  changeValue: function(val) {
    this.setData({ 
      val: val.detail.value,
      errorText: "修改失败！",
      showErrorText: false,
    });
  },
  changeValueAgain: function(val) {
    this.setData({ 
      valAgain: val.detail.value,
      errorText: "修改失败！",
      showErrorText: false,
    });
  },
  confirm: function() {
    if (this.data.type === 'password') {
      if (this.data.valAgain === this.data.val) {
        this.updateData();
      } else {
        this.setData({
          errorText: '两次输入的密码不一致！',
          showErrorText: true,
        });
      }
    }
    if (this.data.type !== 'password') {
      this.updateData();
    }
  },
  updateData: function() {
    const obj = {};
    const self = this;
    obj[self.data.key] = self.data.val;
    wx.request({
      url: URL + 'users/id=' + self.data._id,
      method: 'POST',
      header: {
        'Authorization': self.data.token,
      },
      data: obj,
      success: function(res) {
        if (res.statusCode === 200) {
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
        } else {
          self.setData({ 
            showErrorText: true,
          });
        }
      },
      fail: function(e) {
        console.error(e);
        self.setData({ 
          showErrorText: true,
        });
      },
    });
  },
});
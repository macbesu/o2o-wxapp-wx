const { SERVER, URL } = require('../../../utils/api');

const app = getApp();

Page({
  data: {
    SERVER: SERVER,
    _id: "",
    type: "",
    label: "",
    key: "",
    val: "",
    valAgain: "",
    errorText: "修改失败！",
    showErrorText: false,
    imageUrls: [],
  },
  onLoad: function (options) {
    const { _id, type, label, key, val } = options;
    this.setData({ _id, type, label, key, val });
    const self = this;
    wx.setNavigationBarTitle({ 
      title: `设置${label}` 
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
    const token = app.globalData.token;
    obj[self.data.key] = self.data.val;
    wx.request({
      url: URL + 'users/id=' + self.data._id,
      method: 'POST',
      header: {
        'Authorization': token,
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
  chooseImage: function (e) {
    const self = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: function (res) {
        wx.uploadFile({
          url: URL + 'files/uploadAvatar',
          filePath: res.tempFilePaths[0],
          name: 'avatar',
          success: function(res){
            const url = JSON.parse(res.data).imageUrl;
            const arr = new Array();
            arr.push(SERVER + url);
            self.setData({
              val: url,
              imageUrls: arr,
              errorText: '',
              showErrorText: false,
            });
          },
        });
      }
    })
  },
  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id,
        urls: this.data.imageUrls,
    });
  },
});
const { SERVER, URL } = require('../../utils/api');

const app = getApp();

Page({
  data: {
    SERVER: SERVER,
    imageUrls: [],
    avatar: "",
    phone: "",
    password: "",
    passwordAgain: "",
    fullName: "",
    email: "",
    address: "",
    birthday: "",
    errorText: "",
    showErrorText: false,
  },
  onLoad: function() {
   
  },
  changePhone: function(val) {
    this.setData({ phone: val.detail.value });
  },
  changePassword: function(val) {
    this.setData({ password: val.detail.value });
  },
  changePasswordAgain: function(val) {
    this.setData({ passwordAgain: val.detail.value });
  },
  changeFullName: function(val) {
    this.setData({ fullName: val.detail.value });
  },
  changeEmail: function(val) {
    this.setData({ email: val.detail.value });
  },
  changeAddress: function(val) {
    this.setData({ address: val.detail.value });
  },
  changeBirthday: function(val) {
    this.setData({ birthday: val.detail.value });
  },
  confirmRegister: function() {
    if (!this.data.email) {
      this.setData({
        errorText: '请输入邮箱',
        showErrorText: true,
      });
    }
    if (!this.data.fullName) {
      this.setData({
        errorText: '请输入姓名',
        showErrorText: true,
      });
    }
    if (this.data.password !== this.data.passwordAgain) {
      this.setData({
        errorText: '两次输入的密码不一致',
        showErrorText: true,
      });
    }
    if (!this.data.password) {
      this.setData({
        errorText: '请输入密码',
        showErrorText: true,
      });
    }
    if (!this.data.phone) {
      this.setData({
        errorText: '请输入手机',
        showErrorText: true,
      });
    }
    if (!this.data.avatar) {
      this.setData({
        errorText: '请上传头像',
        showErrorText: true,
      });
    }
    if (this.data.avatar && this.data.password === this.data.passwordAgain && this.data.password 
    && this.data.phone && this.data.fullName && this.data.email) {
      this.handleRegister();
    }
  },
  handleRegister: function() {
    const self = this;
    wx.request({
      url: URL + 'users/signup',
      method: 'POST',
      data: {
        avatar: self.data.avatar,
        phone: self.data.phone,
        password: self.data.password,
        fullName: self.data.fullName,
        email: self.data.email,
        address: self.data.address,
        birthday: self.data.birthday,
      },
      success: function(res) {
        if (res.statusCode === 201) {
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000,
            success: function() {
              wx.reLaunch({
                url: '/pages/login/login',
              });
            }
          });
        } else {
          self.setData({ 
            errorText: res.data.errmsg,
            showErrorText: true,
          });
        }
      },
      fail: function(e) {
        console.error(e);
        self.setData({ 
          errorText: '注册失败！！',
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
              avatar: url,
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
})

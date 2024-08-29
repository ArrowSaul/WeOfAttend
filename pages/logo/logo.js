const app = getApp();
Page({
  data: {
    isLoggedIn: false,
    url: '/images/maker.png',
    userInfo: {
      code: '',
      avatar: '',
      nickName: '',
      id: 2,
      token: '',
      openid: '',
      name: ''
    }
  },
  // 加载方法
  onLoad: function () {
    this.checkLoginStatus();
  },
  // 检查登录状态
  checkLoginStatus: function () {
    // 假设从本地存储中获取登录状态
    const token = wx.getStorageSync('userInfo.token');
    if (token) {
      // 如果有token，认为用户已登录
      this.setData({
        isLoggedIn: true
      });
      // 跳转到主页
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else {
      // 没有token，提示用户登录
      this.showLoginModal();
    }
  },
  // 显示登录弹窗
  showLoginModal: function () {
    wx.showModal({
      title: '登录提示',
      content: '您需要登录才能继续使用',
      success: (res) => {
        if (res.confirm) {
          this.login();
        } else {
          wx.navigateBack();
        }
      }
    });
  },
  // 获取微信授权码
  login: function () {
    wx.login({
      success: (res) => {
        app.globalData.userInfo.code = res.code;
        this.setData({
            "userInfo.code": res.code
          }),
          console.log(res.code)
      },
    })
    wx.getUserProfile({
      desc: '用于完善头像昵称',
      success: (res) => {
        app.globalData.userInfo.avatar =  res.userInfo.avatar;
        app.globalData.userInfo.nickName =  res.userInfo.nickName;
        this.setData({
            "userInfo.avatar": res.userInfo.avatarUrl,
            "userInfo.nickName": res.userInfo.nickName
          }),
          console.log(res.userInfo)
        this.requestLogin(res.userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        // 处理失败情况，例如提示用户或尝试其他登录方式
      }
    });
  },
  // 登录方法提交code,nickName,avatar,获取id,openid,token
  requestLogin: function (e) {
    const userInfo = {
      code: this.data.userInfo.code,
      avatar: this.data.userInfo.avatar,
      nickName: this.data.userInfo.nickName
    }
    wx.request({
      url: 'http://127.0.0.1:8080/user/user/login',
      method: 'POST',
      data: userInfo,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          const responseData = res.data.data;
          app.globalData.userInfo.id = responseData.id;
          app.globalData.userInfo.token = responseData.token;
          app.globalData.userInfo.openid = responseData.openid;
          this.setData({
            "userInfo.id": responseData.id,
            "userInfo.token": responseData.token,
            "userInfo.openid": responseData.openid,
            isLoggedIn: true
          });
          this.getByName();
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error) => {
        console.error('更新用户信息失败:', error);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  toRegister: function(){
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  //根据姓名是否填写查询用户是否注册
  getByName: function () {
    this.setData({
      "userInfo.id": app.globalData.userInfo.id
    });
    const id = this.data.userInfo.id;
    wx.request({
      url: `http://127.0.0.1:8080/user/user/register/${id}`, 
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data.data;
          console.log(responseData);
          if (responseData === null || responseData === '') {
            // 如果 responseData 为 null 或空字符串，跳转到注册页面
           this.toRegister();
          } else {
            // 如果 responseData 不为 null，跳转到主页
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        } else {
          // 处理服务器响应码不是200的情况
          wx.showToast({
            title: '服务器响应错误',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error) => {
        // 网络请求失败的处理
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
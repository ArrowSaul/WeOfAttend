Page({
  data: {
    isLoggedIn: false,
    url: '/images/maker.png',
    userInfo: {
      avatar: '',
      nickName: '',
      code: ''
    }
  },

  onLoad: function () {
    this.checkLoginStatus();
  },

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

  login: function () {
    wx.login({
      success: (res) => {
        wx.setStorageSync('userInfo.code', res.code);
        this.setData({
            "userInfo.code": res.code
          }),
          console.log(res.code)
      },
    })
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        wx.setStorageSync('userInfo.avatar', res.userInfo.avatarUrl);
        wx.setStorageSync('userInfo.nickName', res.userInfo.nickName);
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
  fetchUserData: function () {
    const openid = this.data.userInfo.openid;
    wx.request({
      url: `http://127.0.0.1:8080/user/user/${openid}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        } else {
          wx.switchTab({
            url: '/pages/register/register'
          });
        }
      },
      fail: () => {
        // 处理网络请求失败的情况  
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },
  requestLogin: function (userInfo) {
    const token = ''; // 实际情况应该是服务器返回的token
    wx.setStorageSync('userInfo.token', token);
    this.setData({
      isLoggedIn: true
    });
    // 发送更新请求  
    wx.request({
      url: 'http://127.0.0.1:8080/user/user/login',
      method: 'POST',
      data: userInfo,
      success: (res) => {
        if (res.statusCode === 200) {
          // 更新成功，显示成功提示  
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          // 更新全局变量中的用户信息  
          const app = getApp();
          app.globalData.userInfo = userInfo; // 假设 userInfo 是你更新后的用户信息
        } else {
          // 更新失败，显示失败提示  
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error) => {
        // 请求失败，显示网络错误提示并记录错误  
        console.error('更新用户信息失败:', error);
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 2000
        });
      }
    });
    
    // 登录成功后跳转到主页
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
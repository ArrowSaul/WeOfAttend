Page({
  data: {
    userInfo: {
      id: null,
      nickName: '',
      name: '',
      sex: '',
      age: '',
      phone: '',
      studentId: '',
      idNumber: '',
      college: '',
      major: '',
      avatar: ''
    }
  },
  getUserInfo: function () {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  onLoad: function (options) {
    this.getUserInfo();
    this.fetchUserData();
  },
  fetchUserData: function () {
    const id = this.data.userInfo.id;
    wx.request({
      url: `http://127.0.0.1:8080/user/user/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data.data;
          this.setData({
            "userInfo.nickName": responseData.nickName,
            "userInfo.name": responseData.name,
            "userInfo.sex": responseData.sex,
            "userInfo.age": responseData.age,
            "userInfo.phone": responseData.phone,
            "userInfo.studentId": responseData.studentId,
            "userInfo.idNumber": responseData.idNumber,
            "userInfo.college": responseData.college,
            "userInfo.major": responseData.major,
            "userInfo.avatar": responseData.avatar
          });
        } else {
          // 处理错误情况  
          wx.showToast({
            title: '数据加载失败',
            icon: 'none'
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
  formSubmit: function (e) {
    // 从事件对象中提取表单数据  
    const userInfo = e.detail.value;

    // 确保用户ID也被包含在请求中  
    userInfo.id = this.data.userInfo.id;

    // 发送更新请求  
    wx.request({
      url: 'http://127.0.0.1:8080/user/user/update',
      method: 'PUT',
      data: userInfo,
      success: (res) => {
        if (res.statusCode === 200) {
          // 更新成功，显示成功提示  
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          });
          // 更新全局变量中的用户信息  
          const app = getApp();
          app.globalData.userInfo = userInfo; // 假设 userInfo 是你更新后的用户信息
        } else {
          // 更新失败，显示失败提示  
          wx.showToast({
            title: '更新失败',
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
  }
});
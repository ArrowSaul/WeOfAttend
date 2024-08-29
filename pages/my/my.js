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
      avatar: '',
      experience: null,
      level: null,
      experiencePercen:null
    }
  },
  getUserInfo: function () {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo
    });
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
            "userInfo.avatar": responseData.avatar,
            "userInfo.experience": responseData.experience
          });
          this.updateLevel();
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
  onLoad: function () {
    this.getUserInfo();
    this.fetchUserData();
    this.updateLevel();
  },

  editInfo: function () {
    // 编辑信息的逻辑，通常跳转到另一个页面进行编辑  
    wx.navigateTo({
      url: '/pages/editInfo/editInfo'
    });
  },

  updateLevel: function () {
    const experience = this.data.userInfo.experience;
    let level = 1;
    let experiencePerLevel = 100; // 初始每级所需经验值  
    let remainingExperience = experience;
  
    while (remainingExperience >= experiencePerLevel) {
      remainingExperience -= experiencePerLevel;
      level++;
      experiencePerLevel *= 1.2; // 每级所需经验递增
    }
  
    const experiencePercent = (remainingExperience / experiencePerLevel) * 100;
    const roundedExperiencePercent = Math.round(experiencePercent);
  
    this.setData({
      "userInfo.level": level,
      "userInfo.experiencePercent": roundedExperiencePercent, // 存储经验百分比
      "userInfo.experience": experience // 存储当前经验值
    });
  }
});
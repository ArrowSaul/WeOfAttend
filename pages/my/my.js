Page({
  data: {
    id: 1,
    nickName: 'www',
    name: '',
    sex: '',
    age: '',
    phone: '',
    studentId: '',
    idNumber: '',
    college: '',
    major: '',
    avatar: '',
    experience: 0,
    level: 1
  },
  // getUserId: function () {
  //   this.setData({
  //     id: app.globalData.id
  //   });
  // },
  fetchUserData: function () {
    const id = this.data.id;
    wx.request({
      url: `http://127.0.0.1:8080/user/user/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const responseData = res.data.data;
          this.setData({
            nickName: responseData.nickName,
            name: responseData.name,
            sex: responseData.sex,
            age: responseData.age,
            phone: responseData.phone,
            studentId: responseData.studentId,
            idNumber: responseData.idNumber,
            college: responseData.college,
            major: responseData.major,
            avatar: responseData.avatar,
            experience: responseData.experience
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
    this.updateLevel();
    this.fetchUserData();
  },

  editInfo: function () {
    // 编辑信息的逻辑，通常跳转到另一个页面进行编辑  
    wx.navigateTo({
      url: '/pages/editInfo/editInfo'
    });
  },

  updateLevel: function () {
    const experience = this.data.experience;
    let level = 1;
    let experiencePerLevel = 100; // 每级所需经验值  
    while (experience >= experiencePerLevel) {
      experience -= experiencePerLevel;
      level++;
      experiencePerLevel *= 1.2; // 假设每级所需经验递增  
    }
    this.setData({
      level: level,
      experiencePercent: experience / experiencePerLevel * 100
    });
  }
});
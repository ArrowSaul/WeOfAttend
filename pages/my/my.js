Page({
  data: {
    userInfo: {
      nickName: '',
      name: '',
      idNumber: '',
      age: '',
      college: '',
      major: '',
      avatarUrl: ''
    },
    experience: 500, // 假设经验值为500  
    level: 1
  },
  fetchUserData: function () {  
    wx.request({  
      url: 'http://127.0.0.1:8080/', // 替换为实际的后端API地址  
      method: 'GET',
      success: (res) => {  
        if (res.statusCode === 200) {  
          // 假设后端返回的数据结构如下：  
          // {  
          //   "userInfo": {...},  
          //   "experience": 500  
          // }  
          const request = res.data.data;  
          this.setData({  
            userInfo: request.userInfo,  
            experience: request.experience  
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
Page({  
  data: {  
      nickName: '',  
      avatar: ''  
  },  
  
  onLoad: function(options) {  
    // 假设从上个页面传递了用户信息  
    const userInfo = wx.getStorageSync('userInfo') || {};  
    this.setData({  
      userInfo: userInfo  
    });  
  },  
  
  chooseImage: function() {  
    wx.chooseImage({  
      count: 1,  
      sizeType: ['original', 'compressed'],  
      sourceType: ['album', 'camera'],  
      success: (res) => {  
        // 设置图片的路径  
        const tempFilePaths = res.tempFilePaths;  
        this.setData({  
          'userInfo.avatarUrl': tempFilePaths[0]  
        });  
      }  
    });  
  },  
  
  formSubmit: function(e) {  
    const { nickName, avatarUrl } = e.detail.value;  
    const userInfo = { nickName, avatarUrl };  
    // 更新本地存储的用户信息  
    wx.setStorageSync('userInfo', userInfo);  
    // 返回上一页面，并传递用户信息（可选）  
    wx.navigateBack({  
      delta: 1, // 返回上一级页面  
      // success: function(res) {  
      //   // 可选：成功后的操作  
      // }  
    });  
  }  
});
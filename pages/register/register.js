const app = getApp()
const avatar = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    avatar: avatar,
    theme: wx.getSystemInfoSync().theme,
    nickName: '',
    name: '',
    phone: '',
    idNumber: '',
    age: '',
    college: '',
    major: '',
    isAgreed: false,
    isModalVisible: false,
    phoneError: null,
    nickNameError: null,
    nameError: null,
    peopleidError: null,
    ageError: null,
    subject_one_Error: null,
    subject_two_Error: null,
  },
  // 隐私协议模态框
  showPrivacyAgreement: function () {
    this.setData({
      isModalVisible: true,
    });
  },
  // 隐藏隐私协议模态框  
  hidePrivacyAgreement: function () {
    this.setData({
      isModalVisible: false,
    });
  },
  //  表单提交
  formSubmit(e) {
    console.log(e.detail.value.agreement[0])
    const result = e.detail.value.agreement[0] === 'agree';
    console.log(result)
    this.setData({
      nickName: e.detail.value.nickname,
      name: e.detail.value.name,
      phone: e.detail.value.phone,
      age: e.detail.value.age,
      subject: e.detail.value.subject,
      peopleid: e.detail.value.peopleid,
      isAgreed: result
    })
    if (this.data.nickName !== '' && this.data.phone !== '' && this.data.name !== '' && this.data.peopleid !== '' && this.data.age !== '' && this.data.subject_one !== '' && this.data.subject_two !== '' && this.data.avatarUrl !== defaultAvatarUrl) { // 判断输入的信息是否为空 初始值所有都为空 如果直接点提交可以提交通过 所以加入这个判断
      if (this.data.nickNameError === '' && this.data.phoneError === '' && this.data.nameError === '' && this.data.peopleidError === '' && this.data.ageError === '' && this.data.subject_two_Error === '' && this.data.subject_one_Error === '') { // 判断用户输入信息是否有问题
        if (this.data.isAgreed === false) { // 判断是否勾选了隐私协议
          wx.showToast({
            title: '请勾选隐私协议',
            icon: "error",
            duration: 2000
          })
        } else {
          const message = { // 需要向后端传入的信息
            avatar: this.data.avatar,
            nickname: this.data.nickName,
            phone: this.data.phone,
            name: this.data.name,
            idNumber: this.data.idNumber,
            age: this.data.age,
          }
          wx.showToast({
            title: '注册成功',
            icon: "success",
            duration: 2000
          })
          wx.navigateTo({
            url: '/pages/dingwei/dingwei'
          });
        }
      } else {
        wx.showToast({
          title: '请检查信息是否完善',
          icon: 'error',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请检查信息是否完善',
        icon: 'error',
        duration: 2000
      })
    }
  },
  //  进行手机号校验
  validatePhoneNumber(e) {
    const reg = /^(1[3-9])\d{9}$/; //正则表达式检验手机号
    const phone = e.detail.value;
    const result = reg.test(phone)
    if (phone === '') {
      this.setData({
        phoneError: '手机号不能为空'
      });
    } else if (phone !== '' && result === false) {
      this.setData({
        phoneError: '请输入正确的手机号'
      });
    } else if (phone !== '' && result === true) {
      this.setData({
        phoneError: '' // 如果没问题错误信息为空
      });
    }
  },
  // 姓名验证
  validatename(e) {
    const name = e.detail.value
    const length = name.length
    const reg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
    const result = reg.test(e.detail.value)
    if (name === '') {
      this.setData({
        nameError: '姓名不能为空'
      })
    } else if (name !== '') {
      if (result === false || length < 2) {
        this.setData({
          nameError: '请输入合法姓名'
        })
      } else if (result === true && length >= 2) {
        this.setData({
          nameError: '' // 如果没问题错误信息为空
        })
      }
    }
  },
  // 身份证号校验 前两位校验 判断省份是否有效
  checkProv(val) {
    let pattern = /^[1-9][0-9]/;
    let provs = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门"
    };
    if (pattern.test(val)) {
      if (provs[val]) {
        return true;
      }
    }
    return false;
  },
  // 身份证出生日期校验  身份证输入日期是否有效
  checkDate(val) {
    let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if (pattern.test(val)) {
      let year = val.substring(0, 4);
      let month = val.substring(4, 6);
      let date = val.substring(6, 8);
      let date2 = new Date(year + "-" + month + "-" + date);
      if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
        return true;
      }
    }
    return false;
  },
  // 身份证校验码校验 
  checkCode(val) {
    let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let code = val.substring(17);
    if (p.test(val)) {
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += val[i] * factor[i];
      }
      if (parity[sum % 11] == code.toUpperCase()) {
        return true;
      }
    }
    return false;
  },
  // 身份证校验（总）
  Checkpeopleid(val) {
    if (this.checkCode(val)) {
      let date = val.substring(6, 14);
      if (this.checkDate(date)) {
        if (this.checkProv(val.substring(0, 2))) {
          return true;
        }
      }
    }
    return false;
  },
  validatepeopleid(e) {
    const val = e.detail.value
    const result = this.Checkpeopleid(val)
    if (val.length !== 18) {
      this.setData({
        peopleidError: "身份证号码长度错误"
      })
    } else if (val.length === 18) {
      if (result === false) {
        this.setData({
          peopleidError: "身份证号码不合法"
        })
      } else {
        this.setData({
          peopleidError: ""
        })
      }
    }
  },
  //年龄校验 （16-40）之间允许
  validateage(e) {
    var regex = /^(1[6-9]|[2-3][0-9]|40)$/;
    const result = regex.test(e.detail.value)
    if (e.detail.value === '') {
      this.setData({
        ageError: '年龄不能为空'
      })
    } else {
      if (result === false) {
        this.setData({
          ageError: '请输入合法年龄'
        })
      } else {
        this.setData({
          ageError: ''
        })
      }
    }
  },
  onLoad(options) { //监听系统主题变化
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  }
})
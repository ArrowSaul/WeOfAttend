const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    theme: wx.getSystemInfoSync().theme,
    id: '',
    openid: '',
    name: '',
    sex: '',
    age: '',
    phone: '',
    studentId: '',
    idNumber: '',
    college: '',
    major: '',
    nameError: null,
    sexError: null,
    ageError: null,
    studentIdError: null,
    phoneError: null,
    idNumberError: null,
    isAgreed: false,
    isModalVisible: false,
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
      nickName: e.detail.value.nickName,
      name: e.detail.value.name,
      sex: e.detail.value.sex,
      age: e.detail.value.age,
      phone: e.detail.value.phone,
      studentId: e.detail.value.studentId,
      idNumber: e.detail.value.idNumber,
      college: e.detail.value.college,
      major: e.detail.value.major,
      isAgreed: result
    })
    if (this.data.nickName !== '' && this.data.phone !== '' && this.data.name !== '' && this.data.idNumber !== '' && this.data.age !== '' && this.data.college !== '' && this.data.major !== '') {
      if (this.data.nickNameError === '' && this.data.phoneError === '' && this.data.nameError === '' && this.data.idNumberError === '' && this.data.ageError === '' && this.data.collegeError === '' && this.data.majorError === '') { // 判断用户输入信息是否有问题
        if (this.data.isAgreed === false) { // 判断是否勾选了隐私协议
          wx.showToast({
            title: '请勾选隐私协议',
            icon: "error",
            duration: 2000
          })
        } else {
          const message = { // 需要向后端传入的信息
            id: this.data.id,
            openid: this.data.openid,
            name: this.data.name,
            sex: this.data.sex,
            age: this.data.age,
            phone: this.data.phone,
            studentId: this.data.studentId,
            idNumber: this.data.idNumber,
            college: this.data.college,
            major: this.data.major,
          }
          wx.showToast({
            title: '注册成功',
            icon: "success",
            duration: 2000
          })
          wx.navigateTo({
            url: '/pages/index/index'
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
  // 性别校验
  // 年龄校验 （16-40）之间允许
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
  // 进行手机号校验
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
  // 进行学号校验
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
  CheckidNumber(val) {
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
  // 身份证校验（次）
  validateidNumber(e) {
    const val = e.detail.value
    const result = this.CheckidNumber(val)
    if (val.length !== 18) {
      this.setData({
        idNumberError: "身份证号码长度错误"
      })
    } else if (val.length === 18) {
      if (result === false) {
        this.setData({
          idNumberError: "身份证号码不合法"
        })
      } else {
        this.setData({
          idNumberError: ""
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
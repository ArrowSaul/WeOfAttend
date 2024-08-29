var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'SMZBZ-DG5W4-AQZUW-FU5ZC-CTTRT-54F2H'
});
Page({
  data: {
    msg: '',
    nickName: "",
    url: "",
    longitude: 0,
    latitude: 0,
    markers: [],
  },
  onLoad() {
    this.formSubmit()
  },
  formSubmit(e) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        console.log(res);
        var res = res.result;
        var mks = [];
        mks.push({
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: './resources/placeholder.png',
          width: 20,
          height: 20,
          callout: {
            content: res.address,
            color: '#000',
            display: 'ALWAYS'
          }
        });
        _this.setData({
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }
})
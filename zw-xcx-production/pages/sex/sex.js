// pages/sex/sex.js
const app = getApp();
Page({
  data: {
    sex:"",
    activemale:"",
    activefemale:"",
    sid:"",
    userId:""
  },
  onLoad(option) {
    wx.hideShareMenu();
    var dataJson=wx.getStorageSync("cookies");
    this.setData({
      sid: dataJson.sid,
      userId:dataJson.userId
    })
  },
  optionMSex: function (e) {
    this.setData({ 
      activemale: "nan_active",
      activefemale: "",
      sex: "1"
      })   
  },
  optionFSex: function (e) {
    this.setData({
      activemale: "",
      activefemale: "nv_active",
      sex: "2"
    });
  },
  sexButton:function(){
    var _this = this;
    if (this.data.sex == "") {
      wx.showToast({
        title: '请选择您的性别',
        image: "../../images/cross.png",
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.request({
        url: app.data.zwUrl +'/api/zw/userHandApi/updateSex',
        method: 'POST',
        data: {
          userId: _this.data.userId,
          sex: _this.data.sex,
          sid: _this.data.sid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var datas=res.data;
          if(datas.code==0){
            wx.showToast({
              title: "性别更新成功",
              icon: 'success',
              duration: 1000
            });
            setTimeout(function(){
              wx.navigateTo({
                url: '../rightHand/rightHand?imgType=0'
              })
            },500);
            
          }else{
            wx.showToast({
              title: "性别更新失败",
              image: "../../images/cross.png",
              icon: 'success',
              duration: 2000
            });
          }
          
        },
        fail: function (e) {
          console.log(e);
        }
      })
    }
  }
})
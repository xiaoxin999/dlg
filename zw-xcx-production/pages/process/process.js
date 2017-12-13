var app = getApp();
Page({
  data: {
    fixTime: 30,
    personCount: 1,
    userId: "",
    sid: ""
  },
  onLoad(option) {
    var data = wx.getStorageSync("cookies");
    this.setData({
      sid: data.sid,
      userId: data.userId
    })
    wx.hideShareMenu();
    this.todoIsRefuse();//判断有无驳回
  },
  //判断有无驳回
  todoIsRefuse() {
    var _this = this;
    wx.request({
      method: 'POST',
      url: app.data.zwUrl + '/api/zw/userHandApi/checkRejectStatus',
      data: {
        userId: _this.data.userId,
        sid: _this.data.sid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var datas = res.data;
        if (datas.code == "0") {
          if (datas.data == false) {//false没有被驳回
            _this.handleCount_ajax();//查询待处理人数
          } else {//驳回页面
            wx.showToast({
              title: "已被驳回",
              image: "../../images/cross.png",
              duration: 2000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: "../uploadFail/uploadFail?reject=true"
              })
            }, 500);
          }
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "请求失败",
          image: "../../images/cross.png",
          duration: 2000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: "../process/process"
          })
        }, 500);
      }
    });
  },
  //待处理人数
  handleCount_ajax() {
    var _this=this;
    wx.request({
      method: 'POST',
      url: app.data.zwUrl + '/api/zw/userHandApi/handleCount',
      data: {
        userId: _this.data.userId,
        sid: _this.data.sid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var datas = res.data;
        if (datas.code == "0") {
          _this.setData({
            personCount: datas.data
          })
          if(datas.data==0){
            _this.handResult_ajax();
          }
        } else {
          // wx.showToast({
          //   title: "请等待",
          //   image: "../../images/cross.png",
          //   duration: 2000
          // });
          setTimeout(function () {
            wx.redirectTo({
              url: "../process/process"
            })
          }, 1000);
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "请求失败",
          image: "../../images/cross.png",
          duration: 2000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: "../process/process"
          })
        }, 1000);
      }
    });
  },
  //手处理结果
  handResult_ajax() {
    var _this = this;
    wx.request({
      url: app.data.zwUrl + '/api/zw/userHandApi/handResult',
      method: 'POST',
      data: {
        userId: _this.data.userId,
        sid: _this.data.sid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var datas = res.data;
        if (datas.code == "0") {
          for (var i = 0; i < datas.data.length; i++) {
            var dataLists = datas.data[i];
            if (dataLists.status == 1) {//1成功跳转
              wx.showToast({
                title: datas.msg,
                duration: 2000
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../result/result?personalityId=' + dataLists.personalityId +
                  '&ringFingerLength=' + dataLists.ringFingerLength +
                  '&indexFingerLength=' + dataLists.indexFingerLength
                });
              }, 1000);
            }else{
              setTimeout(function () {
                _this.todoIsRefuse();//判断有无驳回
              }, 1000);
            }
          }
        } else {//处理等待页面失败
          // wx.showToast({
          //   title: "请求失败",
          //   image: "../../images/cross.png",
          //   duration: 2000
          // });
          setTimeout(function () {
            wx.redirectTo({
              url: "../process/process"
            })
          }, 1000);
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "请求失败",
          image: "../../images/cross.png",
          duration: 2000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: "../process/process"
          })
        }, 1000);
      }
    })
  }
})
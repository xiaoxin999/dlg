// pages/rightHand/rightHand.js
var app = getApp();
var imageUtil = require('../../utils/util.js');
var uploadImage = require('../../config/uploadAliyun.js');
Page({
  data: {
    imagewidth: 0,//缩放后的宽 
    imageheight: 0,//缩放后的高 
    motto: '',
    userInfo: {},
    avatarUrl: "../../images/right_zheng.png",
    handDesc: "右手掌",
    imgType: "0",
    userId: "",
    sid: ""
  },
  onLoad(option) {
    var data = wx.getStorageSync("cookies"), _this = this;
    this.setData({
      ringFingerLength: 1,
      indexFingerLength: 1,
      sid: data.sid,
      userId: data.userId
    })
    wx.hideShareMenu();
    if (!option.imgType) {
      _this.setData({
        imgType: "0",
        avatarUrl: "../../images/right_zheng.png",
        handDesc: "右手掌"
      })
    } else {
      switch (option.imgType) {
        case "0":
          _this.setData({
            imgType: "0",
            avatarUrl: "../../images/right_zheng.png",
            handDesc: "右手掌"
          })
          break;
        case "1":
          _this.setData({
            imgType: "1",
            avatarUrl: "../../images/right_fan.png",
            handDesc: "右手背"
          })
          break;
        case "2":
          _this.setData({
            imgType: "2",
            avatarUrl: "../../images/left_zheng.png",
            handDesc: "左手掌"
          })
          break;
        case "3":
          _this.setData({
            imgType: "3",
            avatarUrl: "../../images/left_fan.png",
            handDesc: "左手背"
          })
          break;
        case "4":
          _this.setData({
            imgType: "4",
            avatarUrl: "../../images/uploadAvatar.png",
            handDesc: "头部正面照"
          })
          break;
        default:
          _this.setData({
            imgType: "0",
            avatarUrl: "../../images/right_zheng.png",
            handDesc: "右手掌"
          })
          break;
      }
    }
  },
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  takeRightPhoto: function () {
    this.bindViewTap();
  },//事件处理函数
  bindViewTap: function () {
    var that = this
    //  选择图片和拍照
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({ avatarUrl: tempFilePaths[0] });
        uploadImage(
          {
            filePath: tempFilePaths[0],
            success: function (res) {
              that.uploadImg(res);
            },
            fail: function (e) {
              wx.showToast({
                title: "图片上传失败",
                image: "../../images/cross.png",
                icon: 'success',
                duration: 2000
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '../uploadFail/uploadFail?reject=false&imgType=' + that.data.imgType
                })
              }, 500);
            }
          })
      },
      fail: function (res) {
        wx.showToast({
          title: "图片上传失败",
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '../uploadFail/uploadFail?reject=false&imgType=' + that.data.imgType
          })
        }, 500);
      }
    })
  },
  uploadImg(imgUrl) {
    var _this = this;
    wx.request({
      url: app.data.zwUrl + '/api/zw/userHandApi/imgUploadImag',
      method: "POST",
      data: {
        userId: _this.data.userId,
        imgType: _this.data.imgType,
        imageUrl: imgUrl,
        origin: app.data.cidUPimg,
        sid: _this.data.sid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 0) {
          if(_this.data.imgType=="0"){
            wx.showToast({
              title:res.data.msg,
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '../uploadSuccess/uploadSuccess'
              })
            },500);
          }else{
            _this.uplodSubmint_url();
          }
        } else {
          wx.showToast({
            title: "请求失败",
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '../uploadFail/uploadFail?reject=false&imgType=' + _this.data.imgType
            })
          }, 500);
        }
      },
      fail(e) {
        wx.showToast({
          title: "请求失败",
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '../uploadFail/uploadFail?reject=false&imgType=' + _this.data.imgType
          })
        }, 500);
      }
    })
  },
  //其他手和面部-拍照成功跳转
  uplodSubmint_url() {
    var _this = this;
    wx.request({
      url: app.data.zwUrl + '/api/zw/userHandApi/handResult',
      method: "POST",
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
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '../result/result?personalityId=' + dataLists.personalityId +
                '&ringFingerLength=' + dataLists.ringFingerLength +
                '&indexFingerLength=' + dataLists.indexFingerLength
              })
            }, 500);
          }
        } else {
          wx.showToast({
            title: "请求失败",
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '../uploadFail/uploadFail?reject=false&imgType=' + _this.data.imgType
            })
          }, 500);
        }
      },
      fail: function (e) {
        wx.showToast({
          title: "请求失败",
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '../uploadFail/uploadFail?reject=false&imgType=' + _this.data.imgType
          })
        }, 500);
      }
    })
  }
})
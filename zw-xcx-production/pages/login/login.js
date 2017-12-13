const app = getApp();
import { imageUtil, LoctionStorage } from '../../utils/util.js';
Page({
  data: {
    showPage:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    login: { desc: "认识真实的我" },
    focus: false,
    focusImg: false,
    focusCode: false,
    phone: "",
    imgCode: "",
    verifyImg: "",
    imgKey: "",
    verifyCode: "",
    disabled: false,
    loginOperate:false,
    getVerifyTxt: "获取验证码",
    fixTime: 59,
    errorMsg: "",
    unionid: ""
  },
  onLoad: function (options) {
    wx.hideShareMenu();
    this.getUnionId(); 
  
  },
  //获取unionid
  getUnionId() {
    var _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.getUserInfo({
            success: resInfo => {
              app.globalData.userInfo = resInfo.userInfo
              _this.setData({
                userInfo: resInfo.userInfo,
                hasUserInfo: true
              })
              _this.getOpenId(res.code, resInfo);
            }
          })
        } else {
          wx.showToast({
            title: "获取用户登录态失败！",
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
        }
      }
    })
  },
  getOpenId(code, userInfo) {
    var _this = this;
    wx.request({
      url: app.data.zwUserInfoUrl+"/getJscode2session",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        js_code: code
      },
      success(openRes) {
        if (openRes.data.session_key) {
          _this.decodeUserInfo(code, userInfo, openRes.data.session_key);
        }else{
          wx.showToast({
            title: "请登录",
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
          _this.setData({
            showPage: true
          });
          _this.getVerifyImgCode();
        }
      },
      fail(e){}
    })
  },
  decodeUserInfo(code, resInfo, sessionKey) {
    var _this = this;
    wx.request({
      url: app.data.zwUserInfoUrl + '/doDecryptData',//自己的服务接口地址
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        encryptedData: resInfo.encryptedData,
        iv: resInfo.iv,
        sessionKey: sessionKey,
      },
      success: function (res) {
        _this.autoLogin(res.data.unionId);
      },
      fail: function (e) {
        console.log(e);
      }
    });
  },
  autoLogin(unionid) {
    var _this = this;
    this.setData({
      unionid: unionid
    })
    wx.request({
      url: app.data.zwLoginUrl + '/zwlogin',
      method: 'POST',
      data: {
        type: '1'			     //用户类型，1、个人，2、企业（必填）
        , source: "ZW-27582764699958629429945054883"              // 来源(必填)
        , client: "ZW-XCX"          //客户端类型(必填)
        , appVersion: "0.0.1"      //版本号(必填)
        , unionId: unionid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {        
        if(res.data.code == "0") {
          _this.setData({
            showPage: false
          })
          var userId = res.data.data.userId;
          var sid = res.data.sid;
          var cookies = {
            "userId": userId,
            "sid": sid
          }
          wx.setStorageSync("cookies", cookies);
          // //判断有无测验
          _this.handResult_ajax(userId, sid);
        }else{
          if (res.data.code == "-100") {
            _this.setData({
              showPage: true
            });
            _this.getVerifyImgCode();
          } 
        }
      },
      fail(e) {
        console.log(e);
      }
    })
  },
  // 倒计时
  getTime() {
    var _this = this, timer = "";
    if (this.data.fixTime == 0) {
      clearTimeout(timer);
      this.setData({
        disabled: false,
        getVerifyTxt: "获取验证码",
        fixTime: 59
      });
    } else {
      this.data.fixTime--;
      this.setData({
        disabled: true,
        getVerifyTxt: "重发(" + this.data.fixTime + ")",
        fixTime: this.data.fixTime
      })
      timer = setTimeout(function () {
        _this.getTime();
      }, 1000)
    }
  },
  //获取图形验证码
  getVerifyImgCode() {
    var _this = this;
    wx.request({
      url: app.data.dlgUrl + '/api/userLoginRestApi/createImageCode?_lt=' + new Date().getTime(),
      method: 'POST',
      data: {
        format: "json"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0 || res.data.code == '0') {
          _this.setData({
            imgCode: res.data.data[0],
            imgKey: res.data.extra
          });
        } else {
          wx.showToast({
            title: "获取图形验证码失败",
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: "获取图形验证码失败",
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
      }
    })
  },
  //获取sms
  getVerifyCode() {
    var _this = this;
    var dataJson = {
      format: "json",
      phone: _this.data.phone,
      inputCode: _this.data.verifyImg,
      key: _this.data.imgKey
    };
    if (this.verifyInput()) {
      wx.request({
        method: 'POST',
        url: app.data.dlgUrl + '/api/smsRest/sendCode',
        data: dataJson,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.code == 0) {
            _this.getTime();
            wx.showToast({
              title: "发送成功",
              icon: 'success',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              image: "../../images/cross.png",
              icon: 'success',
              duration: 2000
            });
          }
        },
        fail: function (e) {
          wx.showToast({
            title: "发送验证码失败",
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
        }
      })
    }
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  verifyImgInput: function (e) {
    this.setData({
      verifyImg: e.detail.value
    })
  },
  verifyCodeInput: function (e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  verifyInput() {
    if (this.data.phone == "" || !/^1[34578]\d{9}$/.test(this.data.phone)) {
      this.setData({
        errorMsg: "请输入正确手机号",
        focus: true
      });
      return false;
    } else {
      this.setData({ errorMsg: "" });
    }
    if (this.data.verifyImg == "") {
      this.setData({
        errorMsg: "图形验证码不为空",
        focusImg: true
      });
      return false;
    } else {
      this.setData({ errorMsg: "" });
    }
    return true;
  },
  loginSubmit: function () {
    var _this = this;
    if (this.verifyInput()) {
      if (this.data.verifyCode == "") {
        this.setData({
          errorMsg: "验证码不为空",
          focusCode: true
        });
        return false;
      } else {
        this.setData({ errorMsg: "" });
      }
      _this.setData({
        loginOperate: true
      })
      wx.showToast({
        title: "加载中...",
        icon: 'loading',
        duration: 10000
      });
      wx.request({
        url: app.data.zwLoginUrl + '/zwlogin',
        method: 'POST',
        data: {
          phone: _this.data.phone 	 //用户名
          , type: '1'			     //用户类型，1、个人，2、企业（必填）
          , validCode: _this.data.verifyCode			 //验证码
          , source: "ZW-27582764699958629429945054883"              // 来源(必填)
          , client: "ZW-XCX"          //客户端类型(必填)
          , appVersion: "0.0.1"      //版本号(必填)
          , unionId:this.data.unionid
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.data.code == "0") {
            var userId = res.data.data.userId;
            var sid = res.data.sid;
            var cookies = {
              "userId": userId,
              "sid": sid
            }
            wx.setStorageSync("cookies", cookies);
            // //判断有无测验
            _this.handResult_ajax(userId, sid);
          } else {
            _this.setData({
              loginOperate: false
            })
            wx.showToast({
              title: res.data.msg,
              image: "../../images/cross.png",
              icon: 'success',
              duration: 2000
            });
          }
        },
        fail: function (e) {
          _this.setData({
            loginOperate: false
          })
          wx.showToast({
            title: e.msg,
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          });
        }
      });
    }
  },
  //登录后——判断有无测验
  handResult_ajax(userId, sid) {
    var _this = this;
    wx.request({
      method: 'POST',
      url: app.data.zwUrl + '/api/zw/userHandApi/handResult',
      data: {
        format: "json",
        userId: userId == undefined ? "" : userId,
        sid: sid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        var datas = res.data;
        if (datas.code == "0") {
          //data为空表示用户还未上传过手信息
          if (datas.data.length == "0") {
            _this.authentication_ajax(userId, sid)//判断认证状态
          } else {
            for (var i = 0; i < datas.data.length; i++) {
              var dataLists = datas.data[i];
              console.log(dataLists.status);
              switch (dataLists.status) {
                case 0:
                  wx.redirectTo({
                    url: '../process/process?_=' + new Date().getTime()
                  })
                  break;
                case 1:
                  wx.redirectTo({
                    url: '../result/result?_=' + new Date().getTime() +
                    '&personalityId=' + dataLists.personalityId +
                    '&ringFingerLength=' + dataLists.ringFingerLength +
                    '&indexFingerLength=' + dataLists.indexFingerLength
                  })
                  break;
                case 2:
                  wx.redirectTo({
                    url: '../uploadFail/uploadFail?reject=true&_=' + new Date().getTime()//驳回页
                  })
                  break;
              }
            }
          }
        }else{
          _this.setData({
            loginOperate: false
          })
        }
      },
      fail: function (e) {
        _this.setData({
          loginOperate: false
        })
        wx.showToast({
          title: e.msg,
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
      }
    })
  },
  //查询用户性别
  authentication_ajax(userId, sid) {
    wx.request({
      method: 'POST',
      url: app.data.zwUrl + '/api/zw/userHandApi/querySex',
      data: {
        format: "json",
        userId: userId == undefined ? "" : userId,//用户id
        sid: sid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        var datas = res.data;
        if (datas.code == "0") {
          if (datas.existSex != true) {
            wx.redirectTo({
              url: '../sex/sex?_=' + new Date().getTime()
            })
          } else {
            wx.redirectTo({
              url: '../rightHand/rightHand?_=' + new Date().getTime()
            })
          }
        }else{
          _this.setData({
            loginOperate: false
          })
        }
      },
      fail: function (e) {
        _this.setData({
          loginOperate: false
        })
        wx.showToast({
          title: e.msg,
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
      }
    });
  }
})
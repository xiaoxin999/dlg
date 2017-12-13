// pages/share/share.js
var app = new getApp();
Page({
  data: {
    imgSrc:"../../images/userImg.jpg",
    timeStamp:new Date().getTime(),
    characterTxt:"",
    userName:"",
    sexIcon:"",
    sexTxt:"",
    contentTitle:"",
    contentTxt:"",
    userId:"",
    personalityId:""

  },
  onLoad(option){
    var _this = this;
    wx.hideShareMenu();
    _this.setData({
      sid: option.sid,
      userId: option.userId,
      
      personalityId: option.contentId
    })
    wx.request({
      url: app.data.zwUrl + '/api/zw/personalityInfoApi/getDetail',
      method: 'POST',
      data: {
        format:"json",
        contentId: _this.data.personalityId,
        sid: _this.data.sid,
        userId: _this.data.userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var datas = res.data;
        if (datas.code == "0") {
          var banlvList = [];
          _this.setData({
            characterTxt:datas.personality.name
          });
          // 判断是否为null
          if (datas.user.username != null) {
            _this.setData({
              userName:datas.user.username
            });
          } else {
            _this.setData({
              userName: ""
            });
          }
          switch (datas.personality.sex) {
            case 1:
              _this.setData({
                sexIcon:"icon-xingbienan",
                sexTxt:""
              })
              break;
            case 2:
              _this.setData({
                sexIcon: "icon-xingbienv",
                sexTxt: ""
              })
              break;
            default:
              _this.setData({
                sexIcon: "",
                sexTxt: "保密"
              })
              break;
          }
          //头像渲染
          for (var i = 0; i < datas.data.length; i++) {
            var dataLists = datas.data[i];
            var imgType = dataLists.imgType//imgType状态判断
            if (imgType == 4) {
              _this.setData({
                imgSrc: dataLists.imgUrl
              })
            }
          }
          //数据渲染
          if (datas.infoRestVo.length != "1") {
            for (var i = 0; i < datas.infoRestVo.length; i++) {
              var dataLists = datas.infoRestVo[i];
              _this.setData({
                contentTitle: dataLists.title,
                contentTxt: dataLists.content
              })
            }
          } else {
            _this.setData({
              contentTitle: datas.infoRestVo[0].title,
              contentTxt: datas.infoRestVo[0].content
            })
          }

        } else {
          wx.showToast({
            title: data.msg,
            image: "../../images/cross.png",
            icon: 'success',
            duration: 2000
          }); 
        }
      },
      fail: function (e) { 
        wx.showToast({
          title: "请求失败",
          image: "../../images/cross.png",
          icon: 'success',
          duration: 2000
        });
      }
    })
  }
})
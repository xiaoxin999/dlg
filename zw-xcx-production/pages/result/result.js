// pages/result1/result1.js
var app = new getApp();
Page({
  data: {
    second_height: 0,
    headImg: "../../images/userImg.jpg",
    characterTxt: "",
    characterScore: "",
    tabs: [],
    tabsActive: "tabs_0",
    tabSelect: 0,
    imgTypes: [],//上传图片类型
    lists: [//0 右手掌 1 右手背 2 左手掌 3 左手背 4 头像
      {
        "listIcon": "icon-juchanghuangguan",
        "listTxt": "性格",
        "listActive": false,
        "listImgType": 0
      },
      {
        "listIcon": "icon-dianzanmw",
        "listTxt": "能力",
        "listActive": false,
        "listImgType": 0
      },
      {
        "listIcon": "icon-1",
        "listTxt": "优点",
        "listActive": false,
        "listImgType": 0
      },
      {
        "listIcon": "icon-jinggao",
        "listTxt": "缺点",
        "listActive": false,
        "listImgType": 1
      }, {
        "listIcon": "icon-mingpian",
        "listTxt": "职业",
        "listActive": false,
        "listImgType": 2
      },
      {
        "listIcon": "icon-qinglv",
        "listTxt": "伴侣",
        "listActive": false,
        "listImgType": 4
      },
      {
        "listIcon": "icon-jianyi",
        "listTxt": "建议",
        "listActive": false,
        "listImgType": 3
      }
    ],
    listActive: "item_00",
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },  
    listContents: [],
    itemCats: "",
    itemCats1: "",
    contentTitle: "",
    contentTxt: "",
    tag: false,
    contentTitle1: "",
    contentTxt1: "",
    testxxx:{},
    IsUpload: true,
    imgValue: "",
    imgTXT: "",
    personalityId: "",
    ringFingerLength: "",
    indexFingerLength: "",
    shareCharacterId: "",
    sid: "",
    userId: ""
  },
  onLoad: function (options) {
    var data = wx.getStorageSync("cookies"), _this = this;
    this.setData({
      ringFingerLength: options.ringFingerLength,
      indexFingerLength: options.indexFingerLength,
      sid: data.sid,
      personalityId: options.personalityId == undefined ? "" : options.personalityId,
      userId: data.userId
    })
    this.checkRejectInfo();
  },
  //根据状态 查询用户照片信息
  checkRejectInfo() {
    var _this = this;
    var fingerScore = isNaN((this.data.ringFingerLength / this.data.indexFingerLength)
      .toFixed(2)) ? "" : (this.data.ringFingerLength / this.data.indexFingerLength).toFixed(2);
    wx.request({
      url: app.data.zwUrl + '/api/zw/userHandApi/checkRejectInfo',
      method: 'POST',
      data: {
        userId: _this.data.userId,
        sid: _this.data.sid,
        rejectStatus: "1"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var vals = res.data;
        if (vals.code == "0") {
          var imgTypes = new Array();
          for (var i = 0; i < vals.data.length; i++) {
            var dataLists = vals.data[i];
            imgTypes.push(dataLists.imgType) //imgType状态判断
            //头像渲染
            if (dataLists.imgType == 4) {
              _this.setData({
                headImg: dataLists.imgUrl,
              })
            }
          }
          _this.setData({
            imgTypes: imgTypes,
            characterScore: fingerScore
          })
          _this.perinfoDetail_ajax()//测试结果
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
    });
  },
  //获取测试结果
  perinfoDetail_ajax() {
    var _this = this;
    wx.request({
      url: app.data.zwUrl + '/api/zw/personalityInfoApi/perinfoDetail',
      method: 'POST',
      data: {
        personalityId: _this.data.personalityId,
        sid: _this.data.sid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var datas = res.data;
        if (datas.code == "0") {
          if (datas.data.length > 0) {
            var characterName = "";
            if (datas.data.length == 1) {
              characterName = datas.data[0].personalityRpcVo.name;
            } else {
              characterName = datas.data[0].name;
            }
            datas.data.map((data) => {
              data.items.map((item) => {
                item.cats.map((cat) => {
                  var nCat = "";
                  cat.content.split("<br/>").map((xCat) => {
                    nCat += xCat + '\n';
                  })
                  cat.content = nCat;
                })
              })
            })
            _this.setData({
              characterTxt: characterName,
              listContents: datas.data
            });
            var personalityRpcVo = new Array();
            if (datas.data.length > 1) {
              wx.hideShareMenu();
            }
            datas.data.map((tab) => {
              personalityRpcVo.push(tab.personalityRpcVo);
            })
            _this.setData({
              tabs: personalityRpcVo
            });
            _this.characterItemData(0);
          }
        }
      }
    });
  },
  //双性格tab切换
  changeTabs(val) {
    var _this = this;
    _this.setData({
      tabSelect: val.currentTarget.dataset.index,
      tabsActive: val.currentTarget.id,
      listActive: "item_" + val.currentTarget.dataset.index + "0"
    })
    _this.characterItemData(val.currentTarget.dataset.index);
  },
  //页面加载初始显示
  characterItemData(index) {
    var _this = this;
    this.data.listContents[index].items.map((item) => {
      if (item.title.indexOf("性格") > -1) {
        _this.setData({
          contentTitle: "性格",
          itemCats: item.cats[0].content,
          shareCharacterId: _this.data.listContents[0].items[0].cats[0].id
        });
      }
    })
  },
  scrollTopFun(e){
    if (e.detail.scrollTop > 300) {//触发gotop的显示条件  
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }  
  },
  //左侧tab切换
  changeItem(val) {
    var _this = this;
    var _top = this.data.scrollTop.scroll_top;
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });  
    _this.setData({
      listActive: val.currentTarget.id
    });
    var listTxt = val.currentTarget.dataset.text,
      listContents = this.data.listContents,
      tabSelectIdx = _this.data.tabSelect;
    if (listContents.length > 0) {
      listContents[tabSelectIdx].items.map((item) => {
        if (item.title.indexOf(listTxt) > -1) {         
          if (item.title == "理想伴侣" || item.title == "不适合的伴侣") {
            if (item.title == "理想伴侣") {
              _this.setData({
                tag: true,
                IsUpload: true,
                contentTitle: item.title,
                itemCats: item.cats[0].content
              });
            }
            if (item.title == "不适合的伴侣") {
              _this.setData({
                tag: true,
                IsUpload: true,
                contentTitle1: item.title,
                itemCats1: item.cats[0].content
              });
            }
          }else{
            _this.setData({
              tag: false,
              IsUpload: true,
              contentTitle: listTxt,
              itemCats: item.cats[0].content
            });
          }
        }
      })

      //校验图片是否上传
      if (_this.data.imgTypes.indexOf(val.currentTarget.dataset.imgType)>-1){
        _this.setData({
          IsUpload: true
        })
      }else{
        _this.setData({
          IsUpload: false
        })
        if (val.currentTarget.dataset.imgType == 4 && _this.data.imgTypes.indexOf(4) == -1) {
          _this.setData({
            contentTitle: "伴侣",
            tag: false
          })
        }
      } 
    }
    _this.hasNoImgType(val.currentTarget.dataset.text);
  },
  //判断当前手和头像没有上传操作
  hasNoImgType(listTxt) {
    var _this = this;
    switch (listTxt) {
      case "缺点":
        _this.setData({
          imgTXT: "上传完整的右手背照片即可查看",
          imgValue: 1
        });
        break;
      case "职业":
        _this.setData({
          imgTXT: "上传完整的左手掌照片即可查看",
          imgValue: 2
        });
        break;
      case "伴侣":
        _this.setData({
          imgTXT: "上传头部正面照片即可查看",
          imgValue: 4
        });
        break;
      case "建议":
        _this.setData({
          imgTXT: "上传完整的左手背照片即可查看",
          imgValue: 3
        });
        break;
      default:
        _this.setData({
          imgTXT: "",
          imgValue: ""
        });
        break;
    }
  },
  addStatics() {
    var _this = this;
    wx.request({
      url: app.data.zwUrl + "/api/zw/weChatStaticsticsShareRestApi/addStatics",
      method: "POST",
      data: {
        userId: _this.data.userId//用户Id
        , personalityId: _this.data.shareCharacterId //性格id
        , personalityName: "" //性格名称
        , contentTitle: ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res);
      },
      fail(e) {
        console.log(e);
      }
    })
  },
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '“真我”比您更懂您，源于心理专家亲自解析',
      imageUrl: "../../images/logo_fenxiang.png",
      path: '/pages/share/share?_lt=' + new Date().getTime() + '&contentId=' + _this.data.shareCharacterId + '&sid=' + _this.data.sid + '&userId=' + _this.data.userId,
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
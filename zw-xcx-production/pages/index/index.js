//index.js
//获取应用实例
var app = getApp();
var imageUtil = require('../../utils/util.js'); 
Page({
  data: {
    imagefirstsrc: '../../images/zw_index.jpg',//图片链接 
    imagewidth: 0,//缩放后的宽 
    imageheight: 0,//缩放后的高 
    indexBtn:'../../images/zw_indexBtn.png'
  },
  onLoad:function(opt){
    wx.hideShareMenu();
  },
  primary:function(){
    wx.redirectTo({
      url: '../login/login'
    })
  },
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  }
})

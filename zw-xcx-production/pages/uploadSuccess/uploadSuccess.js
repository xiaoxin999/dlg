// pages/uploadSuccess/uploadSuccess.js
Page({
  data: {
    borderColor1: 'borderColor  ',
    borderColor2: '',
    showSelect1: "display:block",
    showSelect2: "",
    selected:true
  },
  onLoad(){
    wx.hideShareMenu();
  },
  selectDiv:function(e){
    this.setData({selected:true});
    if (e.currentTarget.id == "selectId1") {
      this.setData({ 
        borderColor1: "borderColor",
        borderColor2:"" ,
        showSelect1: "display:block",
        showSelect2: "display:none"
      })
    } else {
      this.setData({ 
        borderColor1: "",
        borderColor2: "borderColor", 
        showSelect1: "display:none",
        showSelect2: "display:block"
         })
    }
  },
  successSubmit:function(){
    if(this.data.selected){
      wx.redirectTo({
        url: '../process/process'
      })
    }else{

    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
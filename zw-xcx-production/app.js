//app.js
App({
  data:{
    appid: "wx6d8e77a8bcfef9ac",
    secret: "45381717be6f2284df297d9cb9e5aa74",
    // appid:'wx568c16f48fed8e8d',
    // secret:'5e368d82ac33b620d3fe784a74ab989f',
    dlgUrl:  'https://dlg.dalinggong.com/v_2_4',
    zwLoginUrl:'https://sso.dalinggong.com',
    zwUrl: 'https://zw.dalinggong.com',
    zwUserInfoUrl: "https://wx.dalinggong.com",
    // 预发布
    // dlgUrl: 'https://dlg3.dalinggong.com',
    // zwLoginUrl: 'https://sso3.dalinggong.com',
    // zwUrl: 'https://zw3.dalinggong.com',
    // zwUserInfoUrl:"https://wx2.dalinggong.com",
    cid: 'ZW-27582764699958629429945054803',
    cidUPimg: '27582764699958629429945054803'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    if (logs.length <10) {
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs);
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
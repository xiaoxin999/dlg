var env = {
  //aliyun OSS config
  uploadImageUrl: "https://gongren.oss-cn-hangzhou.aliyuncs.com/", //默认存在根目录，可根据需求改
  timeout: 87600,
  accessid: 't9zSHOdQ10x7QwLk',
  accesskey: 'etpwepGdRxIx3wpn86C2CpSyhXxfE9',
  dir: 'dds/img/zw/handImg/'
};
const Base64 = require('./Base64.js');
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

const uploadFile = function (filePath) {
  if (!filePath || filePath.length < 9) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  var fileUrl="";
  if (filePath.filePath.indexOf("http://tmp/")>-1){
    fileUrl = filePath.filePath.replace('http://tmp/', '');
  }
  if (filePath.filePath.indexOf("wxfile://") > -1){
    fileUrl = filePath.filePath.replace('wxfile://tmp_', '');
  }
  const aliyunFileKey = env.dir +fileUrl;
  const aliyunServerURL = env.uploadImageUrl;//OSS地址，需要https
  const accessid = env.accessid;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);//获取签名
  wx.uploadFile({
    url: aliyunServerURL,
    filePath: filePath.filePath,
    name: 'file',//必须填file
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
      filePath.success(aliyunServerURL+aliyunFileKey);
    },
    fail: function (err) {
      err.wxaddinfo = aliyunServerURL;
      console.log(err.wxaddinfo);
    },
  })
}

const getPolicyBase64 = function () {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function (policyBase64) {
  const accesskey = env.accesskey;

  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);

  return signature;
}

module.exports = uploadFile;
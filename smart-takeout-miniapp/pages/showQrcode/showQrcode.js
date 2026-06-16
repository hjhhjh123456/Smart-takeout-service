// pages/showQrcode/showQrcode.js
var qrcode = require('../../weapp.qrcode.min')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveGetQrcode:false,
    myQrcode: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getQrcode(this.data.myQrcode)
    // qrcode({
    //   width: 200,
    //   height: 200,
    //   canvasId:'myQrcode',
    //   text: options.text
    // })
    this.setData({
      haveGetQrcode:true
    })
  },

  getQrcode(canvas) {
    //canvas是canvas-id
      console.log(canvas)
      let qrcode1 = new qrcode(canvas, {
        // text: 'https://www.baidu.com/img/pc_cc75653cd975aea6d4ba1f59b3697455.png',
        text: options.text,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        canvasId:'1',
        // correctLevel: QRCode.CorrectLevel.L //二维码辨识度
      });
      qrcode({
        text: options.text,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        canvasId:'1',
      })
    },
    save() {
      let that = this
      console.log(11)
      //将画布中的二维码导出来
      wx.canvasToTempFilePath({
        canvasId: this.data.myQrcode, //传入canvas的id
        success: function (res) {
          console.log(res)
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          //保存二维码
           wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success(){
                    wx.saveImageToPhotosAlbum({
                        filePath: tempFilePath,
                        success: function(res) {
                          wx.showToast({
                            title: '图片保存成功',
                            icon: 'success',
                            duration: 2000 //持续的时间
                          })
                        },
                        fail: function (err) {
                          console.log(err)
                          wx.showToast({
                          title: '图片保存失败',
                          icon: 'none',
                          duration: 2000//持续的时间
                        })
                      }
                    })
                  },
                  fail: function (err){
                    console.log('点击了拒绝')
                    console.log(err)
                  }
                })
              }else{
                wx.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success: function(res) {
                    wx.showToast({
                      title: '图片保存成功',
                      icon: 'success',
                      duration: 2000 //持续的时间
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                    wx.showToast({
                    title: '图片保存失败',
                    icon: 'none',
                    duration: 2000//持续的时间
                  })
                }
              })
              }
            }
          })
        },
        fail: function (res) {
          console.log(res);
        }
      },this);
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onSave(res) {
    const { value } = res.currentTarget.dataset
    wx.canvasToTempFilePath({
      canvasId: value,
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        //保存二维码
        wx.getSetting({
          success: (res) => {
            console.log(res)
            const status = res.authSetting['scope.writePhotosAlbum']
            if (!status) {
              // 引导用户授权...
            } else {
              // 保存图片到系统相册
              this.saveImg(tempFilePath)
            }
          }
        })
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },
  /* 保存图片 */
  saveImg(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: function (res) {
        wx.showToast({
          title: '保存图片成功',
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '保存图片失败' ,
        })
      }
    })
  }
})
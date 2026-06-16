// pages/mine/mine.js
var app = getApp()

Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '储物柜地图',
      tip: '储物柜在校园的分布',
      pagenumber:1
    
    }, {
      title: '数据库',
      tip: '数据库',
      pagenumber:2
      
    }, {
      title: '二维码上传取餐',
      tip: '上传外卖商家二维码取餐',
      pagenumber:3
    }, {
      title: '储物柜管理',
      tip: '开柜、柜号',
      showItem: false,
      pagenumber:4
    }, {
      title: '蓝牙调试',
      tip: '蓝牙调试',
      pagenumber:5
    }],
    takeawaySituation:"",
    Comparision_result:"",
    cabinetId:'',


    haveCreateCollection: false,
    userInfo: app.globalData.userInfo,
    username:"",
    avatarUrl:"",
    usingCabinet:[],
    usedCabinet:[],
    devid: "88:C2:55:BB:49:EC",
    serid: "0000FFE0-0000-1000-8000-00805F9B34FB",
    isconnected: false,
    inputValue: "",
    serres: {},
    cabinetId:'',
    Qrcodepassword: "",
    boxId:"",
    cabinetId: "",
  },
  /**
   * 页面的初始数据
   */
  test(){
      wx.navigateTo({
        url: '/pages/test/test',
      })
  },

  findFreeCabinet(){
    wx.cloud.callFunction({
      name: 'findFreeCabinet',
      success: function(res) {
        console.log(res.result.data[0])
      },
      fail: console.error
    })
    console.log(this.data.userInfo)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      username:app.globalData.username,
      avatarUrl:app.globalData.avatarUrl
    })
    wx.openBluetoothAdapter({
      mode: 'central',
      success: (res) => {
        // 开始搜索附近的蓝牙外围设备
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false,
        })
      },
      fail: (res) => {
        if (res.errCode !== 10001) return
        wx.onBluetoothAdapterStateChange((res) => {
          if (!res.available) return
          // 开始搜寻附近的蓝牙外围设备
          wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
          })
        })
      }
    })
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

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  doSendValue: function(e) {
    var deviceId = this.data.devid
    var serviceId = this.data.serid
    for (let i = 0; i < this.data.serres.characteristics.length; i++) {
      let item = this.data.serres.characteristics[i]
      if (item.properties.write) { // 该特征值可写
        var bytes = new Array();
        var len, c;
        var str = this.data.inputValue;
        len = str.length;
        for (var j = 0; j < len; j++) {
          c = str.charCodeAt(j);
          if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
          } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
          } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
          } else {
            bytes.push(c & 0xFF);
          }
        }
        var array = new ArrayBuffer(bytes.length + 2);
        let dataView = new DataView(array)
        for (var j = 0; j <= bytes.length; j++) {
          dataView.setUint8(j, bytes[j])
        }
        dataView.setUint8(bytes.length, 0xD)
        dataView.setUint8(bytes.length + 1, 0xA)
        wx.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId: item.uuid,
          value: array,
        })
      }
    }
  },

  doReadValue: function(e) {
    return new Promise((ret)=>{
      var deviceId = this.data.devid
      var serviceId = this.data.serid
      for (let i = 0; i < this.data.serres.characteristics.length; i++) {
        let item = this.data.serres.characteristics[i]
        if (item.properties.read) { // 改特征值可读
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            success (res) {
              console.log('readBLECharacteristicValue:', res.errCode)
            }
          })
          if (item.properties.notify || item.properties.indicate) {
            // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
          wx.onBLECharacteristicValueChange(function(res) {
            console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
            let str = toString(res.value)
            console.log(str)
            if (str[0] != 'g' && str[0] != "o" && (str.length == 1 || str[1] != "e")){
              if (str != "error") ret({code: 0, data: str})
              else ret({code: -1, data: str})
            }
          })
        }
        function toString(buffer) {
          var array = new Uint8Array(buffer);
          console.log(array);
          var len = array.length;
          var ret = "";
          for(var i = 0;i<len;i++){
            ret += String.fromCharCode(array[i]);
          }
          return ret;
        }
      }
    })
  },

  connectBle(){
    var deviceId = this.data.devid
    var serviceId = this.data.serid
    return new Promise(function(ret) {
      wx.createBLEConnection({
        deviceId, // 搜索到设备的 deviceId
        success: () => {
          // 连接成功，获取服务
          wx.getBLEDeviceServices({
            deviceId, // 搜索到设备的 deviceId
            success: (res) => {
              wx.getBLEDeviceCharacteristics({
                deviceId, // 搜索到设备的 deviceId
                serviceId, // 上一步中找到的某个服务
                success: (res) => {
                  ret({serres:res, isconnected:true})
                },
                fail: (res) => {
                  ret({serres:res, isconnected:false})
                }
              })
            },
            fail: (res) => {
              ret({serres:res, isconnected:false})
            }
          })
        },
        fail: (res) => {
          ret({serres:res, isconnected:false})
        }
      })
    })
  },

  disconnectBle(){
    var deviceId = this.data.devid
    wx.closeBLEConnection({
      deviceId,
    })
  },

  getCabinet(){
    var openid = app.globalData.openid
    var userpassword = app.globalData.openid
    var id = this.data.cabinetId
    return new Promise(function(ret) {
      wx.request({
        //小程序向服务器请求当前柜号的储物柜空闲箱子
        url: 'http://110.42.252.81:8080/wxapp/getCabinet',
        data:{
          openid: openid,
          userpassword: userpassword,
          id: id
        },
        header: {
          'content-type': 'application/json' //默认值
        },
        method: 'get',
        dataType: 'json',
        success:(res) =>{
          if(res.data.code == 0){
            ret({code: 0, res: res.data})
          }else{
            ret({code: -1, res: res.data})
          }
        },
        fail:(res) => {
          ret({code: -1, res: res})
        }
      })
    })
  },

  updateCabinet(){
    var id = this.data.cabinetId
    var number = this.data.boxId
    var password = this.data.Qrcodepassword
    return new Promise(function(ret) {
      wx.request({
        //小程序向服务器请求当前柜号的储物柜空闲箱子
        url: 'http://110.42.252.81:8080/wxapp/updateCabinet',
        data:{
          openid:app.globalData.openid,
          userpassword:app.globalData.openid,
          id: id,
          number: number,
          password: password
        },
        header: {
          'content-type': 'application/json' //默认值
        },
        method: 'get',
        dataType: 'json',
        success:(res) =>{
          if(res.data.code == 0){
            ret({code: 0, res: res.data})
          }else{
            ret({code: -1, res: res.data})
          }
        },
        fail:(res) => {
          ret({code: -1, res: res})
        }
      })
    })
  },

  async saveTakeOut(){
    wx.showLoading({
      title: '正在生成取餐二维码',
    });
    var errno
    var errMsg
    var that = this
    var doing = true
    setTimeout(function () {
      if (doing){
        that.disconnectBle()
        wx.hideLoading({})
        wx.showToast({
          title: "连接超时，请重试",
          icon: 'error',
          duration: 5000
        })
      }
    }, 2000);
    let ret = await this.connectBle()
    if (ret.isconnected){
      this.setData({
        serres:ret.serres,
        inputValue:"getid"
      })
      this.doSendValue()
      ret = await this.doReadValue()
      if (ret.code == 0){
        this.setData({
          cabinetId: ret.data
        })
        ret = await this.getCabinet()
        if(ret.code == 0){
          this.setData({
            inputValue: "set" + "-" + ret.res.id + "-" + ret.res.number + "-" + ret.res.password,
            cabinetId: ret.res.id,
            boxId: ret.res.number,
            Qrcodepassword: ret.res.password
          })
          this.doSendValue()
          ret = await this.doReadValue()
          if (ret.code == 0){
            ret = await this.updateCabinet()
            if (ret.code != 0){
              errno = 5
              errMsg = "更新储物柜信息失败"
            }
          }else{
            errno = 4
            errMsg = "发送储物柜信息失败"
          }
        }else{
          errno = 3
          errMsg = "获取空闲储物柜失败"
        }
      }else{
        errno = 2
        errMsg = "获取储物柜信息失败"
      }
    }else{
      errno = 1;
      errMsg = "蓝牙连接失败"
    }
    doing = false
    if(errno > 0){
      console.log(errno)
      if(errno > 1) this.disconnectBle()
      wx.hideLoading({})
      wx.showToast({
        title: errMsg,
        icon: 'error',
        duration: 2000
      })
    }else{
      this.disconnectBle()
      var text = this.data.cabinetId + "-" + this.data.boxId + "-" + this.data.Qrcodepassword
      wx.navigateTo({
        url: '../showQrcode/showQrcode?text='+text
      })
    }
  },

  scanQRCode(){
    return new Promise(function(ret){
      wx.scanCode({
        onlyFromCamera: false, //设置为可以使用本机图片
        scanType:['barCode','datamatrix','pdf417','qrCode'], //可以扫描的类型
          //成功后
        success: function(res){
          ret(res.result)
        },
        fail: function(){
          ret("取消扫描二维码")
        }
      })
    })
  },

  GetTakeawaySituation(str){
    let i = 0, k = 0, n = str.length, array = ["","",""]
    while(i < n){
      if (str[i] == '-') k++  
      else array[k] += str[i]
      i++
    }
    this.setData({
      cabinetId: array[0],
      boxId: array[1],
      Qrcodepassword: array[2]
    })
  },

  UpdateServerStatus(){
    var openid = app.globalData.openid
    var userpassword = app.globalData.openid
    var id = this.data.cabinetId
    var number = this.data.boxId
    var password = this.data.Qrcodepassword
    return new Promise(function(ret) {
      wx.request({  
        url: 'http://110.42.252.81:8080/wxapp/openCabinet',    
        data: {
          openid: openid,
          userpassword: userpassword,
          id: id,
          number:number,
          password:password
        },
        header: {
          'content-type': 'application/json' //默认值
        },
        method: 'get',
        dataType: 'json',
        success:(res) =>{
          if(res.data.code == 0){
            ret({code: 0, res: res.data})
          }else{
            ret({code: -1, res: res.data})
          }
        },
        fail:(res) => {
          ret({code: -1, res: res})
        }
      })
    })
  },

  async getTakeOut(){
    wx.showLoading({
      title: '正在校验取餐二维码',
    });
    var errno
    var errMsg
    var notice
    var doing = true
    let ret = await this.connectBle()
    if (ret.isconnected){
      this.setData({
        serres:ret.serres
      })
      notice = await this.scanQRCode()
      if(notice != "取消扫描二维码"){
        var that = this
        setTimeout(function () {
          if (doing){
            that.disconnectBle()
            wx.hideLoading({})
            wx.showToast({
              title: "连接超时，请重试",
              icon: 'error',
              duration: 5000
            })
          }
        }, 2000);
        console.log(notice)
        this.GetTakeawaySituation(notice)
        this.setData({
          inputValue: "open"+"-"+notice
        })
        this.doSendValue()
        ret = await this.doReadValue()
        if(ret.code == 0){
          ret = await this.UpdateServerStatus()
          if(ret.code == 0){
            this.setData({
              haveGetImgSrc: true,
              takeawaySituation:ret.data,
            });
          }else{
            errno = 4
            errMsg = "服务器无法更新"
          }
        }else{
          errno = 3
          errMsg = "二维码错误"
        }
      }else{
        errno = 2
        errMsg = "取消扫描二维码"
      }
    }else{
      errno = 1
      errMsg = "蓝牙连接失败"
    }
    doing = false
    if(errno > 0){
      console.log(errno)
      if(errno > 1) this.disconnectBle()
      wx.hideLoading({})
      wx.showToast({
        title: errMsg,
        icon: 'error',
        duration: 2000
      })
    }else{
      this.disconnectBle()
      wx.navigateTo({
        url: '../showTakeawaySituation/showTakeawaySituation?s_cabinetId='+this.data.cabinetId+'&s_boxId='+this.data.boxId
      })
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  bindViewTap() {
    
  },

  jumpPageMap(e) {   
    wx.switchTab({
      url: '/pages/map/map',
    })
   },


  jumpPageUploadcode(e) {   
    wx.switchTab({
      url: '/pages/uploadcode/uploadcode',
    })
  },

  

  
  jumpPageBleDebug(e){
    wx.navigateTo({
      url: '/pages/BleDebug/BleDebug',
    })
  },
   
  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  }
});
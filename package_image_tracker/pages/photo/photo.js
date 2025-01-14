const image = require('../../utils/imageBusiness.js')
const model = require('../../utils/modelBusiness.js');
const canvasId = 'canvas2d';
const canvasWebGLId = 'canvasWebGL';
const maxCanvasWidth = 375;
// a url of a image
const modelUrl = '../../utils/cat_beard.png';

Page({
  data: {
    btnText: 'Take a photo',
    devicePosition: 'back',
    // if it is taking a photo
    isRunning: true,
    canvasContext: null,
    canvasDom: null,
  },
  onLoad: function () {
    var _that = this;
    // waiting for dom completed
    setTimeout(function () {
      // load 3d model
      model.initThree(canvasWebGLId, modelUrl);
      image.initTracker();
      _that.getCanvasOfType2d();
    }, 150);
  },
  onUnload: function () {
    model.stopAnimate();
    model.dispose();
  },
  processPhoto(photoPath, imageWidth, imageHeight, ctx) {
    // const ctx = wx.createCanvasContext(canvasId);
    var canvasWidth = imageWidth;
    if (canvasWidth > maxCanvasWidth) {
      canvasWidth = maxCanvasWidth;
    }
    // canvas Height
    var canvasHeight = Math.floor(canvasWidth * (imageHeight / imageWidth));
    // draw image on canvas
    ctx.drawImage(photoPath, 0, 0, canvasWidth, canvasHeight);

    // get image data from canvas
    let res = ctx.getImageData(
      0,
      0,
      canvasWidth,
      canvasHeight);

    wx.showLoading({
      title: 'Detecting...',
    });
    // process start
    image.detect(res.data,
      canvasWidth,
      canvasHeight,
      function (event) {
        wx.hideLoading();
        var result = event.data;

        if (result && result.prediction) {
          // set the rotation and position of the 3d model.    
          model.setModel(result.prediction,
            canvasWidth,
            canvasHeight);
          var frame = {
            data: new Uint8Array(res.data),
            width: res.width,
            height: res.height,
          };
          // put the 3d model on the image
          model.setSceneBackground(frame);
        } else {
          var message = 'No results.';
          wx.showToast({
            title: message,
            icon: 'none'
          });
        }
      });
    // process end

  },
  getCanvasOfType2d() {
    var _that = this;
    wx.createSelectorQuery()
      .select('#' + canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas2d = res[0].node;
        let ctx = canvas2d.getContext("2d");

        // needs to set the canvas size
        canvas2d.width = res[0].width;
        canvas2d.height = res[0].height;

        _that.canvasDom = canvas2d;
        _that.canvasContext = ctx;

      });
  },
  createImage(canvasDom, imgUrl, callback) {
    const image = canvasDom.createImage();
    image.onload = () => {
      callback(image);
    };
    image.onerror = (err) => {
      console.log("photo.js createImage", err);
    };
    image.src = imgUrl;
  },
  takePhoto() {
    var _that = this;
    const context = wx.createCameraContext();

    if (_that.data.isRunning) {
      _that.setData({
        btnText: 'Retry',
        isRunning: false,
      });

      // take a photo
      context.takePhoto({
        quality: 'normal',
        success: (res) => {
          var photoPath = res.tempImagePath;

          _that.createImage(
            _that.canvasDom,
            photoPath,
            function (image) {
              console.log('size of image:', image.width, image.height);
              _that.processPhoto(image,
                image.width,
                image.height,
                _that.canvasContext);
            })
        }
      });
    }
    else {
      _that.setData({
        btnText: 'Take a photo',
        isRunning: true,
      });

      // clear 3d canvas
      model.clearSceneBackground();
    }
  },
  changeDirection() {
    var status = this.data.devicePosition;
    if (status === 'back') {
      status = 'front';
    } else {
      status = 'back';
    }
    this.setData({
      devicePosition: status,
    });
  },
  error(e) {
    console.log(e.detail);
  }
})

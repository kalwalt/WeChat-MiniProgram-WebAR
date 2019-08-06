1. [Chinese README](https://zhuanlan.zhihu.com/p/72617098)  

2. [Chinese Source Code Analysis](https://zhuanlan.zhihu.com/p/74438078)

**2019-8-6 updated:**
Issue fixed: When function "wx.canvasToTempFilePath" is called frequently on Android Wechat, WeChat will be crashed.

# Introduction of WeChat MiniProgram Web AR 

This is a WeChat Web AR Demo. On July 5, 2019, WeChat miniprogram supports AR. It has been added a new API named "CameraFrameListener".

[CameraFrameListener API](https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.onCameraFrame.html)

We can create AR effects with the new API. This demo demonstrates a color tracker effect using "tracking.js" and "jsfeat" library. 

The "tracking.js" brings computer vision algorithms and techniques into browser environment. We can do real-time color tracking, face detection and much more.

[tracking.js](https://trackingjs.com/)

The "jsfeat" is a JavaScript computer vision library. 

[JSFeat](https://inspirit.github.io/jsfeat/)

The Demo includes color tracker, face tracker, image tracker and object tracker. There are two modes for each item. It includes 'taking a photo' and 'access a camera'.

![avatar](screenshot/indexpage.jpg)

## Color Tracker

Use the Demo to scan the picture below.

![avatar](screenshot/colortracker1.jpg)

Expect the effect below.

Use "Take a Photo" mode.

![avatar](screenshot/colortracker2.jpg)

Use "Access a camera" mode.

![avatar](screenshot/colortracker3.jpg)

## Face Tracker

Use the Demo to scan people's face.

![avatar](face.jpg)

Expect the effect below.

Use "Take a Photo" mode.

![avatar](screenshot/facetracker.jpg)

**2019-8-1 updated:**

When face recognition is not exact, the result is not good.

![avatar](screenshot/facetracker_perspective1.jpg)

When face recognition is exact, the result is good.

![avatar](screenshot/facetracker_perspective2.jpg)

## Image Tracker

a sample pattern picture is below.

![avatar](face.jpg)

Use the Demo to scan a rotate picture below.

![avatar](screenshot/2_rotate.jpg)

Expected:

![avatar](screenshot/imagetracker2.jpg)

Use the Demo to scan a skew picture below.

![avatar](screenshot/2_skew.jpg)

Expected:

![avatar](screenshot/imagetracker3.jpg)

Use the Demo to scan a translate and scale picture below.

![avatar](screenshot/2_translate_scale.jpg)

Expected:

![avatar](screenshot/imagetracker1.jpg)

**2019-8-1 updated:**

Use the Demo to scan a perspective picture below.

![avatar](screenshot/2_perspective.jpg)

Expected:

![avatar](screenshot/imagetracker_perspective.jpg)

## Object Tracker (Not recommended)

There will be a rect aboves people's mouth. It is slow and not better than face tracker. 

## How to improve performance

Face tracker is slow, but we can do some thing to improve speed. For example, we can blur image, grayscale image, sobel image, compress image and so on. After testing, we found that reducing image size is more proper. When image size is reduced, the parameters of tracker needs to be updated.

frame size of camera: the image size is smaller, the tracker's speed is faster.
```javascript
const frameWidth = 150;
```

face tracker parameter：the "initialScale" is bigger, the face tracker's speed is faster.
```javascript
const initialScale = 2;
```

color tracker parameter：the "minDimension" is bigger, the color tracker's speed is faster.
```javascript
const minDimension = 4;
```

interval time: interval time should be greater than cost time. The unit is milliseconds.
```javascript
const intervalTime = 350;
```

## Known Issues
Face tracker is very slow on iOS WeChat.

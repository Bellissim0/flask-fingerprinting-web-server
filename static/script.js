let fingerprint = {
    platform : null,
    cookiesEnabled : null,
    timezone : null,
    preferredLanguages : null,
    adblockEnabled : null,
    doNotTrack : null,
    navigatorPropertiesCount : null,
    buildID : null,
    product : null,
    productSub : null,
    vendor : null,
    vendorSub : null,
    hardwareConcurrency : null,
    javaEnabled : null,
    deviceMemory : null,
    screenWidth : null,
    screenHeight : null,
    screenDepth : null,
    screenAvailtop : null,
    screenAvailLeft : null,
    screenAvailHeight : null,
    screenAvailWidth : null,
    screenLeft : null,
    screenTop : null,
    permissions : {
      geolocation : null,
      notifications : null,
      persistentStorage : null,
      push : null
    },
    webGLVendor : null,
    webGLRenderer : null,
    localStorageAvailable : null,
    sessionStorageAvailable : null,
    indexedDB : null,
    supportedAudioFormats : {
      mp3 : null,
      mp4 : null,
      aif : null
    },
    supportedVideoFormats : {
      ogg : null,
      ogg2 : null,
      h264 : null,
      webm : null,
      vp9 : null,
      hls : null 
    },
    enumerateDevicesActive : null,
    mediaDevices : [],
    gyroscope : false,
    vmScore : 0
}

//adblock detection (not 100% reliable)
async function detectAdBlock() {
  let adBlockEnabled = false
  const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
  try {
    await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
  } catch (e) {
    adBlockEnabled = true
  } finally {
    fingerprint.adblockEnabled = adBlockEnabled
  }
}

detectAdBlock()

async function retrievePermissions(parameter){ 
  return navigator.permissions.query({name: parameter}).then(permission => {
    /*if(permission.state === "granted"){
      return("granted")
    } else if (permission.state === "prompt"){
      return("prompt")
    } else if (permission.state === "denied"){
      return("denied")
    }*/
    return permission.state;
  });
}

(async () => {
fingerprint.permissions.geolocation= await retrievePermissions("geolocation")
fingerprint.permissions.notifications= await retrievePermissions("notifications")
fingerprint.permissions.persistentStorage= await retrievePermissions("persistent-storage")
//push notifications in chrome work only with registered user, to implement
fingerprint.permissions.push= await retrievePermissions("push")
})();


//detect media devices
if (!navigator.mediaDevices?.enumerateDevices) {
  fingerprint.enumerateDevicesActive = false
} else {
  fingerprint.enumerateDevicesActive = true
  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        fingerprint.mediaDevices.push(device)
      });
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
}



//navigator
fingerprint.platform = navigator.platform;
fingerprint.cookiesEnabled = navigator.cookieEnabled;
fingerprint.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
fingerprint.preferredLanguages = navigator.language || navigator.userLanguage;
fingerprint.doNotTrack = navigator.doNotTrack
fingerprint.buildID = navigator.buildID
fingerprint.product = navigator.product
fingerprint.productSub = navigator.productSub
fingerprint.vendor = navigator.vendor
fingerprint.vendorSub = navigator.vendorSub
fingerprint.hardwareConcurrency = navigator.hardwareConcurrency
fingerprint.javaEnabled = navigator.javaEnabled()
fingerprint.deviceMemory = navigator.deviceMemory

//screen
fingerprint.screenWidth = screen.width
fingerprint.screenHeight = screen.height
fingerprint.screenDepth = screen.colorDepth
fingerprint.screenAvailtop = screen.availTop
fingerprint.screenAvailLeft = screen.availLeft
fingerprint.screenAvailHeight = screen.availHeight
fingerprint.screenAvailWidth = screen.availWidth
fingerprint.screenLeft = screenLeft
fingerprint.screenTop = screenTop

//indexedDB
indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if(indexedDB){
  fingerprint.indexedDB = true
} else {
  fingerprint.indexedDB = false
}

//WebGL
const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl")
const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
fingerprint.webGLvendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
fingerprint.webGLrenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

//counting all the properties in navigator object
for(var property in navigator){ 
    fingerprint.navigatorPropertiesCount += 1
}

function isLocalStorageAvailable(){
  var test = 'test';
  try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
  } catch(e) {
      return false;
  }
}

function isSessionStorageEnabled(){
  try {
    const key = `__storage__test`;
    window.sessionStorage.setItem(key, null);
    window.sessionStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

fingerprint.localStorageAvailable = isSessionStorageEnabled()
fingerprint.sessionStorageAvailable = isSessionStorageEnabled()

//get supported audio formats
function supportsAudioType(type) {
  let audio;

  let formats = {
    mp3: 'audio/mpeg',
    mp4: 'audio/mp4',
    aif: 'audio/x-aiff'
  };

  if(!audio) {
    audio = document.createElement('audio')
  }

  return audio.canPlayType(formats[type] || type);
}

fingerprint.supportedAudioFormats.mp3 = supportsAudioType("mp3")
fingerprint.supportedAudioFormats.mp4 = supportsAudioType("mp4")
fingerprint.supportedAudioFormats.aif = supportsAudioType("aif")

//get supported video formats
function supportsVideoType(type) {
  const formats = {
    ogg: 'video/ogg; codecs="theora"',
    ogg2: 'video/ogg; codecs="opus"',
    h264: 'video/mp4; codecs="flac"',
    webm: 'video/webm; codecs="vp8, vorbis"',
    vp9: 'video/webm; codecs="vp9, opus"',
    hls: 'application/x-mpegURL; codecs="flac"'
  };

  const video = document.createElement('video');
  return video.canPlayType(formats[type] || type);
}

fingerprint.supportedVideoFormats.ogg = supportsVideoType("ogg")
fingerprint.supportedVideoFormats.ogg2 = supportsVideoType("ogg2")
fingerprint.supportedVideoFormats.h264 = supportsVideoType("h264")
fingerprint.supportedVideoFormats.webm = supportsVideoType("webm")
fingerprint.supportedVideoFormats.vp9 = supportsVideoType("vp9")
fingerprint.supportedVideoFormats.hls = supportsVideoType("hls")

//detect if gyroscope is present
window.addEventListener("devicemotion", function(event){
    if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
        fingerprint.gyroscope = true;
});

//detect virtual machine (not reliable but it is something)
function vmDetect(){ 
  var o = new ActiveXObject("WbemScripting.SWbemLocator");
  var s = o.ConnectServer(strServer = ".");
  var a = s.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration");
  var e = new Enumerator(a);
  var mac = [];
  var regex = /(00:50:56).*/; 

  for (;!e.atEnd();e.moveNext()){ 
      var x = e.item();
      if(x.MACAddress){
          mac[mac.length] = x.MACAddress; 
      }
  }
  for (var i=0; i<mac.length; i++) {
      if (mac[i].match(regex)) {
          fingerprint.vmScore += 0.5;
          break;
      }
  }
}
if (fingerprint.webGLrenderer.includes("Google SwiftShader") || fingerprint.webGLrenderer.includes("llvmpipe")){
  fingerprint.vmScore += 0.3
}
fingerprint.mediaDevices.every((device) => {
  if(device.label.includes("VirtualBox")){
    fingerprint.vmScore += 0.5
    return;
  }
});

console.log(fingerprint)

let xhr = new XMLHttpRequest()
xhr.open("POST", "http://127.0.0.1:5000/api/data")
xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify(fingerprint))
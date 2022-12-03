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
    webGLvendor : null,
    webGLrenderer : null,
    localStorageAvailable : null,
    sessionStorageAvailable : null,
    indexedDB : null,
    supportedAudioFormats : {
        
    }
}

//retrieve permissions 
navigator.permissions.query({name:'geolocation'}).then(permission => {
  if(permission.state === "granted"){
    fingerprint.permissions.geolocation = "granted"
  } else if (permission.state === "prompt"){
    fingerprint.permissions.geolocation = "prompt"
  } else if (permission.state === "denied"){
    fingerprint.permissions.geolocation = "denied"
  }
  console.log(fingerprint.permissions.geolocation)
});

navigator.permissions.query({name:'notifications'}).then(permission => {
  if(permission.state === "granted"){
    fingerprint.permissions.notifications = "granted"
  } else if (permission.state === "prompt"){
    fingerprint.permissions.notifications = "prompt"
  } else if (permission.state === "denied"){
    fingerprint.permissions.notifications = "denied"
  }
  console.log(fingerprint.permissions.notifications)
});

navigator.permissions.query({name:'persistent-storage'}).then(permission => {
  if(permission.state === "granted"){
    fingerprint.permissions.persistentStorage = "granted"
  } else if (permission.state === "prompt"){
    fingerprint.permissions.persistentStorage = "prompt"
  } else if (permission.state === "denied"){
    fingerprint.permissions.persistentStorage = "denied"
  }
  console.log(fingerprint.permissions.notifications)
});

navigator.permissions.query({name:'push'}).then(permission => {
  if(permission.state === "granted"){
    fingerprint.permissions.push = "granted"
  } else if (permission.state === "prompt"){
    fingerprint.permissions.push = "prompt"
  } else if (permission.state === "denied"){
    fingerprint.permissions.push = "denied"
  }
  console.log(fingerprint.permissions.notifications)
});

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

console.log(fingerprint.indexedDB)

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


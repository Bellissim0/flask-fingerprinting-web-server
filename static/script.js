let fingerprint = {
    platform : null,
    isCookiesEnabled : null,
    timezone : null,
    preferredLanguages : null,
    adblockEnabled : null,
    doNotTrack : null,
    navigatorPropertiesCount : null,
    buildID : null,
    product : null,
    productSub : null,
    vendor : null

}
fingerprint.platform = window.navigator.platform;
fingerprint.isCookiesEnabled = window.navigator.cookieEnabled;
fingerprint.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
fingerprint.preferredLanguages = navigator.language || navigator.userLanguage;
fingerprint.doNotTrack = navigator.doNotTrack
fingerprint.buildID = navigator.buildID
fingerprint.product = navigator.product
fingerprint.productSub = navigator.productSub
fingerprint.vendor = navigator.vendor

//counting all the properties in navigator object
for(var property in navigator){ 
    fingerprint.navigatorPropertiesCount += 1
}
console.log(fingerprint.product)



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


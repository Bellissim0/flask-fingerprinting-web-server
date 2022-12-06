# flask-fingerprinting-web-server
 
Web server's main job is to retrieve the client's fingerprint and send it to the api server to store it.

Main fingerprint objects are retrieved by navigator object, screen mediaDevices and WebGL while for others, some tests are done (like adblocker and session/localStorage)

A score for VM Detection is calculated (frontend for time reasons) via MAC Address, mediaDevices analysis and check if 3D graphics is present or not

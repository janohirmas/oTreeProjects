// Load Requirements
const bRequireFS      = js_vars.bRequireFS;
const bCheckFocus     = js_vars.bCheckFocus;

if (bRequireFS) {
  // Create input iFullscreenChange
  var iFullscreenChange       = document.createElement("input");
  iFullscreenChange.type      = 'hidden';
  iFullscreenChange.name      = 'iFullscreenChange';
  iFullscreenChange.id        = 'iFullscreenChange';
  iFullscreenChange.value     = 0;
}
if (bCheckFocus) {
  // Create input iFocusLost
  var iFocusLost        = document.createElement("input");
  iFocusLost.type       = 'hidden';
  iFocusLost.name       = 'iFocusLost';
  iFocusLost.id         = 'iFocusLost';
  iFocusLost.value      = 0;
  // Create input dFocusLostT
  var dFocusLostT        = document.createElement("input");
  dFocusLostT.type       = 'hidden';
  dFocusLostT.name       = 'dFocusLostT';
  dFocusLostT.id         = 'dFocusLostT';
  dFocusLostT.value      = 0;
  // Create input Create Timer variables
  var TBlur       = new Date().getTime();
  var TFocus      = new Date().getTime();
}


// Initialize Elements
document.addEventListener("DOMContentLoaded", function() {
  // If Fullscreen is required
  if (bRequireFS) {
    GameBody.appendChild(iFullscreenChange);
    CreateFullScreenPopUp();
    CheckFS();
    // Event Listener for changing screen size
    window.addEventListener('resize',  CheckFS);
  }
  // If CheckFocus is required
  if (bCheckFocus) {
    GameBody.appendChild(iFocusLost);
    GameBody.appendChild(dFocusLostT);
    // Event Listener for gaining and losing focus on the page
    window.addEventListener('blur', pause);
    window.addEventListener('focus', play);
  }


});



var elem = document.documentElement;
var FullscreenActive = false; 
// ----------------------------------------------------- //
//  Function:       1. Starts recording a pausing timer
//                  2. Adds 1 to the LossFocusCounter
// ----------------------------------------------------- //
function pause() {
  console.log('FOCUS LOST!');
  iFocusLost.value  = +iFocusLost.value+1;
  TBlur             = new Date().getTime();
}
// ----------------------------------------------------- //
//  Function:       1. Stops recording a pausing timer
//                  2. 
// ----------------------------------------------------- //
function play() {
  TFocus            = new Date().getTime();
  console.log('Focus back');
  let dt            = TFocus-TBlur;
  dFocusLostT.value = +dFocusLostT.value+dt;
}

// ----------------------------------------------------- //
//  Function:       1. Check if Fullscreen
//                  2. Display Fullscreen Pop-up Warning
// ----------------------------------------------------- //

function CheckFS() {
  console.log("Checking fullscreen");
  let PopUp = document.getElementById('fs-popup');
  let PopUpText = document.getElementById('fs-popup-text');
  if (window.innerHeight==screen.height ) {
    // Dissappear Screen and Text
    console.log('FullScreen');
    PopUp.style.visibility          = 'hidden';
    PopUp.style.zIndex              = -1;

  } else {
    // Make cover and text visible
    console.log('Not FullScreen');
    iFullscreenChange.value         = +iFullscreenChange.value+1; 
    PopUp.style.visibility          = 'visible';
    PopUp.style.zIndex              = 100;
  }
};

// ----------------------------------------------------- //
//  Function:       1. Create FullScreen Pop-Up Warning
//                      with id='fs-popup'
// ----------------------------------------------------- //
function CreateFullScreenPopUp() {
  // Create Div fullscreen and Button 
  let PopUp                       = document.createElement('div');
  let PopUpText1                  = document.createElement('p');
  let PopUpText2                  = document.createElement('p');


  // Div Properties
  PopUp.id                        = 'fs-popup';
  // Include FullScreen Instructions
  PopUpText1.className             = 'fs-popup-text';
  PopUpText1.innerHTML             = 'Please set display to Full Screen.';
  
  PopUpText2.className             = 'fs-popup-text';
  switch (getOS()) {
    case 'Mac OS' : 
      PopUpText2.innerHTML             = 'Press ⌘+⇧+F'; 
      break;
    case 'Windows' :
      PopUpText2.innerHTML             = 'Press F11'; 
      break;
    case 'Linux' :
        PopUpText2.innerHTML             = 'Press F11'; 
        break;
  };

  PopUp.appendChild(PopUpText1);
  PopUp.appendChild(PopUpText2);
  document.body.appendChild(PopUp);
  // console.log('PopUp Added');
}
// ----------------------------------------------------- //
//  Function:       Determines Operative System:
//                  Mac OS
//                  iOS
//                  Windows
//                  Android
//                  Linux
// ----------------------------------------------------- //
function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}
// ----------------------------------------------------- //
//  Initialize the game adding visual tracing properties
//  to the respective buttons. 
// ----------------------------------------------------- //

// Create Necessary variables
let sPreviousPress  = 'Start';
let dPreviousTime   = new Date().getTime();
let now             = new Date().getTime();
let StartTime       = new Date().getTime();
let diff            = 0;

// Create hidden input (Pressed Buttons)
let sButtonClick        = document.createElement("input");
sButtonClick.type       = 'hidden';
sButtonClick.name       = 'sButtonClick';
sButtonClick.id         = 'sButtonClick';
sButtonClick.value      = '';

// Create hidden input (Time Buttons)
let sTimeClick   = document.createElement("input");
sTimeClick.type  = 'hidden';
sTimeClick.name  = 'sTimeClick';
sTimeClick.id    = 'sTimeClick';
sTimeClick.value = '';

// Create hidden input (Decision)
let dRT         = document.createElement("input");
dRT.type       = 'hidden';
dRT.name       = 'dRT';
dRT.id         = 'dRT';
dRT.value      = '';


// ----------------------------------------------------- //
//  Function:    Display Contents from a specific class  
//  Inputs:
//    - DisplayClass    : String, class combination that will be activated
// ----------------------------------------------------- //
function DisplayContent(DisplayClass) {
    let x = document.getElementsByClassName(DisplayClass);
    for(let i = 0; i<x.length; i++) {
      x[i].classList.remove('hidden');
      x[i].classList.add('non-hidden');
    }
  };
  
  // ----------------------------------------------------- //
  //  Function:     Hide all elements in the table  
  // ----------------------------------------------------- //
  
  function HideEverything() {
    let x = document.getElementsByClassName("button-outcome");
    // console.log(x);
    for(let i = 0; i<x.length; i++) {
      x[i].classList.remove('non-hidden');
      x[i].classList.add('hidden');
    }
  };
// ----------------------------------------------------- //
//  Function:       1. Adds OnClick or Mouseover/Mouseout  
//                  2. Records Times and Clicks Accordingly
//  Inputs:
//    - btn             : Target button, where evenlistener will be added 
//    - sActivation     : String, activation method for button
//    - DisplayClass    : String, class combination that will be activated
// ----------------------------------------------------- //

function AddVisualTracer(btn,sActivation,DisplayClass) {      
  if (sActivation=='click') {
    // If click
    btn.addEventListener('click', function() {
      // Check it's not double click
      if (btn.id != sPreviousPress) {
          // Record new time
          now = new Date().getTime();
          // display specific content and hide rest
          HideEverything();
          DisplayContent(DisplayClass);
          // record button pressed  
          if (sButtonClick.value) {
            sButtonClick.value = sButtonClick.value+';'+btn.id;
          } else {
            sButtonClick.value = btn.id;
          };
          // change previous to new
          sPreviousPress = btn.id;
          //console.log(sButtonClick.value);
        
        // Check if there was lost of focus
        if (typeof bCheckFocus !== 'undefined' && bCheckFocus==true && TBlur>=dPreviousTime) {
          // substract the blurred time
          diff = (now-dPreviousTime)-(TFocus-TBlur);
        } else {
          diff = (now-dPreviousTime);
        }
        // Add Time
        if (sTimeClick.value) {
          sTimeClick.value = sTimeClick.value+';'+ diff;
        } else {
          sTimeClick.value = diff;
        };
        // Replace previous time
        dPreviousTime = now;
      }
      //console.log(sTimeClick.value);  
    });
    
  } else if (sActivation=='mouseover') {
    // mouseover
    btn.addEventListener('mouseover', function() {
      // Check that new element is pressed
      if (btn.id != sPreviousPress) {
        // Record new time
        dPreviousTime = new Date().getTime();
        // display specific content and hide rest
        HideEverything();
        DisplayContent(DisplayClass);
        
        // record button pressed  
        if (sButtonClick.value) {
          sButtonClick.value = sButtonClick.value+';'+btn.id;
        } else {
          sButtonClick.value = btn.id;
        };
        // change previous to new
        sPreviousPress = btn.id;
        //console.log(sButtonClick.value);
      }
    });
    // Mouseout
    btn.addEventListener('mouseout', function() {
      // Record Event Time
      now   = new Date().getTime();
      // Hide the content & Reset previous item
      sPreviousPress = ' ';
      HideEverything();
      // Check if there is focus checks
      if (typeof bCheckFocus !== 'undefined' && bCheckFocus==true && TBlur>=dPreviousTime) {
        // substract the blurred time
        diff = (now-dPreviousTime)-(TFocus-TBlur);
      } else {
        diff = (now-dPreviousTime);
      }
      // Add Time
      if (sTimeClick.value) {
        sTimeClick.value = sTimeClick.value+';'+ diff;
      } else {
        sTimeClick.value = diff;
      };
      //console.log(sTimeClick.value);  
  });
} else {
  console.log('"'+sActivation+'"'+' is not a valid Activation method')
}

};
    // Constants
    const OtreeBody     = document.getElementsByClassName("_otree-content")[0];
    const TablePaddingV = js_vars.TablePaddingV;
    const TablePaddingH = js_vars.TablePaddingH;
    const iTimeOut      = js_vars.iTimeOut;
    const vColNames     = js_vars.vColnames;
    const vRowNames     = js_vars.vRownames;
    // O-tree variables
    let sActivation     = js_vars.sActivation;
    let vTrigger        = js_vars.vTrigger.split(',');
    let Attr_order      = js_vars.Attr_order;
    let vOutcomes       = js_vars.vOutcomes.split(',');


    // Time and Click variables
    let sPreviousPress  = 'Start';
    let dPreviousTime   = new Date().getTime();
    let now             = new Date().getTime();
    let StartTime       = new Date().getTime();
    let diff            = 0;
    console.log(vOutcomes);
    console.log(vColNames);
    console.log(vRowNames);
    // record time of pressing

    // Create hidden input (Decision)
    let iDec        = document.createElement("input");
    iDec.type       = 'hidden';
    iDec.name       = 'iDec';
    iDec.id         = 'iDec';
    iDec.value      = '';

    
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
    
    // Hidden Next Button
    let EndButton               = document.createElement('button');
    EndButton.style.visibility  = 'hidden';
    EndButton.className         = 'next_button btn btn-primary btn-large';
    // Game-Wrapper
    let GameBody        = document.createElement('div');
    GameBody.className  = 'game-body';

    // Create hidden input (Decision)
    let dRT         = document.createElement("input");
    dRT.type       = 'hidden';
    dRT.name       = 'dRT';
    dRT.id         = 'dRT';
    dRT.value      = '';

    // Create Table during Page loading
    document.addEventListener("DOMContentLoaded", function(debug=true) {
      OtreeBody.appendChild(GameBody);
      // Include Table
      CreateTable(vOutcomes,TableId='T',TableClass='gametable',sActivation,vTrigger,vRowNames,vColNames,DecID = 'iDec');

      // Include inputs
      GameBody.appendChild(sButtonClick);
      GameBody.appendChild(sTimeClick);
      GameBody.appendChild(dRT);
      GameBody.append(EndButton);
      // Start Timer
      if (iTimeOut>0) {
        console.log('Time-out limit set to: '+iTimeOut);
        setTimeout(OutOfTime, iTimeOut*1000);
      } else if (iTimeOut==0) {
        // Do Nothing
        console.log('No Time-out limit');
      } else {
        console.log(iTimeOut+' is not correctly defined');
      }
      // Correct Table Sizes
      CheckOverflow('button-game'); 
      //    
      let x = document.getElementById('T').getElementsByTagName('button');
      for (let j=0; j<x.length; j++) {
        x[j].style.cursor = 'default'; 
      }
    });

    
    // ----------------------------------------------------- //
    // Function:          Set up Table initial dimensions
    // Inputs:
    //   - vColNames :    array of strings with Column ColNames
    //   - vRowNames :    array of strings with Row Names
    // ----------------------------------------------------- //
    function InitialDimensions(vColNames,vRowNames) {
      // Number of columns and rows for the table
      iRow  = vRowNames.length +2; // + header and choice buttons
      iCol  = vColNames.length +1; // + rowName column
      // Get Screen Dimensions
      
    }

    // ----------------------------------------------------- //
    //  Function:   Create Decision button
    //  Inputs:
    //    - Cell        : Target cell, where button is going to be Added 
    //    - ButtonClass : String, list of classes for button
    //    - DecID       : String 
    //    - ButtonValue : String
    //    - ButtonName  : String
    // ----------------------------------------------------- //
    function CellDecisionButton(Cell,ButtonClass='',DecID='',ButtonValue='',ButtonName='') {
      let btn       = document.createElement('button');
      btn.className = ButtonClass;
      btn.id        = DecID+ButtonName;
      btn.value     = ButtonValue;
      btn.innerHTML = ButtonName;
      btn.name      = DecID;
      btn.addEventListener('click', FinalizeTrial);
      Cell.appendChild(btn);
    }
    // ----------------------------------------------------- //
    //  Function:   1.  Create button in HTML with the relevant  
    //                  properties.
    //              2.  Include Visual Tracing function depending 
    //                  on activation method  
    //  Inputs:
    //    - Cell            : Target cell, where button is going to be Added 
    //    - vTriggerLabels  : array of strings, contains the IDs of buttons that can be activated
    //    - ButtonClass     : String, list of classes for button
    //    - DecID           : String 
    //    - ButtonValue     : String
    //    - DisplayClass    : String, class combination that will be activated
    //    - sActivation     : String, activation method for button
    // ----------------------------------------------------- //
    function CellButton(Cell, vTriggerLabels, ButtonClass='',ButtonID='',ButtonValue='',DisplayClass='',sActivation='click') {
      // Create Button and apply characteristics
        let btn       = document.createElement('button');
        btn.type      = "button";
        btn.className = ButtonClass;
        btn.id        = ButtonID;
        btn.value     = ButtonValue;
        CheckImage(btn, ButtonValue);
        
        if (vTriggerLabels.includes(btn.id)) {
          AddVisualTracer(btn,sActivation,DisplayClass);
        };
        Cell.appendChild(btn);
    };
    // ----------------------------------------------------- //
    //  Function:       1. Looks at string value and detects form "img:Name"  
    //                  2. In case of image, replaces value for image Tag
    //                  3. Adds cleaned value to button 
    //  Inputs:
    //    - btn      : Target button, where evenlistener will be added 
    //    - sValue   : String, value
    function CheckImage(btn,sValue) {
        // Check if Image:
        
        if (sValue.substring(0, 4)=='img:') {
          //console.log(btn.id+' is image')
          let ButtonImage = document.createElement('img');
          ButtonImage.src = '/static/EcoLabels/'+sValue.substring(4);
          ButtonImage.className = 'button-img'
          btn.appendChild(ButtonImage);
          return 
        } else {
          //console.log(btn.id+' is other')
          btn.innerHTML = sValue;
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
    //  Function:   Print Table on HTML
    //  Inputs:
    // - vOutcomes    :   array of strings with values for the table.
    //                    Values stacked by rows (r1c1,r1c2...r2c1,r2c2...)
    // - TableId      :   String
    // - TableClass   :   String, all classes for table
    // - sActivation  :   String, activation method for button
    // - vTrigger     :   array of strings with values type 
    //                    of buttons that get activated
    //                    (val,row,col)
    // - vRowNames    :   array of strings with Row Names
    // - vColNames    :   array of strings with Column ColNames
    // ----------------------------------------------------- //
    function CreateTable(vOutcomes,TableId='',TableClass='',sActivation='click',vTrigger='val',vRownames=[],vColnames=[]) {
      
      // compile table
      let Outcomes = new GameTable(vOutcomes,vRownames.length,vColnames.length,vRownames,vColnames);
      // Import values
      let vValues = Outcomes.Table;
      let iRow = Outcomes.Rows;
      let iCol = Outcomes.Columns;
      let vColNames = Outcomes.ColNames;
      let vRowNames = Outcomes.RowNames;
      
      // Create list of elements that trigger changes
      let vTriggerLabels = TriggerLabels(vTrigger,TableId,vColNames,vRowNames);
      // Create relevant elements
      let table = document.createElement('table');
      if (TableId) {
        table.id = TableId;
      };
      if (TableClass) {
        let vClasses = TableClass.split(' ')
        vClasses.forEach(element => {
          table.classList.add(element);
        });
      }
      let row = table.insertRow(0);
      row.classList.add('game-element');
      let cell = row.insertCell(0);
      cell.classList.add('game-element');
      // Fill header
      for (j=0; j<iCol; j++) {
        cell = row.insertCell(j+1);
        cell.classList.add('game-element');
        //console.log(vTriggerLabels.includes(TableId+'C'+vColNames[j]));
        CellButton(cell,vTriggerLabels,'button-game button-action',TableId+'C'+j.toString(),vColNames[j],'Gcol-'+j+' tab-'+TableId,sActivation)
      }
      // Fill Rows
      for (i=0;i<iRow;i++) {
        row = table.insertRow(i+1);
        row.classList.add('game-element');
        cell = row.insertCell(0);
        cell.classList.add('game-element');
        outcomes = vValues.slice(iCol*i,iCol*(i+1));
        // console.log(vValues + ' - ' + outcomes);
        // Add Row Name
        CellButton(cell,vTriggerLabels,'button-game button-action',TableId+'R'+i.toString(),vRowNames[i],'Grow-'+i+' tab-'+TableId,sActivation)
    
        // go through col values
        for (j=0; j<iCol; j++) {
          cell = row.insertCell(j+1);
          cell.classList.add('game-element');
          // console.log(outcomes[j]);
          CellButton(cell,vTriggerLabels,'button-game button-outcome Grow-'+i+' Gcol-'+j+' tab-'+TableId,TableId+'R'+i.toString()+'C'+j.toString(),outcomes[j],'Gcol-'+j+' Grow-'+i,sActivation)
          
        }
      }
      // Insert Decision buttons
      row = table.insertRow(iRow+1);
      row.style.height = '10vh';
      row.style.lineHeight = '10vh';
      row.style.textAlign = 'center';
      row.classList.add('game-element');

      cell = row.insertCell(0);
      cell.classList.add('game-element');

      for (j=0; j<iCol; j++) {
        cell = row.insertCell(j+1);
        cell.classList.add('game-element');

        CellDecisionButton(cell,ButtonClass='btn btn-primary btn-large',DecID=DecID,ButtonValue=j,ButtonName=vColNames[j])
      }
      // Append Table to document
      GameBody.appendChild(table);
    }
    
    // ----------------------------------------------------- //
    //  Function:   1.  Compile inputs for the Table and make  
    //                  them readable for subsequent steps.
    //              2.  Notify if dimensions of the table or 
    //                  Col/Row names do not match.
    // ----------------------------------------------------- //

    function GameTable(vContent,iR,iC,vRowNames=[],vColNames=[]) {
        
      this.Table = vContent; 
      let length = vContent.length;
      // console.log(length);
      // Rows

      if (!iR && !iC) {
        let sqrt= Math.sqrt(length) ;
          if (Number.isInteger(sqrt)) {
              iC = sqrt;
              iR = sqrt;
            }
      }
      if (iR) {
          if (length%iR == 0) {
            if (!iC) {
                  iC = length/iR;
              };
          } else {
            console.log('Rows do not fit in table');
          };
      };
      // Columns
      if (iC) {
          if (length%iC == 0) {
              if (!iR) {
                  iR = length/iC;
              };
            } else {
              console.log('Columns do not fit in table');
          };
        };
      
      // Check both match 
      if (length/(iR*iC)!=1) {
          console.log('Dimensions do not match');
      }
      this.Rows = iR;
      this.Columns = iC;
      const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      
      if (vColNames) {
          this.ColNames = vColNames;
        } else {
          this.ColNames = ABC.slice(-iC);
      }
      if (vRowNames) {
          this.RowNames = vRowNames;
      } else {
          this.RowNames = ABC.slice(0,iR);
        }
  };
  
    // ----------------------------------------------------- //
    //  Function:     Creates List of triggering buttons   
    // ----------------------------------------------------- //
    function TriggerLabels(vTrigger,TableId,vColNames,vRowNames) {
      
      let vTriggerLabels = [];
      let value = '';
      // Include Columns
      if (vTrigger.includes('col')) { 
        // console.log('Columns Included');
        for(let j=0; j<vColNames.length; j++) {
          vTriggerLabels = vTriggerLabels.concat(TableId+'C'+j.toString());
        }
      }
      // Include Rows
      if (vTrigger.includes('row')) { 
        // console.log('Rows Included');
        for(let i = 0; i<vRowNames.length; i++) {
          vTriggerLabels = vTriggerLabels.concat(TableId+'R'+i.toString());
        }
      }
      // Include Values
      if (vTrigger.includes('val')) { 
        // console.log('Values Included');
        for(let i = 0; i<vRowNames.length; i++) {
          for(let j = 0; j<vColNames.length; j++) {
            vTriggerLabels = vTriggerLabels.concat(TableId+'R'+i.toString()+'C'+j.toString());
          }
        }
      }
      return vTriggerLabels;
    }
      // ----------------------------------------------------- //
      // Function:          Wrap-up the game when finished
      // ----------------------------------------------------- //
    
      function OutOfTime() {
        iDec.value      = '99';
        dRT.value       = +iTimeOut*1000;
        EndButton.click();
      }
    
      // ----------------------------------------------------- //
      // Function:          Save Final Variables when submitting
      // ----------------------------------------------------- //
    
      function FinalizeTrial() {
        let FinalTime       = new Date().getTime();
        dRT.value           = FinalTime - StartTime;
      }

      // ----------------------------------------------------- //
      // Function:          1. Check Overflow
      //                    2. Adjust Size Accordingly
      // ----------------------------------------------------- //
    
      function CheckOverflow(ClassName) {
        // Collect all items
        let vButtons      = document.getElementsByClassName(ClassName);
        let ScreenWidth   = window.innerWidth;
        let ScreenHeight  = window.innerHeight;
        let iRows         = vRowNames.length+2;
        let iCols         = vColNames.length+1;
        let PadV          = TablePaddingV.substr(0,TablePaddingV.length-2)*ScreenHeight/100;
        let PadH          = TablePaddingH.substr(0,TablePaddingH.length-2)*ScreenWidth/100;
        let minWidth      = 0;
        let minHeight     = 0;
        let minSqSize     = 0;
        let maxSqSize     = Math.max(
          0.8*ScreenHeight/(iRows)-PadV,
          0.8*ScreenWidth/(iCols)-PadH
        );
        // Check Min Heights and Widths
        for (i=0;i<vButtons.length;i++) {
          // Check Height
          let btnOF = vButtons[i];
          if  (btnOF.scrollHeight > btnOF.offsetHeight) {
            console.log(btnOF.id+' has vertical overflow');
            minHeight = btnOF.scrollHeight+5;
          };
          // Check Width
          let btn = vButtons[i];
          if  (btnOF.scrollWidth > btnOF.offsetWidth) {
            console.log(btnOF.id+' has horizontal overflow');
            minWidth = btnOF.scrollWidth+5;
          };
        };
        // First, we see if the having square buttons can still work
        minSqSize = Math.max(minWidth,minHeight);
        
        if (minSqSize<=maxSqSize && minSqSize!=0) {
          // resize tr,td,th
          let x = document.getElementsByClassName('game-element')
          for (i=0;i<x.length;i++) {
            x[i].style.width  = (minSqSize+PadH+0.1)+'px';
            x[i].style.height = (minSqSize+PadV+0.1)+'px';
          };
          // resize buttons
          for (i=0;i<vButtons.length;i++) {
            vButtons[i].style.width  = (minSqSize)+'px';
            vButtons[i].style.height = (minSqSize)+'px';
          };
        }

      }
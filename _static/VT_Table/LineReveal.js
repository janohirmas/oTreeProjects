    // Create relevant variables and Inputs
    var GameBody        = document.getElementsByClassName("game-body")[0];
    let sPreviousPress  = 'Start';
    let dPreviousTime   = new Date().getTime();
    let sActivation     = js_vars.sActivation;
    let vTrigger        = js_vars.vTrigger.split(',');
    let Attr_order      = js_vars.Attr_order;
    let vOutcomes       = js_vars.vOutcomes.split(',');
    let vColNames       = js_vars.vColnames;
    let vRowNames       = js_vars.vRownames;
    const TablePaddingV = js_vars.TablePaddingV;
    const TablePaddingH = js_vars.TablePaddingH;
    console.log(vOutcomes);
    console.log(vColNames);
    console.log(vRowNames);
    // record time of pressing
    var now   = new Date().getTime();
    var diff  = 0;

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
    

    // Create Table during Page loading
    document.addEventListener("DOMContentLoaded", function(debug=true) {
      
      // Include Table
      CreateTable(vOutcomes,TableId='T',TableClass='gametable',sActivation,vTrigger,vRowNames,vColNames,DecID = 'iDec');
      let x = document.getElementById('T').getElementsByTagName('button');
      for (let j=0; j<x.length; j++) {
        x[j].style.cursor = 'default'; 
      }
      // Include inputs
      GameBody.appendChild(sButtonClick);
      GameBody.appendChild(sTimeClick);
    });
    
    

    // ----------------------------------------------------- //
    //  Function:   Create Decision button
    // ----------------------------------------------------- //
    function CellDecisionButton(Cell,ButtonClass='',DecID='',ButtonValue='',ButtonName='') {
      let btn       = document.createElement('button');
      btn.className = ButtonClass;
      btn.id        = DecID+ButtonName;
      btn.value     = ButtonValue;
      btn.innerHTML = ButtonName;
      btn.name      = DecID;
      Cell.appendChild(btn);
    }
    // ----------------------------------------------------- //
    //  Function:   1.  Create button in HTML with the relevant  
    //                  properties.
    //              2.  Include Visual Tracing function depending 
    //                  on activation method  
    // ----------------------------------------------------- //
    function CellButton(Cell, vTriggerLabels, ButtonClass='',ButtonID='',ButtonValue='',DisplayClass='',sActivation='click') {
        // Create Button and apply characteristics
        let btn = document.createElement('button');
        btn.type = "button";
        btn.className = ButtonClass;
        btn.id = ButtonID;
        btn.value = ButtonValue;
        btn.innerHTML = ButtonValue;
        
        // EventListener functions
        
        if (vTriggerLabels.includes(btn.id)) {
          btn.addEventListener(sActivation, function() {
            // Check that new element is pressed
            if (btn.id != sPreviousPress) {
              // Restart Initial Time
              now   = new Date().getTime();
              // display specific content
              HideEverything();
              DisplayContent(DisplayClass,ButtonValue);
        
              // record button pressed  
              if (sButtonClick.value) {
                sButtonClick.value = sButtonClick.value+','+ButtonID;
              } else {
                sButtonClick.value = ButtonID;
              };
              // change previous to new
              sPreviousPress = btn.id;
              dPreviousTime = now;
              console.log(sButtonClick.value);
              
            }
          });
          btn.addEventListener('mouseout', function() {
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
              sTimeClick.value = sTimeClick.value+','+ diff;
            } else {
              sTimeClick.value = diff;
            };
              
            console.log(sTimeClick.value);

          });
        };
        
        Cell.appendChild(btn);
    };

    // ----------------------------------------------------- //
    //  Function:    Display Contents from a specific class  
    // ----------------------------------------------------- //

    function DisplayContent(Act,val='') {
      let x = document.getElementsByClassName(Act);
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
      let cell = row.insertCell(0);
    
      // Fill header
      for (j=0; j<iCol; j++) {
        cell = row.insertCell(j+1);
        //console.log(vTriggerLabels.includes(TableId+'C'+vColNames[j]));
        CellButton(cell,vTriggerLabels,'button-game button-action',TableId+'C'+j.toString(),vColNames[j],'Gcol-'+j+' tab-'+TableId,sActivation)
      }
      // Fill Rows
      for (i=0;i<iRow;i++) {
        row = table.insertRow(i+1);
        cell = row.insertCell(0);
        outcomes = vValues.slice(iCol*i,iCol*(i+1));
        // console.log(vValues + ' - ' + outcomes);
        // Add Row Name
        CellButton(cell,vTriggerLabels,'button-game button-action',TableId+'R'+i.toString(),vRowNames[i],'Grow-'+i+' tab-'+TableId,sActivation)
    
        // go through col values
        for (j=0; j<iCol; j++) {
          cell = row.insertCell(j+1);
          // console.log(outcomes[j]);
          CellButton(cell,vTriggerLabels,'button-game button-outcome Grow-'+i+' Gcol-'+j+' tab-'+TableId,TableId+'R'+i.toString()+'C'+j.toString(),outcomes[j],'Gcol-'+j+' Grow-'+i,sActivation)
          
        }
      }
      // Insert Decision buttons
      row = table.insertRow(iRow+1);
      row.style.height = '10vh';
      row.style.lineHeight = '10vh';
      row.style.textAlign = 'center';
      cell = row.insertCell(0);
      for (j=0; j<iCol; j++) {
        cell = row.insertCell(j+1);
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
//set vectors
let numbers = js_vars.sorted_string;
let vButtons = document.getElementsByClassName('game-button');    

//set constants
let correct = document.getElementById("correcttables");
let numberofclicks =0;
let dSum =0;
var round = 0;

document.addEventListener("DOMContentLoaded", function(debug=true) {
    //define variables
    let body = document.getElementsByClassName("otree-body")[0];
    
    //Hidden Next Button
    let EndButton               = document.getElementsByClassName('otree-btn-next btn btn-primary')[0];
    EndButton.style.visibility  = 'hidden';   

    for (i = 0; i < vButtons.length; i++) {
        let button = vButtons[i];
        
        //set first round
        if (round == 0) {
            n1 = numbers.split("[")[1].split(",")[round]
            n2 = numbers.split("[")[2].split(",")[round]
            n3 = numbers.split("[")[3].split(",")[round]
            n4 = numbers.split("[")[4].split(",")[round]
            n5 = numbers.split("[")[5].split(",")[round]
            n6 = numbers.split("[")[6].split(",")[round]
            n7 = numbers.split("[")[7].split(",")[round]
            n8 = numbers.split("[")[8].split(",")[round]
            n9 = numbers.split("[")[9].split(",")[round]
            n10 = numbers.split("[")[10].split(",")[round]
            n11 = numbers.split("[")[11].split(",")[round]
            n12 = numbers.split("[")[12].split(",")[round]
        } 

        //read values to table
        document.getElementById("button1").textContent = n1;
        document.getElementById("button2").textContent = n2;
        document.getElementById("button3").textContent = n3;
        document.getElementById("button4").textContent = n4;
        document.getElementById("button5").textContent = n5;
        document.getElementById("button6").textContent = n6;
        document.getElementById("button7").textContent = n7;
        document.getElementById("button8").textContent = n8;
        document.getElementById("button9").textContent = n9;
        document.getElementById("button10").textContent = n10;
        document.getElementById("button11").textContent = n11;
        document.getElementById("button12").textContent = n12;

        document.getElementById("button1").value = n1;
        document.getElementById("button2").value = n2;
        document.getElementById("button3").value = n3;
        document.getElementById("button4").value = n4;
        document.getElementById("button5").value = n5;
        document.getElementById("button6").value = n6;
        document.getElementById("button7").value = n7;
        document.getElementById("button8").value = n8;
        document.getElementById("button9").value = n9;
        document.getElementById("button10").value = n10;
        document.getElementById("button11").value = n11;
        document.getElementById("button12").value = n12;

        //define what happens when button is clicked
        button.addEventListener("click", function buttonfunction(){
            button.style.background='#696969';
            dSum = + dSum + Number(button.value);
            numberofclicks = numberofclicks +1;

            //if 2 numbers are clicked, check if they sum to 10
            if (numberofclicks==2){
                if (dSum==10) {
                    
                    //if numbers sum to 10, correct =1 and round +1
                    if (correct ="") {
                        correct = +1;
                    } else{
                    correct ++;
                    round ++;
                    }
                                             
                    //define table again
                    n1 = numbers.split("[")[1].split(",")[round]
                    n2 = numbers.split("[")[2].split(",")[round]
                    n3 = numbers.split("[")[3].split(",")[round]
                    n4 = numbers.split("[")[4].split(",")[round]
                    n5 = numbers.split("[")[5].split(",")[round]
                    n6 = numbers.split("[")[6].split(",")[round]
                    n7 = numbers.split("[")[7].split(",")[round]
                    n8 = numbers.split("[")[8].split(",")[round]
                    n9 = numbers.split("[")[9].split(",")[round]
                    n10 = numbers.split("[")[10].split(",")[round]
                    n11 = numbers.split("[")[11].split(",")[round]
                    n12 = numbers.split("[")[12].split(",")[round]
                        
                    document.getElementById("button1").textContent = n1;
                    document.getElementById("button2").textContent = n2;
                    document.getElementById("button3").textContent = n3;
                    document.getElementById("button4").textContent = n4;
                    document.getElementById("button5").textContent = n5;
                    document.getElementById("button6").textContent = n6;
                    document.getElementById("button7").textContent = n7;
                    document.getElementById("button8").textContent = n8;
                    document.getElementById("button9").textContent = n9;
                    document.getElementById("button10").textContent = n10;
                    document.getElementById("button11").textContent = n11;
                    document.getElementById("button12").textContent = n12;

                    document.getElementById("button1").value = n1;
                    document.getElementById("button2").value = n2;
                    document.getElementById("button3").value = n3;
                    document.getElementById("button4").value = n4;
                    document.getElementById("button5").value = n5;
                    document.getElementById("button6").value = n6;
                    document.getElementById("button7").value = n7;
                    document.getElementById("button8").value = n8;
                    document.getElementById("button9").value = n9;
                    document.getElementById("button10").value = n10;
                    document.getElementById("button11").value = n11;
                    document.getElementById("button12").value = n12;

                    //reset the button colors 
                    let x = document.getElementsByClassName("game-button");
                    for (j = 0; j < x.length; j++) {
                        x[j].style.background = "rgb(239, 239, 239)";
                    }

                    //save number of correct tables
                    document.getElementById("correcttables").value = round;
                    
                    //set numbers to 0 and continue to next round
                    numberofclicks = 0;
                    dSum = 0;

                    // } 
                    
                } else {
                    //if numbers do not sum to 10, reset colors and start again                    
                    setTimeout(function(){
                    let x = document.getElementsByClassName("game-button");
                        for (j = 0; j < x.length; j++) {
                            x[j].style.background = "rgb(239, 239, 239)";
                        }
                    },200);
                    numberofclicks = 0;
                    dSum = 0;
                }    

            }             
        
        });//end button click function

    } //end forloop

});
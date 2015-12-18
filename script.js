/*

press button
display number
add number to buffer




*/


var currentNumber; // current number being entered
var expression = []; // array that will store numbers and operators

var lastValueIsNumber = false; // was the last value entered a number


/**
 *
 */
function addNumber(value) {
  currentNumber += value;
  lastValueIsNumber = true;
  displayOutput()
}

function addOperator(operator) {
  if (lastValueIsNumber) {
    // add current number to expression array and clear it
    expression.push(currentNumber);
    currentNumber = "";

    // add operator to expression array
    expression.push(operator);
    lastValueIsNumber = false;
    displayOutput()
  }
}

function displayOutput() {
  var displayOutput = "";  // value that will be displayed in the output pane
  for (var i = 0; i < expression.length; i++) {
    displayOutput += expression[i] + " ";
  }
  displayOutput += currentNumber;
  displayOutput = displayOutput.trim();
  $("#display").text(displayOutput);
}


$(document).ready(function() {

  $(".number-btn").click(function(){
    addNumber( $(this).text() );
  });

  $(".operator-btn").click(function(){
    addOperator( $(this).text() );
  });

});

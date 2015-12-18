/*

press button
display number
add number to buffer







*/

const NUMBER = 1;
const OPERATOR = 2;
const EQUALS = 3;
var lastButton; // last button pressed

const ADD = "+";
const MULTIPLY = "\u00D7"; // unicode for multiplication sign
const DIVIDE = "\u00F7"; // unicode for division sign
const SUBTRACT = "\u2212"; // unicode for subtraction sign

var tempNumber = ""; // current number being entered
var tempOperator = ""; // current operation being entered
var expression = []; // array that will store numbers and operators
//var lastValueIsNumber = false; // was the last value entered a number



/**
 * Add number to epression array
 */
function addNumber(value) {
  if (lastButton === EQUALS) {
    expression = []; // remove only item from expression
  }
  else if (lastButton === OPERATOR) {
    expression.push(tempOperator);
    tempOperator = "";
  }
  tempNumber += value;
  lastButton = NUMBER;
  displayOutput()
}

/**
 * Add operator to expression array
 * - ensure you cannot have two operators beside one another
 */
function addOperator(operator) {
  if (lastButton === NUMBER) {
    // add current number to expression array and clear it
    expression.push(tempNumber);
    tempNumber = "";
  }
  tempOperator = operator;
  lastButton = OPERATOR;
  displayOutput();
}

function displayOutput() {
  var displayOutput = "";  // value that will be displayed in the output pane
  for (var i = 0; i < expression.length; i++) {
    displayOutput += expression[i] + " ";
  }
  // add temporary operator and number to display
  // only one of these two should ever be present at the same time
  displayOutput += tempOperator + tempNumber;
  displayOutput = displayOutput.trim();
  $("#display").text(displayOutput);
}

/**
 * Clear everything
 */
function clearEverything() {
  expression = [];      // clear expression
  tempNumber = "";   // clear current number
  tempOperator = ""; // clear current operator
  displayOutput();
}

/**
 * Clear entry
 */
function clearCurrentEntry() {
  tempNumber = ""; // clear current number
  tempOperator = ""; // clear current operator
  if (lastButton === OPERATOR) {
    lastButton === NUMBER; // so that you can re-enter a new operator
  }
  displayOutput();
}

function equals() {

  if (lastButton === NUMBER) { // if there is a current number, add it to array
    expression.push(tempNumber);
    tempNumber = ""; // empty current number
  }
  else if (lastButton === OPERATOR) { // last value is operator
    expression.pop(expression.length - 1); // remove operator from end of array
  }

  var answerTemp; // temporary answer

  // iterate through expression to perform multiplication and division
  for (var i = 0; i < expression.length - 1; i++) {
    // if division or multiplication sign, perform operation
    if (expression[i] === MULTIPLY || expression[i] === DIVIDE) {
      // perform operation
      answerTemp = performOperation(expression[i - 1], expression[i],
        expression[i + 1]);
      // remove current operator and two neighbouring values from array and
      // replace with their evaluation
      expression.splice(i-1, 3, answerTemp);
      i--; // move counter back one position to not skip next operator
    }
  }

  // iterate through expression to perform addition and subraction
  for (var i = 0; i < expression.length - 1; i++) {
    if (expression[i] === ADD || expression[i] === SUBTRACT) {
      // perform operation
      answerTemp = performOperation(expression[i - 1], expression[i],
        expression[i + 1]);
      // remove current operator and two neighbouring value from array and
      // replace with their evaluation
      expression.splice(i-1, 3, answerTemp);
      i--;
    }
  }

  // expression now has a length of 1 with only the final answer
  lastButton = EQUALS;
  displayOutput();
}

function performOperation(a, operator, b) {
  a = parseFloat(a); // parse number from string
  b = parseFloat(b);
  if (operator === ADD) {
    return a + b;
  }
  else if (operator === SUBTRACT) {
    return a - b;
  }
  else if (operator === MULTIPLY) {
    return a * b;
  }
  else if (operator === DIVIDE) {
    return a / b;
  }

};


$(document).ready(function() {

  $(".number-btn").click(function() {
    addNumber( $(this).text() );
  });

  $(".operator-btn").click(function() {
    addOperator( $(this).text() );
  });

  $("#clear-everything").click(clearEverything);

  $("#clear-entry").click(clearCurrentEntry);

  $("#equals").click(equals);

});

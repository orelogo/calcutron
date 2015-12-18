const ADD = "+";
const MULTIPLY = "\u00D7"; // unicode for multiplication sign
const DIVIDE = "\u00F7"; // unicode for division sign
const SUBTRACT = "\u2212"; // unicode for subtraction sign

var tempNumber = ""; // current number being entered
var tempOperator = ""; // current operation being entered
var expression = []; // array that will store numbers and operators
var lastStoredValueIsNumber = false; // last value saved to expression array

/**
 * Add number to epression array
 */
function addNumber(value) {
  // last stored value is a number and there is a temp operator currently
  if (lastStoredValueIsNumber && tempOperator.length === 1) {
    expression.push(tempOperator); // store operator
    tempOperator = "";
    lastStoredValueIsNumber = false;
  }

  // last stored value was an operator or if we cleared memory
  if (!lastStoredValueIsNumber) {
    tempNumber += value;
    displayOutput()
  }
}

/**
 * Add operator to expression array
 * - ensure you cannot have two operators beside one another
 */
function addOperator(operator) {

  // last stored value was an operator and there is a temp number currently
  if (!lastStoredValueIsNumber && tempNumber.length > 0) {
    expression.push(tempNumber); // store number
    tempNumber = "";
    lastStoredValueIsNumber = true;
  }

  // last stored value was a number
  if (lastStoredValueIsNumber) {
    tempOperator = operator;
    displayOutput();
  }
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
  lastStoredValueIsNumber = false;
  displayOutput();
}

/**
 * Clear entry
 */
function clearCurrentEntry() {
  tempNumber = ""; // clear current number
  tempOperator = ""; // clear current operator
  displayOutput();
}

function equals() {
  // if there is a temp number being display that we need to add to expression
  if (!lastStoredValueIsNumber && tempNumber.length > 0) {
    expression.push(tempNumber);
    tempNumber = "";
    lastStoredValueIsNumber = true;
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
      i--; // move counter back one position to not skip next operator
    }
  }

  /* expression now has a length of 1 with only the final answer */

  // store value in temp number; must be string to work with .length property
  tempNumber = expression[0].toString();
  expression = [];            // clear expression
  lastStoredValueIsNumber = false;
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

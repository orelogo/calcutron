const ADD = "+";
const MULTIPLY = "\u00D7"; // unicode for multiplication sign
const DIVIDE = "\u00F7"; // unicode for division sign
const SUBTRACT = "\u2212"; // unicode for subtraction sign

var tempNumber = ""; // current number being entered
var tempOperator = ""; // current operation being entered
var expression = []; // array that will store numbers and operators
var lastStoredValueIsNumber = false; // last value saved to expression array
var lastNumberStored, // allow user to keep pressing equals
    lastOperatorStored;

// if input buttons are active, will be changed to true when document loads
var inputButtonsAreActive = false;

/**
 * Store tempNumber into expression array and lastNumberStored variable.
 */
function storeNumber() {
  expression.push(tempNumber);
  lastNumberStored = tempNumber;
  tempNumber = "";
  lastStoredValueIsNumber = true;
}

/**
 * Store tempOperator into expression array and lastOperatorStored variable.
 */
function storeOperator() {
  expression.push(tempOperator); // store operator
  lastOperatorStored = tempOperator;
  tempOperator = "";
  lastStoredValueIsNumber = false;
}

/**
 * Print expression from array and temp variables to output pane.
 */
function displayOutput() {
  var displayOutput = "";  // value that will be displayed in the output pane
  for (var i = 0; i < expression.length; i++) {
    displayOutput += expression[i] + " ";
  }
  // add temporary operator and number to display
  // only one of these two should ever be present at the same time
  displayOutput += tempOperator + tempNumber;
  displayOutput = displayOutput.trim();
  if (displayOutput.length > 30) {
    displayOutput = "..." + displayOutput.slice(displayOutput.length - 27,
      displayOutput.length); //
  }
  $("#display").text(displayOutput);
}

/**
 * Add number to calculator display.
 * @param {string} value - Number to be added.
 */
function addNumber(value) {
  // last stored value is a number and there is a temp operator currently
  if (lastStoredValueIsNumber && tempOperator.length === 1) {
    storeOperator();
  }

  // last stored value was an operator or if we cleared memory
  if (!lastStoredValueIsNumber) {
    tempNumber += value;
    displayOutput()
  }
}

/**
 * Add operator to calculator.
 * @param {string} operator - The mathematical operator you want to add. Must
 * be +', '\u2212' (subraction), '\u00D7' (multiplication), or '\u00F7'
 * (division).
 */
function addOperator(operator) {

  // last stored value was an operator and there is a temp number currently
  if (!lastStoredValueIsNumber && tempNumber.length > 0) {
    storeNumber();
  }

  // last stored value was a number
  if (lastStoredValueIsNumber) {
    tempOperator = operator;
    displayOutput();
  }
}

/**
 * Change the sign of current number value.
 */
function plusMinus() {
  if (tempNumber[0] === "-") {
    // remove the leading negative sign
    tempNumber = tempNumber.slice(1);
  }
  else {
    // add leading negative sign
    tempNumber = "-" + tempNumber;
  }
  displayOutput();
}

/**
 * Add decimal point to number if there are no current decimal points. I
 * the first of a new number is a decimal point, a leading zero will be added.
 */
function addDecimalPoint() {
  // last stored value is a number and there is a temp operator currently
  if (lastStoredValueIsNumber && tempOperator.length === 1) {
    storeOperator();
  }

  // last stored value was an operator or if we cleared memory
  if (!lastStoredValueIsNumber) {
    if (tempNumber.length === 0) { // if decimal point is first,
      tempNumber += "0";           // add zero beforehand
    }

    // is there already a decimal point in number
    var tempNumberHasDecimal = false;
    for (var i = 0; i < tempNumber.length; i++) {
      if (tempNumber[i] === ".") { // switch flag is there is a decimal point
        tempNumberHasDecimal = true;
      }
    } // end for loop

    if (!tempNumberHasDecimal) { // if there is no decimal point in number,
      tempNumber += ".";         // add one
    }
    displayOutput();
  }
}

/**
 * Take square root or current number immediately. Error will appear if
 * the current number is negative.
 */
function addSquareRoot() {
  if (tempNumber.length > 0) {
    var parsedNumber = parseFloat(tempNumber);
    tempNumber = Math.sqrt(parsedNumber).toString();
    if (tempNumber === "NaN") { // if number is negative
      displayError();
    }
    else {
    displayOutput();
    }
  }

}

/**
 * Clear all memory.
 */
function clearAll() {
  activateInputButtons(); // rebind input buttons
  expression = [];      // clear expression
  tempNumber = "";   // clear current number
  tempOperator = ""; // clear current operator
  lastNumberStored = "";
  lastOperatorStored = "";
  lastStoredValueIsNumber = false;
  displayOutput();
}

/**
 * Clear current entry, either a number or operator.
 */
function clearCurrentEntry() {
  activateInputButtons(); // rebind input buttons
  tempNumber = ""; // clear current number
  tempOperator = ""; // clear current operator
  displayOutput();
}

/**
 * Calculate the current expression. All multiplication and division will
 * occur before addition and subtraction.
 */
function equals() {

  // for repeatedly pressing equals to perform last operation
  if (expression.length === 0 &&
      lastOperatorStored.length === 1 &&
      lastNumberStored.length > 0) {
    tempNumber = performOperation(tempNumber, lastOperatorStored,
      lastNumberStored).toString(); // need to string for .length to work
  }
  else {
    // if there is a temp number, we need to add to expression
    if (!lastStoredValueIsNumber && tempNumber.length > 0) {
      storeNumber();
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
    expression = [];           // clear expression
    tempOperator = "";         // clear temp operator for display purposes
    lastStoredValueIsNumber = false;
  } // end else

  displayOutput();
}

/**
 * Perform the given mathematical operation.
 * @param {string} a - First number. Will be parsed to a floating point.
 * @param {string} operator - Operator determines the mathematical operation
 *   that will be performed. Must be +', '\u2212' (subraction), '\u00D7'
 *   (multiplication), or '\u00F7' (division).
 * @param {string} b - Second number. Will be paresed to a floating point.
 */
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

/**
 * Output ERROR and disable input buttons, requiring user to press
 * clearAll or clear CurrentEntry buttons
 */
function displayError() {
  $("#display").text("ERROR");
  // disable input buttons
  inputButtonsAreActive = false;
  $(".number-btn").off("click");
  $(".operator-btn").off("click");
  $("#square-root").off("click");
  $("#plus-minus").off("click");
  $("#decimal-point").off("click");
  $("#equals").off("click");
  $(document).off("keypress");
}

/**
 * Activate input buttons if they are disabled.
 */
function activateInputButtons() {
  if (!inputButtonsAreActive) {
    inputButtonsAreActive = true;
    $(".number-btn").on("click", function() {
      addNumber( $(this).text() );
    });
    $(".operator-btn").on("click", function() {
      addOperator( $(this).text() );
    });
    $("#square-root").on("click", addSquareRoot);
    $("#plus-minus").on("click", plusMinus);
    $("#decimal-point").on("click", addDecimalPoint);
    $("#equals").on("click", equals);

    // keyboard inputs
    $(document).on("keypress", function(event) {
      switch (event.which) {
        case 49:
          addNumber("1");
          break;
        case 50:
          addNumber("2");
          break;
        case 51:
          addNumber("3");
          break;
        case 52:
          addNumber("4");
          break;
        case 53:
          addNumber("5");
          break;
        case 54:
          addNumber("6");
          break;
        case 55:
          addNumber("7");
          break;
        case 56:
          addNumber("8");
          break;
        case 57:
          addNumber("9");
          break;
        case 47:
          addOperator(DIVIDE);
          break;
        case 42:
          addOperator(MULTIPLY);
          break;
        case 45:
          addOperator(SUBTRACT);
          break;
        case 43:
          addOperator(ADD);
          break;
        case 13:
          equals();
          break;
        case 46:
          addDecimalPoint();
          break;
      }
    });
  }
}

$(document).ready(function() {
  $("#clear-everything").on("click", clearAll);
  $("#clear-entry").on("click", clearCurrentEntry);
  activateInputButtons(); // activate input buttons (saves lines of code)
});

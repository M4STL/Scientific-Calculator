let display = document.getElementById("display");
function backspace() {
	display.value = display.value.slice(0, -1);
}

function calculate1() {
	let expression = display.value;
	let result;

	try {
		// Convert trigonometric function inputs from degrees to radians
		expression = expression.replace(/sin\(/g, 'sin(' + Math.PI / 180 + '*');
		expression = expression.replace(/cos\(/g, 'cos(' + Math.PI / 180 + '*');
		expression = expression.replace(/tan\(/g, 'tan(' + Math.PI / 180 + '*');
		

		result = math.evaluate(expression);
		display.value = result;
	} catch (error) {
		display.value = "Error";
	}
}

function squareRoot() {
	display.value += "sqrt(";
}
function cuberoot(){
	display.value += "cbrt(";
}

function pi() {
	display.value += Math.PI;
}


function power() {
	display.value += "^(";
}


function inverse(){
	display.value += "^-1";
}

function calculate(func) {
    try{
        const expression = display.value;
        let result;

        switch (func) {
            case 'asin':
                result = Math.asin(eval(expression));
                break;
            case 'acos':
                result = Math.acos(eval(expression));
                break;
            case 'atan':
                result = Math.atan(eval(expression));
                break;
            case 'asinh':
                result = Math.asinh(eval(expression));
                break;
            case 'acosh':
                result = Math.acosh(eval(expression));
                break;
            case 'atanh':
                result = Math.atanh(eval(expression));
                break;
            default:
                result = 'Error';
        }

        display.value = result;
    }catch{
        display.value = 'Error';
    }
  
}


function roundNumber() {
    display.value = Math.round(eval(display.value));  
}

function toggleParenthesis() {
    const display = document.getElementById('display');
    const currentValue = display.value;
    
    // Count the number of opening and closing parentheses in the current display value
    const openParenCount = (currentValue.match(/\(/g) || []).length;
    const closeParenCount = (currentValue.match(/\)/g) || []).length;

    // If opening parentheses are more, add a closing parenthesis
    if (openParenCount > closeParenCount) {
        display.value += ')';
    } else {
        // Otherwise, add an opening parenthesis
        display.value += '(';
    }
}

function base2Log() {
    if (!display.value.endsWith('log2(')) {
        display.value += "log2(";
    }
    calcbase2log();
}
function calcbase2log() {
    try {
        let expression = display.value;
        // Handle 'log2('
        let match = expression.match(/log2\(([^)]+)\)/);
        if (match) {
            let value = parseFloat(match[1]);
            if (value > 0) { // Ensure the value is positive
                // Calculate log base 2
                let result = Math.log(value) / Math.log(2);
                // Format result to 8 decimal places
                let formattedResult = result.toFixed(8);
                display.value = expression.replace(match[0], formattedResult);
            } else {
                display.value = 'Error: Invalid Input';
            }
        } else {
            display.value = 'Error';
        }
    } catch (e) {
        // Handle errors
        display.value = 'Error';
        console.error(e);
    }
}



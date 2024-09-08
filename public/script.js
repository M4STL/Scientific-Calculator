let display = document.getElementById("display");
let history = document.getElementById("history");

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
        addToHistory(expression ,result);
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


function roundNumber() {
    value1= display.value;
    display.value = Math.round(eval(display.value));  
    addToHistory(value1,Math.round(eval(display.value)));
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
   // calcbase2log();
}
/*function calcbase2log() {
    try {
        let expression = display.value;
        // Handle 'log2('
        let match = expression.match(/log2\(([^)]+)\)/);
        if (match) {
            let value = parseFloat(match[1]);
            if (!isNaN(value) && value > 0) { // Ensure the value is positive
                // Calculate log base 2
                let result = Math.log(value) / Math.log(2);
                // Format result to 8 decimal places
                result = result.toFixed(8);
                display.value = expression.replace(/log2\([^\)]+\)/, result);
                addToHistory(`${expression} = ${result}`);
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
}*/

function showHistory() {
    fetch('/getHistory')
    .then(response => response.json())
    .then(data => {
        const historyBox = document.querySelector('.history-box');
        historyBox.innerHTML = ''; // Clear previous history

        data.forEach(entry => {
            let historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = `${entry.calculation} = ${entry.result}`;
            historyBox.appendChild(historyItem);
        });

        // Scroll to the bottom of the history
        historyBox.scrollTop = historyBox.scrollHeight;
    })
    .catch(error => console.error('Error fetching history:', error));
}
function addToHistory(calculation,result) {
    let historyItem = '${calculation} = ${result}';
    historyItem.className = 'history-item';
   
    // Send the history to the server to save in the database
    fetch('/addHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calculation, result }),
    })
    .then(response => response.text())
    .then(data => {
        console.log('History added:', data);
        showHistory(); // Refresh the history display after adding new entry
    })
    .catch((error) => {
        console.error('Error:', error);
    });
     
}

window.onload = function() {
    showHistory();
};

document.addEventListener("DOMContentLoaded", function() {
    const historyBox = document.querySelector('.history-box');
    const history = document.querySelector('.history');
    const toggleHistoryBtn = document.getElementById('toggleHistory');

    toggleHistoryBtn.addEventListener('click', function(event) {
        const isVisible = historyBox.style.display ==='block';
        historyBox.style.display = isVisible ? 'none' : 'block';
       // historyBox.style.display = historyBox.style.display === 'block' ? 'none' : 'block';
       history.classList.toggle('active',!isVisible);
        event.stopPropagation(); // Prevent event from bubbling up to document
    });

    // Hide history-box when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!historyBox.contains(event.target) && event.target !== toggleHistoryBtn) {
            historyBox.style.display = 'none';
            history.classList.remove('active');
        }
    });
});




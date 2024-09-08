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
    
    
    const openParenCount = (currentValue.match(/\(/g) || []).length;
    const closeParenCount = (currentValue.match(/\)/g) || []).length;

    // If opening parentheses are more, add a closing parenthesis
    if (openParenCount > closeParenCount) {
        display.value += ')';
    } else {
       
        display.value += '(';
    }
}

function base2Log() {
    if (!display.value.endsWith('log2(')) {
        display.value += "log2(";
    }
   
}


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
      
       history.classList.toggle('active',!isVisible);
        event.stopPropagation(); 
    });

    // Hide history-box when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!historyBox.contains(event.target) && event.target !== toggleHistoryBtn) {
            historyBox.style.display = 'none';
            history.classList.remove('active');
        }
    });
});




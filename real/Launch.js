import { loadData } from './dataLoader.js';

let dataIndex = 0;
let timeoutId = null; // add a variable to track the timeout
let timer;
let startTime;
let elapsedTime = 0;
let isRunning = false;
let on = true

function updateReadingColumn() {
  // If a timeout is already set, exit the function
  if (timeoutId !== null) {
    console.log("Timeout already set, skipping this iteration");
    return;
  }

  const data = loadData(); // get the data from the loadData function

  const rows = document.querySelectorAll("table tbody tr"); // get all the table rows

  console.log(`Found ${rows.length} rows in the table`);

  // Loop through the rows (skip the first row, which contains the table headers)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    // Get the first cell in the row (the datatype)
    const datatypeCell = row.cells[0];

    // Get the second cell in the row (the reading)
    const readingCell = row.cells[1];

    // Find the corresponding value in the data object
    const key = datatypeCell.textContent.trim();
    const value = data[dataIndex][key]; // get the value from the current object in the data array

    console.log(`Updating row ${i} with key "${key}" and value "${value}"`);

    // If a value was found, update the reading cell
    if (value !== undefined) {
      readingCell.textContent = value;
    }
  }

  // Move to the next object in the data array, wrapping around to the start if we reach the end
  dataIndex = (dataIndex + 1) % data.length;

  console.log(`Moving to next data object at index ${dataIndex}`);
  displayMessage('Table updated');

  // Schedule the next update in 5 seconds, but only after all rows have been updated with values from the current object
  if (on) {
    timeoutId = setTimeout(() => {
      timeoutId = null; // clear the timeout ID variable
      updateReadingColumn(); // call the updateReadingColumn function again
    }, 5000);
  }
}
// Function to display current time
function displayCurrentTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  const timeElement = document.createElement('p');
  timeElement.textContent = `The time is: ${currentTime}`;
  document.body.appendChild(timeElement);
}

// Function to start the timer
function startTimer() {
  isRunning = true;
  startTime = Date.now() - elapsedTime;
  timer = setInterval(function () {
    const elapsedMilliseconds = Date.now() - startTime;
    elapsedTime = elapsedMilliseconds;
    const seconds = Math.floor(elapsedMilliseconds / 1000) % 60;
    const minutes = Math.floor(elapsedMilliseconds / 1000 / 60) % 60;
    const hours = Math.floor(elapsedMilliseconds / 1000 / 60 / 60);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const elapsedTimeCell = document.getElementById('elapsed-time');
    elapsedTimeCell.textContent = formattedTime;
    elapsedTimeCell.classList.add('highlight');
  }, 10);
}

// Function to stop the timer
function stopTimer() {
  console.log('Stopping timer...');
  isRunning = false;
  clearInterval(timer);
  document.getElementById('elapsed-time').classList.remove('highlight');
}

/**
 * Displays a message on the page and sets a timeout to clear the message.
 * If the message is "Table updated", briefly displays "Switch" before
 * switching back to "Real Live Data".
 * If the message is "Table update stopped", displays "Stop in Progress"
 * until the `on` variable is set to `true` again.
 * @param {string} message - The message to display
 */
function displayMessage(message) {
  const messageElement = document.getElementById('message');

  // If the message is "Table updated", briefly display "Switch"
  if (message === 'Table updated') {
    messageElement.textContent = 'Switch';
    console.log(`Displaying message "Switch" for 500 milliseconds`);
    setTimeout(() => {
      messageElement.textContent = 'Real Live Data';
      console.log(`Displaying message "Real Live Data"`);
    }, 500);
  } else if (message === 'Table update stopped') {
    messageElement.textContent = 'Stop in Progress';
    console.log(`Displaying message "Stop in Progress"`);
    const intervalId = setInterval(() => {
      if (on) {
        clearInterval(intervalId);
        console.log(`Displaying message "Real Live Data"`);
        messageElement.textContent = 'Real Live Data';
      }
    }, 1000);


    // If the message is anything else, display "Real Live Data"
  } else {
    messageElement.textContent = 'Real Live Data';
  }

  // Set a timeout to clear the message after 5 seconds
  setTimeout(() => {
    messageElement.textContent = '';
  }, 5000);
}


function stopUpdate() {
  displayMessage('Table update stopped'); // display a message
  on = false;

}



// Add a button to start the timer
const startButton = document.createElement('button');
startButton.textContent = 'Start Timer';
startButton.addEventListener('click', startTimer);
document.body.appendChild(startButton);

// Add a button to stop the timer
const stopButton = document.createElement('button');
stopButton.textContent = 'Stop Timer';
stopButton.addEventListener('click', stopTimer);
document.body.appendChild(stopButton);


const stopUpdateButton = document.createElement('button');
stopUpdateButton.textContent = 'Stop Update';
stopUpdateButton.addEventListener('click', stopUpdate);
document.body.appendChild(stopUpdateButton);



// Add a div to display the timer
const timerDiv = document.createElement('div');
timerDiv.setAttribute('id', 'timer');
document.body.appendChild(timerDiv);


// Add a div to display the message 
const messageDiv = document.createElement('div');
timerDiv.setAttribute('id', 'message');
document.body.appendChild(messageDiv);

// Call the function to start the update loop
updateReadingColumn();


// Call the displayCurrentTime function
displayCurrentTime();


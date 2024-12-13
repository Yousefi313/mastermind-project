const container = document.getElementById("container");
const colors = ["red", "yellow", "green", "blue", "brown", "orange"];
const reloadButton = document.getElementById("reload-button");
const checkButton = document.getElementById("check-button");

let activeRow = 1; // Start with the first row
let colorIndex = 0; // For cycling colors

// Generate a random secret combination of 4 colors
const secretCombination = Array.from({ length: 4 }, () =>
  colors[Math.floor(Math.random() * colors.length)]
);
console.log("Secret Combination:", secretCombination); // For debugging

// Create 10 rows with circles and corresponding squares
for (let i = 1; i <= 10; i++) {
  const rowDiv = document.createElement("div"); // Container for the row
  rowDiv.className = "row";

  const circleDiv = document.createElement("div"); // Container for the circles
  circleDiv.id = `row-${i}`;
  circleDiv.className = "circle-row";

  const squareDiv = document.createElement("div"); // Container for the square
  squareDiv.id = `square-${i}`;
  squareDiv.className = "square";

  for (let j = 1; j <= 4; j++) {
    // Create the circle
    const childDiv = document.createElement("div");
    childDiv.className = "child-div";
    childDiv.id = `circle-${i}-${j}`;

    // Initially disable all rows except the first one
    if (i !== activeRow) {
      childDiv.style.pointerEvents = "none"; // Disable click events
      childDiv.style.opacity = "0.0"; // Dim circles
      squareDiv.style.opacity = "0.0"; // Dim square
    }

    // Add click event listener for coloring
    childDiv.addEventListener("click", function () {
      if (i === activeRow) {
        this.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length; // Cycle colors
      }
    });

    circleDiv.appendChild(childDiv);

    // Create a part of the square corresponding to the circle
    const squarePart = document.createElement("div");
    squarePart.className = "square-part";
    squarePart.id = `square-part-${i}-${j}`;
    squareDiv.appendChild(squarePart);
  }

  // Add circles and square to the row
  rowDiv.appendChild(circleDiv);
  rowDiv.appendChild(squareDiv);

  // Append the row to the container
  container.appendChild(rowDiv);
}

// Handle "Check" button click
checkButton.addEventListener("click", function () {
  // Validate if all circles in the current row have a background color
  const currentRow = document.querySelectorAll(`#row-${activeRow} .child-div`);
  const allColored = Array.from(currentRow).every(
    (circle) =>
      circle.style.backgroundColor && circle.style.backgroundColor !== ""
  );

  if (!allColored) {
    alert("Please color all the circles in this row before proceeding!");
    return;
  }

  // Get user's guess for the current row
  const userGuess = Array.from(currentRow).map(
    (circle) => circle.style.backgroundColor
  );

  // Check the user's guess against the secret combination
  const feedback = checkGuess(userGuess, secretCombination);

  // Display feedback (Black = Correct position, Grey = Wrong position)
  const squareParts = document.querySelectorAll(`#square-${activeRow} .square-part`);
  feedback.forEach((feedbackColor, index) => {
    squareParts[index].style.backgroundColor = feedbackColor;
  });

  // If the user guessed the combination correctly, end the game
  if (feedback.filter((color) => color === "black").length === 4) {
    alert("Congratulations! You've guessed the correct combination!");
    checkButton.disabled = true;
    return;
  }

  // Disable current row
  currentRow.forEach((circle) => {
    circle.style.pointerEvents = "none"; // Disable clicks
  });

  // Move to the next row
  activeRow++;

  // Enable the next row if it exists
  if (activeRow <= 10) {
    const nextRow = document.querySelectorAll(`#row-${activeRow} .child-div`);
    const nextSquare = document.getElementById(`square-${activeRow}`);

    nextRow.forEach((circle) => {
      circle.style.pointerEvents = "auto"; // Enable clicks
      circle.style.opacity = "1"; // Restore normal opacity
    });

    nextSquare.style.opacity = "1"; // Restore square opacity
  } else {
    // If all rows are completed, disable the check button and reveal secret
    this.disabled = true;
    displaySecretCombination();
    alert("Game over! You've used all attempts.");
  }
});

// Function to check the user's guess
function checkGuess(guess, secret) {
  const feedback = [];
  const secretCopy = [...secret];
  const guessCopy = [...guess];

  // Step 1: Check for correct position (Black Pegs)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] === secretCopy[i]) {
      feedback.push("black");
      secretCopy[i] = guessCopy[i] = null; // Mark as used
    }
  }

  // Step 2: Check for correct color in wrong position (Grey Pegs)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] && secretCopy.includes(guessCopy[i])) {
      feedback.push("grey");
      secretCopy[secretCopy.indexOf(guessCopy[i])] = null; // Mark as used
    }
  }

  // Return feedback array, padded with empty strings for unused parts
  return feedback.concat(Array(4 - feedback.length).fill(""));
}

// Function to display the secret combination
function displaySecretCombination() {
  const secretDiv = document.createElement("div");
  secretDiv.className = "secret-row";
  secretDiv.innerHTML = "<h3>Secret Combination:</h3>";

  secretCombination.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.className = "secret-color";
    colorDiv.style.backgroundColor = color;
    secretDiv.appendChild(colorDiv);
  });

  container.appendChild(secretDiv); // Append the secret combination at the bottom
}

// Handle reload button click
reloadButton.addEventListener("click", function () {
  location.reload(); // Reload the page
});

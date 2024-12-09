const parentDiv = document.getElementById('parent-div');
const colors = ['red', 'yellow', 'green', 'blue', 'brown', 'orange'];
const reloadButton = document.getElementById('reload-button');

let activeRow = 1; // Start with the first row
let colorIndex = 0; // For cycling colors

// Create 10 rows and 4 circles per row
for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 4; j++) {
        const childDiv = document.createElement('div');
        childDiv.className = 'child-div';
        <!-- childDiv.textContent = `${i}.${j}`; -->
        childDiv.id = `circle-${i}-${j}`;

        // Initially disable all rows except the first one
        if (i !== activeRow) {
            childDiv.style.pointerEvents = 'none'; // Disable click events
            childDiv.style.opacity = '0.0'; // Dim circles
        }

        // Add click event listener for coloring
        childDiv.addEventListener('click', function () {
            if (i === activeRow) {
                this.style.backgroundColor = colors[colorIndex];
                colorIndex = (colorIndex + 1) % colors.length; // Cycle colors
            }
        });

        parentDiv.appendChild(childDiv);
    }
}

// Handle "Check" button click
const checkButton = document.getElementById('check-button');
checkButton.addEventListener('click', function () {
    // Disable current row
    const currentRow = document.querySelectorAll( //selects all circles in the current row using the id pattern
        `#parent-div .child-div[id^="circle-${activeRow}-"]`
    );
    const allColored = Array.from(currentRow).every(circle =>
        circle.style.backgroundColor !== ''
    );
    if(!allColored){
        alert('Please color all the circles in this row before proceeding!');
        return;
    }
    currentRow.forEach(circle => { //Loops through each circle in the current row
        circle.style.pointerEvents = 'none'; // Disable clicks
        circle.style.opacity = '1'; // Ensure opacity remains normal
    });

    // Move to the next row
    activeRow++;

    // Enable the next row
    const nextRow = document.querySelectorAll(
        `#parent-div .child-div[id^="circle-${activeRow}-"]`
    );
    nextRow.forEach(circle => {
        circle.style.pointerEvents = 'auto'; // Enable clicks
        circle.style.opacity = '1'; // Restore normal opacity
    });

    // If all rows are completed, disable the button
    if (activeRow > 10) {
        this.disabled = true;
        alert('You have completed all rows!');
    }
});

reloadButton.addEventListener('click', function(){ //Event Listener to reload the page
    location.reload(); //Reload the page
});
 
// Get references to the button and output text
const actionButton = document.getElementById('actionButton');
const outputText = document.getElementById('outputText');

// Add a click event listener to the button
actionButton.addEventListener('click', () => {
  // Change the text when the button is clicked
  outputText.textContent = 'Button Clicked! 🎉';
});
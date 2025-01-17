
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        // Input validation
        if (!isValidText(name)) {
            alert('Please enter a valid name (letters and spaces only).');
            return;
        }

        if (!isValidText(message)) {
            alert('Please enter a valid message (letters and spaces only).');
            return;
        }

        // Creating a JSON object from the form data
        const data = {
            name: name,
            message: message
        };

        try {
            console.log('Sending data:', data);

            const response = await fetch('https://qx579ejzlg.execute-api.ap-south-1.amazonaws.com/deploy/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set content type to application/json
                },
                body: JSON.stringify(data) // Convert data object to JSON string
            });

            console.log('Response:', response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Result JSON:', result); // Log the entire result JSON

            // Check if the message field exists in the response
            if (result && result.message) {
                alert(result.message);
            } else {
                alert('Response did not contain a message.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });

    // Helper function to validate text input
    function isValidText(input) {
        const regex = /^[a-zA-Z\s]*$/; // Only letters and spaces
        return regex.test(input);
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
        return regex.test(email);
    }
});
    
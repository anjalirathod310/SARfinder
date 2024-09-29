// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Button Elements
    const sarFinderBtn = document.getElementById('sarFinderBtn');
    const aboutSARBtn = document.getElementById('aboutSARBtn');
    const healthRisksBtn = document.getElementById('healthRisksBtn');

    // Section Elements
    const homeSection = document.getElementById('homeSection');
    const sarFinderSection = document.getElementById('sarFinderSection');
    const aboutSARSection = document.getElementById('aboutSARSection');
    const healthRisksSection = document.getElementById('healthRisksSection');

    // Form Elements
    const sarForm = document.getElementById('sarForm');
    const resultDiv = document.getElementById('result');

    // Navigation Function
    function showSection(section) {
        // Hide all sections
        homeSection.classList.remove('active');
        sarFinderSection.classList.remove('active');
        aboutSARSection.classList.remove('active');
        healthRisksSection.classList.remove('active');

        // Show the selected section
        section.classList.add('active');
    }

    // Event Listeners for Navigation Buttons
    sarFinderBtn.addEventListener('click', function() {
        showSection(sarFinderSection);
    });

    aboutSARBtn.addEventListener('click', function() {
        showSection(aboutSARSection);
    });

    healthRisksBtn.addEventListener('click', function() {
        showSection(healthRisksSection);
    });

    // Handle Form Submission
    sarForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous results
        resultDiv.innerHTML = '';

        // Get form values
        let frequency = parseFloat(document.getElementById('frequency').value);
        const tumorStatus = document.getElementById('tumorStatus').value;

        // Validate inputs
        if (isNaN(frequency) || frequency < 1 || frequency > 6) {
            resultDiv.innerHTML = '<span style="color: red;">Please enter a valid frequency between 1 and 6 GHz.</span>';
            return;
        }

        // Round frequency to one decimal place
        frequency = Math.round(frequency * 10) / 10;

        // Update the frequency input value to show the rounded value (optional)
        document.getElementById('frequency').value = frequency.toFixed(1);

        if (tumorStatus !== 'with' && tumorStatus !== 'without') {
            resultDiv.innerHTML = '<span style="color: red;">Please select a valid tumor status.</span>';
            return;
        }

        // Prepare data to send
        const formData = new FormData();
        formData.append('frequency', frequency);
        formData.append('tumor_status', tumorStatus);

        // Send AJAX request
        fetch('get_sar.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<span style="color: red;">${data.error}</span>`;
            } else {
                resultDiv.innerHTML = `
                    <p><strong>SE Value:</strong> ${data.se}</p>
                    <p><strong>SAR Value:</strong> ${data.sar}</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<span style="color: red;">An error occurred while fetching the data.</span>';
        });
    });
});

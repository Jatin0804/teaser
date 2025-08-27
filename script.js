// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if server is available
async function isServerAvailable() {
    try {
        const response = await fetch('/api/health');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Function to save email to server
async function saveEmailToServer(email) {
    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Server error:', error);
        return { success: false, message: 'Server unavailable' };
    }
}

// Function to save email to localStorage (fallback)
function saveEmailToStorage(email) {
    // Get existing emails from localStorage
    let existingEmails = JSON.parse(localStorage.getItem('waitlistEmails')) || [];
    
    // Check if email already exists
    const emailExists = existingEmails.some(entry => 
        entry.email && entry.email.toLowerCase() === email.toLowerCase()
    );
    
    if (emailExists) {
        return { success: false, message: 'Email already exists in waitlist!' };
    }
    
    // Add new email with timestamp
    const emailEntry = {
        email: email,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    existingEmails.push(emailEntry);
    
    // Save back to localStorage
    localStorage.setItem('waitlistEmails', JSON.stringify(existingEmails));
    
    return { success: true, message: 'Email saved successfully!' };
}

// Function to export emails to CSV (for Excel compatibility)
function exportToCSV() {
    const emails = JSON.parse(localStorage.getItem('waitlistEmails')) || [];
    
    if (emails.length === 0) {
        alert('No emails to export!');
        return;
    }
    
    // Create CSV content
    let csvContent = "Email,Timestamp,ID\n";
    emails.forEach(entry => {
        csvContent += `${entry.email},${entry.timestamp},${entry.id}\n`;
    });
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'waitlist_emails.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Main function to join waitlist
async function joinWaitlist() {
    const emailInput = document.getElementById('email');
    const joinBtn = document.getElementById('joinBtn');
    const successMessage = document.getElementById('successMessage');
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
        alert('Please enter your email address.');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }
    
    // Disable button and show loading state
    joinBtn.disabled = true;
    joinBtn.textContent = 'Joining...';
    
    try {
        // Check if server is available
        const serverAvailable = await isServerAvailable();
        let result;
        
        if (serverAvailable) {
            // Use server
            result = await saveEmailToServer(email);
        } else {
            // Fallback to localStorage
            result = saveEmailToStorage(email);
        }
        
        if (result.success) {
            // Show success message
            successMessage.classList.remove('hidden');
            emailInput.value = '';
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 3000);
            
            // Log for development
            console.log('Email saved:', email);
            console.log('Storage method:', serverAvailable ? 'Server' : 'LocalStorage');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error saving email:', error);
        alert('An error occurred. Please try again.');
    } finally {
        // Reset button
        joinBtn.disabled = false;
        joinBtn.textContent = 'Join the waitlist';
    }
}

// Function to handle Enter key press in email input
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        joinWaitlist();
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    
    // Add enter key listener to email input
    emailInput.addEventListener('keypress', handleKeyPress);
    
    // Add input validation on type
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderBottom = '2px solid #ff6b6b';
        } else {
            this.style.borderBottom = 'none';
        }
    });
    
    // Console commands for development/admin use
    console.log('Waitlist Admin Commands:');
    console.log('- viewEmails(): View all saved emails');
    console.log('- exportToCSV(): Export emails to CSV file');
    console.log('- clearEmails(): Clear all saved emails');
});

// Admin functions for development/testing
function viewEmails() {
    const emails = JSON.parse(localStorage.getItem('waitlistEmails')) || [];
    console.log('Saved emails:', emails);
    return emails;
}

function clearEmails() {
    localStorage.removeItem('waitlistEmails');
    console.log('All emails cleared from storage.');
}

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add animation classes on scroll (if content extends beyond viewport)
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.glass-container');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
});

// Prevent form submission on Enter if inside a form
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
        event.preventDefault();
    }
});

// Add resize listener to handle orientation changes on mobile
window.addEventListener('resize', function() {
    // Force a repaint to ensure proper layout
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
});

// Expose functions globally for debugging
window.joinWaitlist = joinWaitlist;
window.viewEmails = viewEmails;
window.clearEmails = clearEmails;
window.exportToCSV = exportToCSV;

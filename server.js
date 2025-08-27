const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Storage file for emails
const emailsFile = path.join(__dirname, 'waitlist_emails.json');

// Initialize emails file if it doesn't exist
if (!fs.existsSync(emailsFile)) {
    fs.writeFileSync(emailsFile, JSON.stringify([]));
}

// Helper function to read emails
function readEmails() {
    try {
        const data = fs.readFileSync(emailsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading emails:', error);
        return [];
    }
}

// Helper function to write emails
function writeEmails(emails) {
    try {
        fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing emails:', error);
        return false;
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add email to waitlist
app.post('/api/waitlist', (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    // Read existing emails
    const emails = readEmails();

    // Check if email already exists
    const emailExists = emails.some(entry => entry.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        return res.status(409).json({
            success: false,
            message: 'Email already exists in waitlist'
        });
    }

    // Add new email
    const newEntry = {
        email: email.toLowerCase(),
        timestamp: new Date().toISOString(),
        id: Date.now(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    };

    emails.push(newEntry);

    // Save emails
    if (writeEmails(emails)) {
        res.json({
            success: true,
            message: 'Successfully added to waitlist',
            totalEmails: emails.length
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Failed to save email'
        });
    }
});

// Get all emails (admin endpoint)
app.get('/api/waitlist', (req, res) => {
    const emails = readEmails();
    res.json({
        success: true,
        emails: emails,
        total: emails.length
    });
});

// Export emails as CSV
app.get('/api/export', (req, res) => {
    const emails = readEmails();
    
    if (emails.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No emails to export'
        });
    }

    const csvFilePath = path.join(__dirname, 'exports', `waitlist_${Date.now()}.csv`);
    
    // Create exports directory if it doesn't exist
    const exportsDir = path.dirname(csvFilePath);
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
    }

    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'email', title: 'Email' },
            { id: 'timestamp', title: 'Timestamp' },
            { id: 'id', title: 'ID' },
            { id: 'ip', title: 'IP Address' },
            { id: 'userAgent', title: 'User Agent' }
        ]
    });

    csvWriter.writeRecords(emails)
        .then(() => {
            res.download(csvFilePath, `waitlist_emails_${new Date().toISOString().split('T')[0]}.csv`, (err) => {
                if (err) {
                    console.error('Download error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'Failed to download file'
                    });
                }
                
                // Clean up the file after download
                setTimeout(() => {
                    if (fs.existsSync(csvFilePath)) {
                        fs.unlinkSync(csvFilePath);
                    }
                }, 60000); // Delete after 1 minute
            });
        })
        .catch((error) => {
            console.error('CSV creation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create CSV file'
            });
        });
});

// Delete all emails (admin endpoint)
app.delete('/api/waitlist', (req, res) => {
    if (writeEmails([])) {
        res.json({
            success: true,
            message: 'All emails deleted'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Failed to delete emails'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Quralyst Waitlist Server running on port ${PORT}`);
    console.log(`📧 Add emails: POST /api/waitlist`);
    console.log(`📋 View emails: GET /api/waitlist`);
    console.log(`📁 Export CSV: GET /api/export`);
    console.log(`🗑️  Clear emails: DELETE /api/waitlist`);
});

module.exports = app;

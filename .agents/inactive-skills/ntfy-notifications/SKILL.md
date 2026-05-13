---
name: ntfy-notifications
description: Skill for sending quick push notifications to human operators via ntfy.sh
---

# Ntfy Notifications

This skill provides instructions for sending push notifications to a human operator or systems using the simple webhook API from `ntfy.sh`. It is highly useful for out-of-band alerts when background rendering jobs process unattended.

## Usage

To send a simple text notification to the default configured project topic (`to-human-bt-test`), you can use HTTP POST/PUT via `curl`:

```bash
curl -d "Your message here" https://ntfy.sh/to-human-bt-test
```

### Advanced Usage (Node.js)
If you need to implement this within the renderer codebase (instead of a shell script):

```javascript
fetch('https://ntfy.sh/to-human-bt-test', {
    method: 'POST', // or PUT
    body: 'Your message here',
    // headers: { 'Title': 'Fatal Rendering Error' } // Optional custom title 
});
```

## When to Use
- **Error Reporting:** When a background headless renderer job (Puppeteer/Cesium) encounters WebGL crashes or an unrecoverable failure.
- **Workflow Interruption:** When an expected tile load takes too long and a job is abandoned.
- **Manual Intervention Required:** If you need human attention when the system is operating headlessly.

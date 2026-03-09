/**
 * ntfy.sh Push Notification
 * 
 * Sends push notifications via the free hosted ntfy.sh service.
 * Used to alert the human operator when PSD files are ready for editing.
 * 
 * Env vars:
 *   NTFY_TOPIC - ntfy.sh topic name (e.g., 'robotic-photographer')
 *   NTFY_URL   - ntfy.sh server URL (default: https://ntfy.sh)
 */

const NTFY_URL = process.env.NTFY_URL || 'https://ntfy.sh';

/**
 * Send a notification via ntfy.sh.
 * No-ops if NTFY_TOPIC is not configured.
 * 
 * @param {string} title - Notification title
 * @param {string} message - Notification body
 * @param {Object} [options]
 * @param {string} [options.priority='default'] - Priority: min, low, default, high, urgent
 * @param {string[]} [options.tags] - Emoji tags (e.g., ['camera', 'white_check_mark'])
 * @param {string} [options.clickUrl] - URL to open when notification is clicked
 * @returns {Promise<boolean>} true if sent, false if not configured or failed
 */
export async function sendNotification(title, message, options = {}) {
    const topic = process.env.NTFY_TOPIC;
    if (!topic) {
        console.log('[NTFY] Not configured (NTFY_TOPIC missing) — skipping notification');
        return false;
    }

    const { priority = 'default', tags = [], clickUrl } = options;

    try {
        const headers = {
            'Title': title,
            'Priority': priority,
        };

        if (tags.length > 0) {
            headers['Tags'] = tags.join(',');
        }
        if (clickUrl) {
            headers['Click'] = clickUrl;
        }

        const response = await fetch(`${NTFY_URL}/${topic}`, {
            method: 'POST',
            headers,
            body: message,
        });

        if (response.ok) {
            console.log(`[NTFY] Notification sent: "${title}"`);
            return true;
        } else {
            console.error(`[NTFY] Failed (${response.status}): ${await response.text()}`);
            return false;
        }
    } catch (err) {
        console.error(`[NTFY] Error: ${err.message}`);
        return false;
    }
}

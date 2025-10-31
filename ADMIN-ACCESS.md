# Admin Analytics Access

## Overview
The analytics dashboard is hidden from public users and only accessible to administrators. Analytics data is collected in the background (with user consent) and stored locally in the browser's localStorage.

## How to Access Analytics

### Method 1: URL Parameter (Recommended)
Add the admin key as a URL parameter:
```
https://your-site.com/?admin=sparxion2025
```

This will:
- Show the analytics button in the UI
- Create an admin session that lasts 24 hours
- Allow you to access analytics without re-entering the key

### Method 2: Keyboard Shortcut
When the page loads, if you have a valid admin session, you can press:
- **Cmd+Shift+D** (Mac) or **Ctrl+Shift+D** (Windows/Linux)

This will open the analytics dashboard (if you're in admin mode).

### Method 3: Direct Access
Click the "Analytics" button (visible only in admin mode) and enter the admin key when prompted:
- Admin Key: `sparxion2025` (change this in `analytics.js`)

## Changing the Admin Key

To change the admin secret key, edit `analytics.js`:
```javascript
const ADMIN_SECRET = 'your-new-secret-key';
```

## Analytics Data

Analytics data is stored in:
- **Local Storage Key**: `ai_tuner_events`
- **Location**: Browser's localStorage (client-side only)
- **Privacy**: All data is stored locally, not sent to any server

### Data Collected
- Page visits (with device info, screen resolution, timezone)
- Preset usage
- Setting changes
- Downloads (JSON, Markdown)
- Uploads (config files)
- Info button clicks
- Prompt generations

## Exporting Data

From the analytics dashboard, you can export data in two formats:

### JSON Export
1. Click "Export JSON" button
2. Downloads a complete JSON file with all analytics events
3. Perfect for programmatic analysis or importing into databases

### CSV Export  
1. Click "Export CSV" button
2. Downloads a CSV file with structured data
3. Perfect for analysis in Excel, Google Sheets, or data visualization tools

## Enhanced Analytics Features

The enhanced analytics dashboard now tracks:
- **Overview**: Total events, unique sessions, unique visitors, average session duration
- **Activity**: Downloads and uploads counts
- **Top Presets**: Most popular preset configurations
- **Top Personalities**: Most commonly selected personality types
- **Daily/Hourly Activity**: Usage patterns over time
- **Session Analytics**: Session duration and engagement metrics

## Data Analysis Tips

1. **CSV Export**: Use for spreadsheet analysis and charting
2. **JSON Export**: Use for programmatic analysis or importing into analytics tools
3. **Periodic Exports**: Export data regularly (weekly/monthly) to track trends
4. **Combine Data**: If you want aggregated data across multiple browsers/devices, manually combine exported CSV files

## Privacy & Consent

- Users must consent before analytics are collected
- Consent is stored in localStorage
- Users can decline or change their preference anytime
- All data is stored locally (no server transmission)

## Notes

- Admin sessions expire after 24 hours
- The analytics button is completely hidden from public users
- Analytics tracking works in the background (when consented) regardless of admin access
- For server-side analytics, consider integrating Google Analytics, Plausible, or similar services

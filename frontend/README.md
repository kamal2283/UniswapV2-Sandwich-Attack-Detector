# UniswapV2 Sandwich Attack Detector - Frontend Setup

This React application provides a real-time dashboard for monitoring sandwich attacks on UniswapV2.

## Features

🥪 **Real-time Dashboard**: View all detected sandwich attacks in a clean, responsive interface
🚨 **Live Notifications**: Get instant alerts when new attacks are detected
📊 **Attack Statistics**: View total attacks, recent activity, and profit analysis
🔗 **Etherscan Integration**: Click on transaction hashes and addresses to view on Etherscan
📱 **Mobile Responsive**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:
   The `.env` file is already configured to connect to the local API server at `http://localhost:3001`

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the dashboard

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.js          # Main dashboard component
│   │   ├── Dashboard.css         # Dashboard styling
│   │   └── NotificationSystem.js # Toast notifications
│   ├── services/
│   │   └── ApiService.js         # API communication service
│   ├── App.js                    # Main application component
│   ├── App.css                   # Global styling
│   └── index.js                  # Application entry point
├── public/
└── package.json
```

## API Integration

The frontend connects to the backend API server running on port 3001. The API provides:

- `GET /api/attacks` - Fetch all detected attacks
- `GET /api/health` - Check API server status
- `GET /api/stats` - Get attack statistics

## Notifications

The app includes two types of notifications:

1. **Toast Notifications**: In-app notifications using react-toastify
2. **Browser Notifications**: Native browser notifications (requires permission)

## Customization

### Styling

- Modify `src/components/Dashboard.css` for dashboard styling
- Modify `src/App.css` for global styling
- Color scheme uses gradients and modern design principles

### API Configuration

- Update `REACT_APP_API_URL` in `.env` to change the API endpoint
- Modify `src/services/ApiService.js` to customize API communication

## Production Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server

3. **Update environment variables** for production API endpoint

## Troubleshooting

- If the API shows as "offline", ensure the backend server is running on port 3001
- Check browser console for any JavaScript errors
- Verify CORS settings if connecting to a different domain

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

.\start-dashboard.ps1

# Terminal 1 - Start Backend

cd backend
node server.js

# Terminal 2 - Start Frontend

cd frontend
npm start

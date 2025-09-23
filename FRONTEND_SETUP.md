# UniswapV2 Sandwich Attack Detector - Complete Setup Guide

This project now includes a complete React frontend dashboard for monitoring sandwich attacks in real-time.

## 🏗️ Project Structure

```
UniswapV2-Sandwich-Attack-Detector/
├── src/                          # Original Forta agent code
│   ├── agent.ts                  # Main detection logic
│   ├── abi.ts                    # Contract ABIs
│   └── ...                       # Other agent files
├── frontend/                     # React dashboard application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Main dashboard component
│   │   │   ├── Dashboard.css     # Dashboard styling
│   │   │   └── NotificationSystem.js # Notification system
│   │   ├── services/
│   │   │   └── ApiService.js     # API communication
│   │   ├── App.js               # Main React app
│   │   └── App.css              # Global styles
│   ├── package.json
│   └── .env                     # Environment configuration
├── backend/                      # Express API server
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Start the Backend API Server

```powershell
cd backend
npm install
npm start
```

The API server will start on `http://localhost:3001`

### 2. Start the Frontend Dashboard

```powershell
cd frontend
npm install
npm start
```

The React app will start on `http://localhost:3000`

### 3. View the Dashboard

Open your browser and navigate to `http://localhost:3000` to see the dashboard.

## 📊 Features

### Dashboard

- **Real-time Attack Monitoring**: See all detected sandwich attacks in a table
- **Attack Statistics**: View total attacks, recent activity, and profit analysis
- **Etherscan Integration**: Click links to view transactions and addresses
- **Responsive Design**: Works on desktop, tablet, and mobile

### Notifications

- **Toast Notifications**: In-app alerts for new attacks
- **Browser Notifications**: Native OS notifications (with permission)
- **Real-time Updates**: Automatic polling for new attacks every 5 seconds

### API Endpoints

- `GET /api/health` - Check server status
- `GET /api/attacks` - Get all detected attacks
- `GET /api/attacks/:txHash` - Get specific attack details
- `GET /api/stats` - Get attack statistics
- `POST /api/attacks` - Add new attack (for testing)

## 🔧 Configuration

### Frontend Environment Variables (`.env`)

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### Backend Configuration

The backend server includes:

- CORS enabled for frontend communication
- Security headers with Helmet
- Request logging with Morgan
- Mock data generation for testing

## 🛠️ Development

### Adding Real Detection Data

To connect the frontend to your actual Forta agent detection logic:

1. **Modify the backend server** (`backend/server.js`) to read from your detection results
2. **Update the data structure** to match your agent's output format
3. **Add WebSocket support** for real-time updates instead of polling

### Customizing the Dashboard

1. **Styling**: Modify `frontend/src/components/Dashboard.css`
2. **Data Display**: Update `frontend/src/components/Dashboard.js`
3. **API Integration**: Customize `frontend/src/services/ApiService.js`

### Testing New Attacks

Use the API to add test attacks:

```bash
curl -X POST http://localhost:3001/api/attacks \
  -H "Content-Type: application/json" \
  -d '{
    "txHash": "0x1234567890abcdef",
    "blockNumber": 18500000,
    "attacker": "0xattacker123",
    "victim": "0xvictim123",
    "profit": "1.5",
    "confirmed": true
  }'
```

## 🎨 UI Features

### Dashboard Components

- **Header**: Shows app title and API connection status
- **Statistics Cards**: Display key metrics
- **Attack Table**: Shows all detected attacks with clickable links
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error messages

### Responsive Design

- Mobile-first design approach
- Flexible grid layout
- Touch-friendly interface elements
- Collapsible navigation on small screens

## 🔒 Security Considerations

For production deployment:

- Add authentication to the API
- Implement rate limiting
- Use HTTPS for all communications
- Add input validation and sanitization
- Store sensitive data in environment variables

## 📦 Production Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the 'build' folder to your web server
```

### Backend Deployment

```bash
cd backend
# Set environment variables
export NODE_ENV=production
export PORT=3001
npm start
```

## 🤝 Integration with Forta Agent

To integrate with your existing Forta agent:

1. **Modify your agent** to send detection results to the API:

   ```typescript
   // In your agent.ts file
   const sendToAPI = async (finding: Finding) => {
     await fetch("http://localhost:3001/api/attacks", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         txHash: finding.hash,
         blockNumber: finding.blockNumber,
         // ... other fields
       }),
     });
   };
   ```

2. **Update the backend** to handle your specific data format

3. **Add database persistence** for production use

## 🐛 Troubleshooting

### Common Issues

1. **API showing as offline**:

   - Ensure backend server is running on port 3001
   - Check for port conflicts
   - Verify CORS configuration

2. **No attacks showing**:

   - Backend includes mock data by default
   - Check browser console for API errors
   - Verify API endpoints are responding

3. **Notifications not working**:
   - Grant browser notification permissions
   - Check toast notification settings
   - Verify WebSocket/polling configuration

### Debug Mode

Enable debug logging by setting:

```javascript
// In ApiService.js
console.log("Debug mode enabled");
```

## 📈 Future Enhancements

Potential improvements:

- Real-time WebSocket connections
- Database integration (PostgreSQL, MongoDB)
- User authentication and profiles
- Advanced filtering and search
- Historical data analysis
- Email/SMS notifications
- Performance metrics dashboard

---

🎉 **Congratulations!** You now have a complete frontend dashboard for your UniswapV2 Sandwich Attack Detector!

# Tiffin Tracker

A React Native mobile application built with Expo for tracking daily tiffin (meal) orders and managing member subscriptions.

## Features

- 📅 Daily order tracking
- 👥 Member management
- 💰 Payment tracking
- 📊 Order history
- 📱 Cross-platform (iOS & Android)
- 🌙 Dark mode support
- 💾 Local storage persistence

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation (Bottom Tabs + Native Stack)
- AsyncStorage for data persistence
- date-fns for date manipulation
- Expo Vector Icons

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device (for development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GorakhSawant/tiffin_tracker.git
   cd tiffin_tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
tiffin_tracker/
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # Screen components
│   ├── types/        # TypeScript type definitions
│   └── navigation/   # Navigation configuration
├── assets/          # Static assets
├── App.tsx          # Root component
└── package.json     # Project dependencies
```

## Main Screens

### Today Screen
- Select date
- Choose members for today's order
- Set quantities
- Add notes
- Calculate total amount

### History Screen
- View past orders
- Filter by date
- See order details
- Track payments

### Members Screen
- Add/Edit members
- View member details
- Manage member status

## Data Storage

The app uses AsyncStorage for local data persistence with the following structure:

- `members`: List of registered members
- `orders`: Daily order records
- `settings`: App configuration

## Development

- Use `npm run ios` or `npm run android` for platform-specific development
- Run `npm run web` for web development
- Use `npm start --clear` to clear Metro bundler cache

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

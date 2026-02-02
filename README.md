# Afrimmo AI Agent

An AI-powered assistant for real estate agents in Africa, designed to streamline marketing, lead management, and sales through automated content creation and messaging, integrated with platforms like WhatsApp and Instagram.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Features

- **AI-Powered Lead Scoring**: Automatically prioritize leads based on engagement and intent
- **Smart Content Generation**: Create marketing content for Instagram, WhatsApp, and property listings
- **Lead Management**: Track and manage leads with status updates and notes
- **Property Listings**: Manage property inventory with images and details
- **Marketing Tools**: Generate ad campaigns and social media content
- **Real-time Insights**: Access market data and analytics
- **WhatsApp Integration**: Qualify leads through automated conversations
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- A Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/afrimmo-ai-agent.git
cd afrimmo-ai-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp .env.local.example .env.local
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
NODE_ENV=development

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_LOG_LEVEL=info
```

### API Keys

To get a Google Gemini API key:

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an account or sign in
3. Click on "Get API Key"
4. Follow the instructions to create and enable your API key
5. Add the key to your `.env.local` file

## Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run coverage` - Generate test coverage report

## Testing

The project uses Vitest for unit testing and React Testing Library for component testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

### Writing Tests

Tests should be placed alongside the files they test with the naming convention `*.test.ts` or `*.test.tsx`.

Example test file:
```typescript
// utils/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './helpers';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000000)).toBe('₦1,000,000');
  });
});
```

## Deployment

### Building for Production

```bash
npm run build
```

This creates a `dist/` directory with the production-ready build.

### Deploying to Production

The application can be deployed to any static hosting service. Here are guides for popular platforms:

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to configure your project

#### Netlify
1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Set build command to `npm run build`
4. Set publish directory to `dist`

#### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
3. Run `npm run deploy`

## Project Structure

```
afrimmo-ai-agent/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   └── ...
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external service integrations
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── components/            # Page-level components
├── services/              # Service implementations
├── .env.local             # Local environment variables
├── .env.production        # Production environment variables
├── .gitignore
├── index.html
├── index.tsx              # Application entry point
├── package.json
├── README.md
├── tailwind.config.cjs    # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── vitest.config.ts       # Vitest configuration
```

## API Documentation

### Gemini Service

The application integrates with Google's Gemini AI service for various features:

- Lead scoring and prioritization
- Marketing content generation
- Property valuation
- WhatsApp conversation handling
- Market insights

See `services/geminiService.ts` for implementation details.

### State Management

The application uses React Context for state management. The main state is managed in `src/contexts/AppContext.tsx`.

## Security

### Authentication

The application implements secure token storage and management:
- Tokens are stored with expiration dates
- Refresh tokens are used for extended sessions
- CSRF protection is implemented
- Rate limiting is enforced

### Data Protection

- Input sanitization is performed on all user inputs
- Sensitive data is encrypted before storage
- API requests include security headers
- JWT tokens are validated before use

### Best Practices

- All API calls use HTTPS
- Secrets are stored in environment variables
- Regular dependency updates are recommended
- Security audits should be performed periodically

## Troubleshooting

### Common Issues

#### API Key Not Working
- Verify your Gemini API key is correct
- Check that the environment variable is named `VITE_GEMINI_API_KEY`
- Ensure your API key has the necessary permissions

#### Build Errors
- Run `npm run type-check` to check for TypeScript errors
- Clear the cache: `npm run build -- --emptyOutDir`
- Update dependencies: `npm update`

#### Performance Issues
- Check browser console for errors
- Verify all images are properly sized
- Monitor network requests for slow endpoints

### Getting Help

If you encounter issues not covered here:
1. Check the GitHub issues page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue in the GitHub repository.
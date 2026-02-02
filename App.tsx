

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './src/AppContent';
import { AppProvider } from './src/contexts/AppContext';
import ErrorBoundary from './src/components/ui/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
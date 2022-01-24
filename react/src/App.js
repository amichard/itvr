import axios from 'axios';
import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import settings from './app/settings';
import RushingStatsContainer from './rushing_stats/RusingStatsContainer';

const { API_BASE } = settings;

axios.defaults.baseURL = API_BASE;

const App = () => {
  const { sessionStorage } = window;
  const redirect = sessionStorage.getItem('redirect');
  if (redirect && redirect !== '') {
    sessionStorage.removeItem('redirect');
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <a href="/">
            <div className="logo" />
          </a>
        </div>
      </header>

      <div className="App-body">
        <BrowserRouter>
          {redirect && redirect !== '' && (
            <Navigate to={redirect} />
          )}

          <Routes>
            <Route
              element={<RushingStatsContainer />}
              path="/"
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;

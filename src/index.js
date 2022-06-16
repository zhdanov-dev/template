import React from 'react';
import ReactDOM from 'react-dom';
import '../src/App.css';
import Root from './Root';
import ThemeProvider from './ThemeProvider';
import './theme.css';


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


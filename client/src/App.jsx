import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './hooks/ThemeContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* AppRoutes handles which page to show based on the URL */}
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
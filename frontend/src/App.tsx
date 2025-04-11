import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/layout/Header/Header';
import { AppRoutes } from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AppRoutes />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
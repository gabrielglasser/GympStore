import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/layout/Header/Header';
import { AppRoutes } from './routes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Footer } from './components/layout/Footer/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <Header />
            <AppRoutes />
            <Footer />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
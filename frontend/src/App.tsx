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
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                  padding: '16px',
                },
                success: {
                  duration: 2000,
                  iconTheme: {
                    primary: '#22C55E',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
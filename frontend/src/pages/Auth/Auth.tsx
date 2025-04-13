import React, { useState, FormEvent } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import styles from './Auth.module.scss';
import { useAuth } from '../../contexts/AuthContext';

const Auth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      console.error('As senhas não coincidem');
      return;
    }
    try {
      setLoading(true);
      await signUp(registerData.name, registerData.email, registerData.password);
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className={`${styles.auth} ${isSignUpMode ? styles.signUpMode : ''}`}>
      <div className={styles.container}>
        <div className={styles.formsContainer}>
          <div className={`${styles.signInSignUp} ${isSignUpMode ? styles.signUpMode : ''}`}>
            {/* Sign In Form */}
            <form className={`${styles.form} ${styles.signInForm}`} onSubmit={handleSignIn}>
              <h2>Entrar</h2>
              <div className={styles.formGroup}>
                <Mail className={styles.icon} size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <Lock className={styles.icon} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  required
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button className={styles.submitButton} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Sign Up Form */}
            <form className={`${styles.form} ${styles.signUpForm}`} onSubmit={handleSignUp}>
              <h2>Cadastro</h2>
              <div className={styles.formGroup}>
                <User className={styles.icon} size={20} />
                <input
                  type="text"
                  placeholder="Nome"
                  required
                  value={registerData.name}
                  onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <Mail className={styles.icon} size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <Lock className={styles.icon} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  required
                  value={registerData.password}
                  onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className={styles.formGroup}>
                <Lock className={styles.icon} size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar Senha"
                  required
                  value={registerData.confirmPassword}
                  onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button className={styles.submitButton} disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
          </div>
        </div>

        <div className={`${styles.overlayContainer} ${isSignUpMode ? styles.signUpMode : ''}`}>
          <div className={`${styles.overlay} ${isSignUpMode ? styles.signUpMode : ''}`}>
            <div className={`${styles.panel} ${styles.leftPanel}`}>
              <div className={styles.content}>
                <h3>Já tem uma conta?</h3>
                <p>Faça login para acessar sua conta e aproveitar as melhores ofertas em suplementos!</p>
                <Button variant="outline" onClick={toggleMode}>
                  Entrar
                </Button>
              </div>
            </div>
            <div className={`${styles.panel} ${styles.rightPanel}`}>
              <div className={styles.content}>
                <h3>Novo por aqui?</h3>
                <p>Cadastre-se agora para ter acesso a preços exclusivos e promoções especiais!</p>
                <Button variant="outline" onClick={toggleMode}>
                  Cadastrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
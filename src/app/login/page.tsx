"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { PublicRoute } from "@/components/PublicRoute";
import styles from "./page.module.css";
import { IoLockClosed, IoMailOutline, IoEyeOutline, IoEyeOffOutline, IoAlertCircle } from "react-icons/io5";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    setError("");
    const ok = await login(trimmedEmail, trimmedPassword);
    if (!ok) {
      setError("Usuário ou senha inválidos. Verifique seus dados ou tente novamente mais tarde.");
    } else {
      router.push("/start");
    }
  };

  const canSubmit = email.trim() && password.trim() && isValidEmail(email) && !isLoading;

  return (
    <PublicRoute>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleLogin} autoComplete="on">
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <IoLockClosed size={32} className={styles.logoIcon} />
              </div>
            </div>
            <h1 className={styles.title}>Bem-vindo(a)</h1>
            <p className={styles.subtitle}>Entre na sua conta para continuar</p>
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <IoMailOutline size={20} className={styles.inputIcon} />
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                onKeyDown={e => {
                  if (e.key === 'Enter') passwordInputRef.current?.focus();
                }}
              />
            </div>
            {email.length > 0 && !isValidEmail(email) && (
              <span className={styles.fieldError}>Email inválido</span>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <IoLockClosed size={20} className={styles.inputIcon} />
              <input
                id="password"
                className={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                ref={passwordInputRef}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
          </div>
          <div className={styles.forgotPassword}>
            <button type="button" className={styles.forgotPasswordText} tabIndex={0}>
              Esqueci minha senha
            </button>
          </div>
          {error && (
            <div className={styles.errorContainer}>
              <IoAlertCircle size={16} className={styles.errorIcon} />
              <span className={styles.error}>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className={`${styles.button} ${!canSubmit ? styles.buttonDisabled : ""}`}
            disabled={!canSubmit}
          >
            {isLoading ? (
              <span className={styles.loading}>Carregando...</span>
            ) : (
              <span className={`${styles.buttonText} ${!canSubmit ? styles.buttonTextDisabled : ""}`}>Entrar</span>
            )}
          </button>
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>ou</span>
            <div className={styles.dividerLine} />
          </div>
          <div className={styles.registerContainer}>
            <span className={styles.registerText}>Não tem uma conta?</span>
            <button
              type="button"
              className={styles.registerLinkText}
              onClick={() => router.push("/register")}
            >
              Registre-se
            </button>
          </div>
          <div className={styles.legalLinks}>
            <button type="button" className={styles.legalLinkText} onClick={() => router.push("/privacy-policy")}>Política de Privacidade</button>
            <span> | </span>
            <button type="button" className={styles.legalLinkText} onClick={() => router.push("/terms-of-service")}>Termos de Uso</button>
          </div>
        </form>
      </div>
    </PublicRoute>
  );
} 
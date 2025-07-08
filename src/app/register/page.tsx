"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { PublicRoute } from "@/components/PublicRoute";
import styles from "../login/page.module.css";
import { IoLockClosed, IoMailOutline, IoEyeOutline, IoEyeOffOutline, IoAlertCircle, IoPersonOutline } from "react-icons/io5";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationInputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedPasswordConfirmation = passwordConfirmation.trim();
    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedPasswordConfirmation) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError("Email inválido");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (trimmedPassword !== trimmedPasswordConfirmation) {
      setError("As senhas não coincidem");
      return;
    }
    setError("");
    const ok = await register(trimmedName, trimmedEmail, trimmedPassword, trimmedPasswordConfirmation);
    if (!ok) {
      setError("Erro ao registrar. Verifique seus dados ou tente novamente mais tarde.");
      return;
    }
    router.push("/"); // Redireciona para a home após registro
  };

  const canSubmit = name.trim() && email.trim() && password.trim() && passwordConfirmation.trim() && isValidEmail(email) && password === passwordConfirmation && !isLoading;

  return (
    <PublicRoute>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleRegister} autoComplete="on">
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <IoPersonOutline size={32} className={styles.logoIcon} />
              </div>
            </div>
            <h1 className={styles.title}>Criar conta</h1>
            <p className={styles.subtitle}>Preencha os campos para se registrar</p>
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="name">Nome</label>
            <div className={styles.inputWrapper}>
              <IoPersonOutline size={20} className={styles.inputIcon} />
              <input
                id="name"
                className={styles.input}
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
                onKeyDown={e => {
                  if (e.key === 'Enter') emailInputRef.current?.focus();
                }}
              />
            </div>
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
                ref={emailInputRef}
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
                autoComplete="new-password"
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
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="passwordConfirmation">Confirmar senha</label>
            <div className={styles.inputWrapper}>
              <IoLockClosed size={20} className={styles.inputIcon} />
              <input
                id="passwordConfirmation"
                className={styles.input}
                type={showPasswordConfirmation ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                ref={passwordConfirmationInputRef}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                tabIndex={-1}
              >
                {showPasswordConfirmation ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
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
              <span className={`${styles.buttonText} ${!canSubmit ? styles.buttonTextDisabled : ""}`}>Registrar</span>
            )}
          </button>
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>ou</span>
            <div className={styles.dividerLine} />
          </div>
          <div className={styles.registerContainer}>
            <span className={styles.registerText}>Já tem uma conta?</span>
            <button
              type="button"
              className={styles.registerLinkText}
              onClick={() => router.push("/login")}
            >
              Entrar
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
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { StorageService } from "@/services/storageService";
import styles from "./settings.module.css";
import { AppSettings } from "@/types/Storage";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState<AppSettings>({
    theme: "dark",
    soundEnabled: true,
    hapticEnabled: true,
    autoSave: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (user?.id) {
        try {
          const userSettings = await StorageService.loadSettings(user.id);
          setSettings(userSettings);
        } catch {
          // erro ao carregar settings
        }
      }
    };
    loadSettings();
  }, [user]);

  const handleSettingChange = async (key: keyof AppSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (user?.id) {
      try {
        await StorageService.saveSettings(user.id, newSettings);
      } catch {
        // erro ao salvar settings
      }
    }
  };

  const handleClearData = async () => {
    if (window.confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
      if (user?.id) {
        try {
          await StorageService.clearAllData(user.id);
          alert("Todos os dados foram limpos.");
        } catch {
          alert("Erro ao limpar dados.");
        }
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      await logout();
      router.push("/login");
    }
  };

  const SettingItem = ({
    title,
    subtitle,
    icon,
    type = "toggle",
    value,
    onValueChange,
    onClick,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    type?: "toggle" | "button";
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onClick?: () => void;
  }) => (
    <div className={styles.settingItem}>
      <div className={styles.settingItemGradient}>
        <div className={styles.settingItemContent}>
          <div className={styles.settingItemLeft}>
            <span className={styles.settingIcon}>{icon}</span>
            <div className={styles.settingText}>
              <span className={styles.settingTitle}>{title}</span>
              <span className={styles.settingSubtitle}>{subtitle}</span>
            </div>
          </div>
          {type === "toggle" && (
            <input
              type="checkbox"
              checked={!!value}
              onChange={e => onValueChange && onValueChange(e.target.checked)}
              className={styles.toggleSwitch}
            />
          )}
          {type === "button" && (
            <button className={styles.chevronButton} onClick={onClick} type="button">
              <span className={styles.chevron}>›</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const LegalItem = ({ title, subtitle, href, icon }: { title: string; subtitle: string; href: string; icon: string }) => (
    <a href={href} className={styles.settingItem} style={{ textDecoration: 'none' }}>
      <div className={styles.settingItemGradient}>
        <div className={styles.settingItemContent}>
          <div className={styles.settingItemLeft}>
            <span className={styles.settingIcon}>{icon}</span>
            <div className={styles.settingText}>
              <span className={styles.settingTitle}>{title}</span>
              <span className={styles.settingSubtitle}>{subtitle}</span>
            </div>
          </div>
          <span className={styles.chevron}>›</span>
        </div>
      </div>
    </a>
  );

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        <button className={styles.backButton} onClick={() => router.back()} type="button">
          ← Voltar
        </button>
        <h1 className={styles.title} style={{ margin: 0 }}>
          Configurações
        </h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Preferências</h2>
        <SettingItem
          title="Salvamento Automático"
          subtitle="Salvar progresso automaticamente"
          icon="💾"
          type="toggle"
          value={settings.autoSave}
          onValueChange={value => handleSettingChange("autoSave", value)}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Dados</h2>
        <SettingItem
          title="Limpar Dados"
          subtitle="Remover todos os dados salvos"
          icon="🗑️"
          type="button"
          onClick={handleClearData}
        />
        <SettingItem
          title="Exportar Dados"
          subtitle="Fazer backup dos seus dados"
          icon="📤"
          type="button"
          onClick={() => alert("Funcionalidade em desenvolvimento")}
        />
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Legal</h2>
        <LegalItem
          title="Política de Privacidade"
          subtitle="Como tratamos seus dados"
          href="/privacy-policy"
          icon="🔒"
        />
        <LegalItem
          title="Termos de Serviço"
          subtitle="Regras de uso da plataforma"
          href="/terms-of-service"
          icon="📄"
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Conta</h2>
        <SettingItem
          title="Sair da Conta"
          subtitle="Fazer logout da aplicação"
          icon="🚪"
          type="button"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
} 
import { useState, useEffect, useRef } from 'react';

const PASS_KEY = 'budget_password';
const AUTH_KEY = 'budget_session_auth'; // sessionStorage — живёт до закрытия вкладки

const ACCENT = '#e07a5f';
const TEXT = '#4a3b32';
const TEXT2 = '#7b6b5e';
const BORDER = '#f5e6dc';

type Props = {
  children: React.ReactNode;
  locked: boolean; // true = эта вкладка требует пароля
};

export default function PinLock({ children, locked }: Props) {
  const hasPassword = !!localStorage.getItem(PASS_KEY);
  const isAuthed    = !!sessionStorage.getItem(AUTH_KEY);

  // Если вкладка не защищена или уже авторизован — показываем контент
  if (!locked || isAuthed || !hasPassword) {
    return <>{children}</>;
  }

  return <LockScreen />;
}

function LockScreen() {
  const [input, setInput]   = useState('');
  const [error, setError]   = useState('');
  const [shake, setShake]   = useState(false);
  const [, forceRender]     = useState(0);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = () => {
    const stored = localStorage.getItem(PASS_KEY);
    if (input === stored) {
      sessionStorage.setItem(AUTH_KEY, '1');
      forceRender(n => n + 1);
    } else {
      setError('Неверный пароль');
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '40vh', gap: 20,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.9)', borderRadius: 28, padding: '36px 32px',
        border: `1px solid ${BORDER}`, boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        maxWidth: 360, width: '100%',
        animation: shake ? 'shake 0.4s ease' : undefined,
      }}>
        <div style={{ fontSize: '2.5rem' }}>🔒</div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: TEXT }}>Введите пароль</div>

        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Пароль"
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 14,
            border: `1.5px solid ${error ? '#e07a5f' : BORDER}`,
            background: '#fffaf6', fontSize: '1rem', color: TEXT,
            outline: 'none', fontFamily: "'Nunito', sans-serif",
            textAlign: 'center', letterSpacing: '0.1em',
          }}
        />

        {error && <div style={{ color: ACCENT, fontSize: '0.88rem', marginTop: -8 }}>{error}</div>}

        <button
          onClick={submit}
          style={{
            width: '100%', padding: '12px', borderRadius: 14, border: 'none',
            background: ACCENT, color: 'white', fontWeight: 700,
            fontSize: '1rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
          }}
        >
          Войти
        </button>

        <div style={{ fontSize: '0.8rem', color: TEXT2, textAlign: 'center', lineHeight: 1.5 }}>
          Пароль хранится только на этом устройстве.<br />
          После закрытия вкладки потребуется ввести снова.
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

// ── Компонент настройки пароля (для вкладки Настройки) ──
export function PasswordSettings() {
  const [current,  setCurrent]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [msg,      setMsg]      = useState('');
  const [isError,  setIsError]  = useState(false);

  const hasPassword = !!localStorage.getItem(PASS_KEY);

  const save = () => {
    if (hasPassword && current !== localStorage.getItem(PASS_KEY)) {
      setMsg('Неверный текущий пароль'); setIsError(true); return;
    }
    if (newPass.length < 4) {
      setMsg('Минимум 4 символа'); setIsError(true); return;
    }
    if (newPass !== confirm) {
      setMsg('Пароли не совпадают'); setIsError(true); return;
    }
    localStorage.setItem(PASS_KEY, newPass);
    sessionStorage.setItem(AUTH_KEY, '1');
    setMsg('✅ Пароль сохранён'); setIsError(false);
    setCurrent(''); setNewPass(''); setConfirm('');
  };

  const remove = () => {
    if (current !== localStorage.getItem(PASS_KEY)) {
      setMsg('Неверный текущий пароль'); setIsError(true); return;
    }
    localStorage.removeItem(PASS_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setMsg('✅ Пароль удалён'); setIsError(false);
    setCurrent('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <div style={{ fontWeight: 700, color: TEXT, fontSize: '1rem', marginBottom: 4 }}>
        🔒 {hasPassword ? 'Изменить пароль' : 'Установить пароль'}
      </div>
      <div style={{ fontSize: '0.85rem', color: TEXT2, lineHeight: 1.5 }}>
        Защищает вкладки «Текущий месяц», «Следующий месяц», «История» и «Накопления».<br />
        Сбрасывается при закрытии браузерной вкладки.
      </div>

      {hasPassword && (
        <input type="password" placeholder="Текущий пароль" value={current}
          onChange={e => { setCurrent(e.target.value); setMsg(''); }}
          style={fieldStyle} />
      )}
      <input type="password" placeholder="Новый пароль (мин. 4 символа)" value={newPass}
        onChange={e => { setNewPass(e.target.value); setMsg(''); }}
        style={fieldStyle} />
      <input type="password" placeholder="Повторите новый пароль" value={confirm}
        onChange={e => { setConfirm(e.target.value); setMsg(''); }}
        onKeyDown={e => e.key === 'Enter' && save()}
        style={fieldStyle} />

      {msg && <div style={{ fontSize: '0.88rem', color: isError ? ACCENT : '#5a9a6e' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={save} style={btnStyle(ACCENT)}>
          {hasPassword ? 'Изменить' : 'Установить пароль'}
        </button>
        {hasPassword && (
          <button onClick={remove} style={btnStyle('#7b6b5e')}>Удалить пароль</button>
        )}
      </div>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 12, border: `1px solid ${BORDER}`,
  background: '#fffaf6', fontSize: '0.95rem', color: TEXT,
  outline: 'none', fontFamily: "'Nunito', sans-serif",
};
const btnStyle = (bg: string): React.CSSProperties => ({
  padding: '10px 20px', borderRadius: 12, border: 'none',
  background: bg, color: 'white', fontWeight: 700,
  fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
});

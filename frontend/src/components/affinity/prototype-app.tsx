'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import AppShell, { type AppPage } from './app-shell';
import DiscoverPage from './discover-page';
import HomePage from './home-page';
import Landing, { type AuthResult } from './landing';
import Onboarding from './onboarding';
import Placement from './placement';
import ProfilePage from './profile-page';
import SettingsPage from './settings-page';
import WritePage from './write-page';
import { RightPanelProvider } from '@/lib/right-panel-context';

type Screen = 'landing' | 'onboarding' | 'placement' | 'app';
type Answers = Record<string, string>;

export type UserPosition = { x: number; y: number } | null;

const API = 'http://localhost:8000/api/v1';

async function fetchPosition(answers: Answers): Promise<UserPosition> {
  const texts = Object.values(answers).filter((v) => v.trim().length > 0);
  if (texts.length === 0) return null;
  try {
    const res = await fetch(`${API}/map/position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding_answers: texts }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { x: data.x, y: data.y };
  } catch {
    return null;
  }
}

async function savePosition(token: string, pos: UserPosition): Promise<void> {
  if (!pos) return;
  try {
    await fetch(`${API}/users/me/position`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ x: pos.x, y: pos.y }),
    });
  } catch {
    // non-fatal
  }
}

async function loadPosition(token: string): Promise<UserPosition> {
  try {
    const res = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.map_x == null || data.map_y == null) return null;
    return { x: data.map_x, y: data.map_y };
  } catch {
    return null;
  }
}

export default function PrototypeApp() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [appPage, setAppPage] = useState<AppPage>('home');
  const [answers, setAnswers] = useState<Answers>({});
  const [userPosition, setUserPosition] = useState<UserPosition>(null);
  const [isPositioning, setIsPositioning] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);

  async function handleAuth(result: AuthResult, isNewUser: boolean) {
    setAuthToken(result.token);
    setCurrentUser({ id: result.userId, username: result.username });
    if (isNewUser) {
      setScreen('onboarding');
    } else {
      const pos = await loadPosition(result.token);
      setUserPosition(pos);
      setScreen('app');
      setAppPage('home');
    }
  }

  async function handleFinishOnboarding() {
    setScreen('placement');
    setIsPositioning(true);
    const pos = await fetchPosition(answers);
    setUserPosition(pos);
    if (pos && authToken) {
      await savePosition(authToken, pos);
    }
    setIsPositioning(false);
  }

  return (
    <RightPanelProvider>
    <div className="min-h-screen bg-slate-950">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Landing onAuth={handleAuth} />
          </motion.div>
        )}

        {screen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Onboarding
              answers={answers}
              setAnswers={setAnswers}
              onFinish={handleFinishOnboarding}
            />
          </motion.div>
        )}

        {screen === 'placement' && (
          <motion.div
            key="placement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Placement
              onContinue={() => {
                setScreen('app');
                setAppPage('home');
              }}
              isLoading={isPositioning}
            />
          </motion.div>
        )}

        {screen === 'app' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AppShell current={appPage} setCurrent={setAppPage}>
              {appPage === 'home' && (
                <HomePage onNavigate={setAppPage} userPosition={userPosition} />
              )}
              {appPage === 'write' && (
                <WritePage
                  userPosition={userPosition}
                  onPositionUpdate={(pos) => setUserPosition(pos)}
                />
              )}
              {appPage === 'discover' && <DiscoverPage />}
              {appPage === 'profile' && <ProfilePage />}
              {appPage === 'settings' && <SettingsPage />}
            </AppShell>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </RightPanelProvider>
  );
}

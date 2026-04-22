'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, X, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { t } from '@/lib/tokens';
import { starterThoughts } from './data';

const API = 'http://localhost:8000';

export type AuthResult = {
  token: string;
  userId: number;
  username: string;
};

type LandingProps = {
  onAuth: (result: AuthResult, isNewUser: boolean) => void;
};

type ModalMode = 'signup' | 'login';

function AuthModal({
  initialMode,
  onClose,
  onAuth,
}: {
  initialMode: ModalMode;
  onClose: () => void;
  onAuth: (result: AuthResult, isNewUser: boolean) => void;
}) {
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const body = mode === 'signup' ? { email, username, password } : { email, password };
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = data.detail;
        let message = 'Something went wrong.';
        if (typeof detail === 'string') {
          message = detail;
        } else if (Array.isArray(detail) && detail.length > 0) {
          const msg = detail[0]?.msg;
          if (typeof msg === 'string') {
            message = msg.replace(/^Value error,\s*/i, '');
          }
        }
        setError(message);
        return;
      }
      localStorage.setItem('affinity_token', data.access_token);
      onAuth({ token: data.access_token, userId: data.user_id, username: data.username }, mode === 'signup');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <Card className={cn(t.card, 'shadow-2xl')}>
          <CardContent className="p-7">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className={cn('text-lg font-semibold', t.fg)}>
                {mode === 'signup' ? 'Create account' : 'Welcome back'}
              </div>
              <button onClick={onClose} className={cn('rounded-xl p-1.5 transition hover:bg-app-surface-hover', t.fgMuted)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode toggle */}
            <div className={cn('mb-6 flex rounded-2xl p-1', t.inner)}>
              {(['signup', 'login'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={cn(
                    'flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200',
                    mode === m ? 'bg-app-action text-app-action-fg shadow-sm' : cn('hover:text-app-fg', t.fgMuted),
                  )}
                >
                  {m === 'signup' ? 'Sign Up' : 'Sign In'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="username-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 72 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1.5">
                      <label className={cn('text-xs font-medium', t.fgMuted)}>Username</label>
                      <Input
                        placeholder="e.g. nikhil"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={cn('h-11 rounded-xl px-4', t.input)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className={cn('text-xs font-medium', t.fgMuted)}>Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={cn('h-11 rounded-xl px-4', t.input)}
                />
              </div>

              <div className="space-y-1.5">
                <label className={cn('text-xs font-medium', t.fgMuted)}>
                  Password
                  {mode === 'signup' && (
                    <span className={cn('ml-1 font-normal', t.fgDim)}>— min. 8 characters</span>
                  )}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn('h-11 rounded-xl px-4 pr-11', t.input)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn('absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition hover:bg-app-surface-hover', t.fgMuted)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className={cn('mt-1 h-11 w-full rounded-xl', t.btnPrimary)}
              >
                {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <p className={cn('mt-5 text-center text-xs', t.fgMuted)}>
              {mode === 'signup' ? 'By joining you agree to write honestly.' : 'Welcome back.'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function Landing({ onAuth }: LandingProps) {
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);

  return (
    <div className={cn('landing-bg', t.page)}>
      <AnimatePresence>
        {modalMode && (
          <AuthModal
            initialMode={modalMode}
            onClose={() => setModalMode(null)}
            onAuth={onAuth}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-app-violet ring-1 ring-app-violet-line">
              <Sparkles className="h-5 w-5 text-app-violet-fg" />
            </div>
            <div>
              <div className={cn('text-lg font-semibold', t.fg)}>Affinity</div>
              <div className={cn('text-xs', t.fgMuted)}>Publish thoughts, not profiles</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setModalMode('login')} className={t.btnGhost}>
              Sign In
            </Button>
            <Button onClick={() => setModalMode('signup')} className={t.btnPrimary}>
              Get Started
            </Button>
          </div>
        </header>

        <section className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge className={cn('mb-5', t.badge)}>
              Thought-based social graph
            </Badge>

            <h1 className={cn('max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl', t.fg)}>
              Publish thoughts, not profiles.
            </h1>

            <p className={cn('mt-6 max-w-xl text-lg leading-8', t.fgSoft)}>
              Write honestly. We place your dot in a shared semantic space, so
              you can discover people who see the world like you do.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={() => setModalMode('signup')} size="lg" className={t.btnPrimary}>
                Start Writing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Write', desc: 'Share a few honest thoughts.' },
                { title: 'Position', desc: 'Your language shapes your place.' },
                { title: 'Discover', desc: 'Find nearby minds and clusters.' }
              ].map((item) => (
                <Card key={item.title} className={t.cardMd}>
                  <CardContent className="p-5">
                    <div className={cn('font-medium', t.fg)}>{item.title}</div>
                    <div className={cn('mt-2 text-sm', t.fgMuted)}>{item.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-app-surface blur-3xl" />

            <Card className={cn(t.card, 'overflow-hidden shadow-2xl backdrop-blur')}>
              <CardContent className="p-0">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className={cn('relative min-h-[520px] border-b p-8 border-app-line lg:border-b-0 lg:border-r')}>
                    {[...Array(22)].map((_, i) => {
                      const left = `${10 + ((i * 17) % 75)}%`;
                      const top = `${8 + ((i * 23) % 80)}%`;
                      const size = 8 + (i % 4) * 4;
                      return (
                        <motion.div
                          key={i}
                          className={cn(
                            'absolute rounded-full',
                            i % 5 === 0 ? 'bg-violet-300/90' : i % 3 === 0 ? 'bg-teal-300/80' : 'bg-white/70'
                          )}
                          style={{ left, top, width: size, height: size }}
                          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 3 + (i % 5), repeat: Infinity, ease: 'easeInOut' }}
                        />
                      );
                    })}
                    <div className={cn('absolute bottom-6 left-6 right-6 p-4', t.overlayLabel)}>
                      <div className={cn('mb-2 text-sm', t.fgMuted)}>Hovered thought</div>
                      <p className={cn('text-sm leading-6', t.fgSoft)}>
                        "I think the need to be known is stronger than the need to be impressive."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <div className={cn('text-sm', t.fgMuted)}>Example thoughts</div>
                      <div className="mt-3 space-y-3">
                        {starterThoughts.slice(0, 3).map((thought) => (
                          <div key={thought} className={cn('p-4 text-sm', t.inner, t.fg)}>
                            {thought}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={cn('p-4', t.accentCard)}>
                      <div className={cn('text-sm font-medium', 'text-app-violet-fg')}>Current cluster</div>
                      <div className={cn('mt-2 text-sm', t.fgSoft)}>
                        Reflective, emotionally precise, open to ambiguity.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

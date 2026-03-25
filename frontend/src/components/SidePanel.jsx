import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { DOMAIN_COLORS } from '../data/users';

const DOMAIN_LABELS = {
  thinker: 'Thinker',
  builder: 'Builder',
  creator: 'Creator',
  connector: 'Connector',
  explorer: 'Explorer',
};

export default function SidePanel() {
  const selectedUser = useStore((s) => s.selectedUser);
  const clearSelectedUser = useStore((s) => s.clearSelectedUser);

  return (
    <AnimatePresence>
      {selectedUser && (
        <motion.div
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '320px',
            height: '100vh',
            background: '#0d0d1a',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* Close button */}
          <button
            onClick={clearSelectedUser}
            className="self-end mb-6 text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ✕
          </button>

          {/* Name */}
          <h2
            className="text-white font-semibold text-xl mb-3"
            style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}
          >
            {selectedUser.name}
          </h2>

          {/* Domain pill */}
          <span
            className="self-start text-xs font-medium px-3 py-1 rounded-full mb-8"
            style={{
              background: `${DOMAIN_COLORS[selectedUser.domain]}22`,
              color: DOMAIN_COLORS[selectedUser.domain],
              border: `1px solid ${DOMAIN_COLORS[selectedUser.domain]}44`,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {DOMAIN_LABELS[selectedUser.domain]}
          </span>

          {/* Quotes */}
          <ul className="flex flex-col gap-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {selectedUser.quotes.map((quote, i) => (
              <li
                key={i}
                style={{
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: '14px',
                  lineHeight: '1.65',
                  fontFamily: 'Georgia, serif',
                  borderLeft: `2px solid ${DOMAIN_COLORS[selectedUser.domain]}55`,
                  paddingLeft: '14px',
                }}
              >
                "{quote}"
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

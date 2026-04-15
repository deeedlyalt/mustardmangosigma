import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, Lightbulb, Link2, Medal } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Hem' },
  { path: '/connections', icon: Link2, label: 'Samband' },
  { path: '/leaderboard', icon: Medal, label: 'Topplista' },
  { path: '/progress', icon: Trophy, label: 'Framsteg' },
  { path: '/tips', icon: Lightbulb, label: 'Tips' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
      <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{label}</span>
              {isActive && (
                <motion.div layoutId="nav-indicator" className="w-1 h-1 rounded-full bg-primary" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

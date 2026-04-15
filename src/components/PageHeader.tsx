import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showHome?: boolean;
  icon?: string;
  colorClass?: string;
}

const PageHeader = ({ title, subtitle, showBack = true, showHome = false, icon, colorClass }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
      {showBack && (
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="p-2 rounded-xl bg-card border border-border shadow-sm">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
      )}
      {showHome && (
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/')} className="p-2 rounded-xl bg-card border border-border shadow-sm">
          <Home size={20} className="text-foreground" />
        </motion.button>
      )}
      <div>
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground">{title}</h1>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default PageHeader;

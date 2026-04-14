import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({ title: 'Inloggad! 🎉', description: 'Välkommen tillbaka!' });
      } else {
        await signUp(email, password, displayName || 'Elev');
        toast({ title: 'Konto skapat! 🎉', description: 'Kolla din e-post för att bekräfta kontot.' });
      }
    } catch (err: any) {
      toast({ title: 'Fel', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-1">🧬 BioPrepp</h1>
          <p className="text-sm text-muted-foreground">Plugga inför nationella provet i biologi</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
          <div className="flex mb-6 bg-muted rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${isLogin ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Logga in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${!isLogin ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Skapa konto
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1">Visningsnamn</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ditt namn"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">E-post</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1">Lösenord</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold text-sm shadow-lg disabled:opacity-50"
            >
              {loading ? '...' : isLogin ? 'Logga in' : 'Skapa konto'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;

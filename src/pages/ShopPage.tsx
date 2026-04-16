import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/context/ProgressContext';
import { shopItems, bannerItems } from '@/data/shopItems';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { Coins, ShoppingBag, Palette, Zap, Check, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShopPage = () => {
  const { coins, spendCoins, activateBoost, purchaseItem, ownsItem, equipBanner, equippedBanner, hasActiveBoost, ownedItems } = useProgress();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<'boosts' | 'banners'>('boosts');

  const handleBuyBoost = (itemId: string, price: number, durationMinutes?: number) => {
    if (coins < price) {
      toast({ title: 'Inte tillräckligt med coins!', description: `Du behöver ${price} coins.`, variant: 'destructive' });
      return;
    }
    const ok = spendCoins(price);
    if (ok && durationMinutes) {
      activateBoost('double-xp', durationMinutes);
      toast({ title: '⚡ Dubbel XP aktiverad!', description: `${durationMinutes} minuter med dubbel XP!` });
    }
  };

  const handleBuyHardMode = (price: number) => {
    if (coins < price) {
      toast({ title: 'Inte tillräckligt med coins!', description: `Du behöver ${price} coins.`, variant: 'destructive' });
      return;
    }
    const ok = spendCoins(price);
    if (ok) {
      purchaseItem('hard-mode');
      toast({ title: '💀 Hard Mode upplåst!', description: 'Du kan nu spela Hard Mode!' });
    }
  };

  const handleBuyBanner = (bannerId: string, price: number) => {
    if (ownsItem(bannerId)) {
      // Already owned, equip/unequip
      if (equippedBanner === bannerId) {
        equipBanner(null);
        toast({ title: 'Banner borttagen' });
      } else {
        equipBanner(bannerId);
        toast({ title: '🎨 Banner utrustad!' });
      }
      return;
    }
    if (coins < price) {
      toast({ title: 'Inte tillräckligt med coins!', description: `Du behöver ${price} coins.`, variant: 'destructive' });
      return;
    }
    const ok = spendCoins(price);
    if (ok) {
      purchaseItem(bannerId);
      equipBanner(bannerId);
      toast({ title: '🎨 Banner köpt och utrustad!' });
    }
  };

  const boostActive = hasActiveBoost('double-xp');

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Shoppen" subtitle="Spendera dina coins!" icon="🛒" showBack />

        {/* Coin balance */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-6 p-4 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-2xl border border-yellow-400/30"
        >
          <Coins className="text-yellow-500" size={24} />
          <span className="text-2xl font-extrabold text-foreground">{coins}</span>
          <span className="text-muted-foreground font-semibold">coins</span>
        </motion.div>

        {boostActive && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-xl text-center">
            <p className="text-sm font-bold text-primary">⚡ Dubbel XP är aktiv!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('boosts')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${tab === 'boosts' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground'}`}
          >
            <Zap size={16} /> Boosts & Lägen
          </button>
          <button
            onClick={() => setTab('banners')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${tab === 'banners' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground'}`}
          >
            <Palette size={16} /> Banners
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'boosts' ? (
            <motion.div key="boosts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {shopItems.map(item => {
                const isHardMode = item.id === 'hard-mode';
                const owned = isHardMode && ownsItem('hard-mode');

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {owned ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/hard-mode')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm whitespace-nowrap"
                      >
                        Spela 💀
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => isHardMode ? handleBuyHardMode(item.price) : handleBuyBoost(item.id, item.price, item.durationMinutes)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
                          coins >= item.price
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Coins size={14} /> {item.price}
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}

              {ownsItem('hard-mode') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/hard-mode')}
                  className="w-full p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  💀 Starta Hard Mode
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div key="banners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
              {bannerItems.map(banner => {
                const owned = ownsItem(banner.id);
                const equipped = equippedBanner === banner.id;

                return (
                  <motion.button
                    key={banner.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBuyBanner(banner.id, banner.price)}
                    className={`relative overflow-hidden rounded-2xl border-2 p-4 text-center transition-colors ${
                      equipped ? 'border-primary bg-primary/10' : owned ? 'border-border bg-card' : 'border-border bg-card'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-20`} />
                    <div className="relative">
                      <span className="text-3xl">{banner.emoji}</span>
                      <p className="font-bold text-foreground mt-1">{banner.name}</p>
                      {owned ? (
                        <p className="text-xs font-semibold mt-1 text-primary">
                          {equipped ? '✅ Utrustad' : 'Tryck för att utrusta'}
                        </p>
                      ) : (
                        <p className="flex items-center justify-center gap-1 text-xs font-bold mt-1 text-muted-foreground">
                          <Coins size={12} className="text-yellow-500" /> {banner.price}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default ShopPage;

import { motion } from 'framer-motion';
import { examTips, chapterKeywords } from '@/data/examTips';
import { chapters, ChapterId } from '@/data/chapters';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';

const chapterColorMap: Record<string, string> = {
  grundbiologi: 'bg-chapter-grundbiologi',
  ekologi: 'bg-chapter-ekologi',
  kroppen: 'bg-chapter-kroppen',
  nervsystemet: 'bg-chapter-nervsystemet',
  genetik: 'bg-chapter-genetik',
  evolution: 'bg-chapter-evolution',
};

const ExamTipsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Provtips" subtitle="Strategier för att lyckas på nationella provet" icon="💡" showBack={false} />

        <div className="space-y-3 mb-8">
          {examTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{tip.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Nyckelord per kapitel</h2>
        <div className="space-y-4">
          {chapters.map((ch) => (
            <motion.div key={ch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ch.icon}</span>
                <h3 className="font-bold text-foreground text-sm">{ch.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chapterKeywords[ch.id as ChapterId].map(word => (
                  <span key={word} className={`${chapterColorMap[ch.id]} text-primary-foreground text-xs px-2.5 py-1 rounded-full font-medium`}>
                    {word}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ExamTipsPage;

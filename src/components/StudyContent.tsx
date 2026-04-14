import { motion } from 'framer-motion';
import { ChapterId } from '@/data/chapters';
import { studyContent, StudySection } from '@/data/studyContent';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface StudyContentProps {
  chapterId: ChapterId;
}

const SectionCard = ({ section, index }: { section: StudySection; index: number }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <h3 className="text-base font-bold text-foreground">{section.title}</h3>
        <span className={`text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-line mb-3">
            {section.content.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-bold text-foreground mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                return <p key={i} className="italic text-primary font-mono text-xs bg-muted px-3 py-1.5 rounded-lg my-1">{line.replace(/\*/g, '')}</p>;
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="pl-4 text-sm">• {renderBold(line.slice(2))}</p>;
              }
              if (/^\d+\./.test(line)) {
                return <p key={i} className="pl-2 text-sm">{renderBold(line)}</p>;
              }
              if (line.trim() === '') return <div key={i} className="h-2" />;
              return <p key={i} className="text-sm">{renderBold(line)}</p>;
            })}
          </div>

          {section.keyPoints && section.keyPoints.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mt-2">
              <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">📌 Viktiga punkter</p>
              <ul className="space-y-1.5">
                {section.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const StudyContentView = ({ chapterId }: StudyContentProps) => {
  const content = studyContent[chapterId];

  if (!content) return <p className="text-muted-foreground text-center py-8">Inget innehåll tillgängligt.</p>;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-muted/50 rounded-2xl p-4 mb-4 border border-border"
      >
        <p className="text-sm text-foreground/80 leading-relaxed">{content.introduction}</p>
      </motion.div>

      {content.sections.map((section, i) => (
        <SectionCard key={i} section={section} index={i} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-4 mt-2"
      >
        <h3 className="text-base font-bold text-foreground mb-2">📝 Sammanfattning</h3>
        <ul className="space-y-2">
          {content.summary.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="text-primary font-bold">{i + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default StudyContentView;

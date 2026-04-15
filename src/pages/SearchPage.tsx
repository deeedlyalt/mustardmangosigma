import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { studyContent } from '@/data/studyContent';
import { chapters, ChapterId } from '@/data/chapters';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  chapterId: ChapterId;
  chapterTitle: string;
  chapterIcon: string;
  sectionTitle: string;
  matchedText: string;
  keyPoints: string[];
  type: 'section' | 'keypoint' | 'summary';
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const found: SearchResult[] = [];
    const seen = new Set<string>();

    for (const chapter of chapters) {
      const content = studyContent[chapter.id];
      if (!content) continue;

      // Search sections
      for (const section of content.sections) {
        const titleMatch = section.title.toLowerCase().includes(q);
        const contentMatch = section.content.toLowerCase().includes(q);
        const keyPointMatches = section.keyPoints?.filter(kp => kp.toLowerCase().includes(q)) || [];

        if (titleMatch || contentMatch || keyPointMatches.length > 0) {
          const key = `${chapter.id}-${section.title}`;
          if (seen.has(key)) continue;
          seen.add(key);

          // Extract a relevant snippet
          let snippet = '';
          if (contentMatch) {
            const idx = section.content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 80);
            const end = Math.min(section.content.length, idx + q.length + 120);
            snippet = (start > 0 ? '...' : '') + section.content.slice(start, end).replace(/\*\*/g, '') + (end < section.content.length ? '...' : '');
          } else if (titleMatch) {
            snippet = section.content.slice(0, 200).replace(/\*\*/g, '') + '...';
          }

          found.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterIcon: chapter.icon,
            sectionTitle: section.title,
            matchedText: snippet,
            keyPoints: keyPointMatches.length > 0 ? keyPointMatches : (section.keyPoints?.slice(0, 2) || []),
            type: keyPointMatches.length > 0 ? 'keypoint' : 'section',
          });
        }
      }

      // Search summaries
      for (const sum of content.summary) {
        if (sum.toLowerCase().includes(q)) {
          const key = `${chapter.id}-summary-${sum.slice(0, 20)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          found.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterIcon: chapter.icon,
            sectionTitle: '📋 Sammanfattning',
            matchedText: sum,
            keyPoints: [],
            type: 'summary',
          });
        }
      }

      // Search introduction
      if (content.introduction.toLowerCase().includes(q)) {
        const key = `${chapter.id}-intro`;
        if (!seen.has(key)) {
          seen.add(key);
          found.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterIcon: chapter.icon,
            sectionTitle: '📖 Introduktion',
            matchedText: content.introduction.slice(0, 200) + '...',
            keyPoints: [],
            type: 'section',
          });
        }
      }
    }

    return found.slice(0, 20);
  }, [query]);

  // Build a glossary of key biology terms from the content
  const glossaryMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;

    const glossary: Record<string, string> = {
      'cell': 'Den minsta enheten som kan kallas levande. Alla organismer är uppbyggda av celler.',
      'cellmembran': 'Ett tunt membran som omger cellen och kontrollerar vad som kommer in och ut.',
      'cellkärna': 'Cellens "hjärna" som innehåller DNA med all genetisk information.',
      'mitokondrie': 'Cellens kraftverk där cellandning sker och energi frigörs.',
      'kloroplast': 'Organell i växtceller där fotosyntes sker – omvandlar solenergi till socker.',
      'fotosyntes': 'Process i växter: koldioxid + vatten + solenergi → socker + syre. Sker i kloroplasterna.',
      'cellandning': 'Process i mitokondrerna: socker + syre → koldioxid + vatten + energi.',
      'dna': 'Deoxiribonukleinsyra – en dubbelspiral som bär all genetisk information. Beståndsdelar: A, T, G, C.',
      'gen': 'En bit av DNA som kodar för ett specifikt protein, vilket påverkar en egenskap.',
      'kromosom': 'DNA upprullat i kompakta strukturer. Människan har 46 kromosomer (23 par).',
      'allel': 'En variant av en gen. Vi har två alleler av varje gen – en från varje förälder.',
      'dominant': 'En allel som uttrycks även med bara en kopia (t.ex. Bb → dominant fenotyp).',
      'recessiv': 'En allel som bara uttrycks med två kopior (bb → recessiv fenotyp).',
      'genotyp': 'Den genetiska uppsättningen hos en organism (t.ex. Bb).',
      'fenotyp': 'De observerbara egenskaperna – det som syns utåt (t.ex. bruna ögon).',
      'mitos': 'Vanlig celldelning: 1 cell → 2 identiska dotterceller med 46 kromosomer. För tillväxt.',
      'meios': 'Reduktionsdelning: 1 cell → 4 könsceller med 23 kromosomer. Sker i könsorgan.',
      'mutation': 'En förändring i DNA-sekvensen. Kan vara neutral, skadlig eller fördelaktig.',
      'naturligt urval': 'De individer med bäst anpassade egenskaper överlever och för vidare sina gener.',
      'evolution': 'Förändring av arters egenskaper över lång tid, driven av naturligt urval och mutationer.',
      'ekosystem': 'Ett avgränsat område med alla levande organismer och den icke-levande miljön.',
      'näringskedja': 'Visar hur energi överförs steg för steg: producent → konsument → toppkonsument.',
      'producent': 'Organism som gör fotosyntes och skapar näring (växter, alger).',
      'konsument': 'Organism som äter andra organismer (växtätare, rovdjur).',
      'nedbrytare': 'Svampar och bakterier som bryter ner dött material och återför näring till marken.',
      'bakterie': 'Encellig prokaryot organism utan cellkärna. Kan vara nyttig eller skadlig.',
      'virus': 'Inte levande! Saknar egen ämnesomsättning. Behöver en värdcell för att föröka sig.',
      'antibiotika': 'Medicin som dödar bakterier. Fungerar INTE mot virus.',
      'antibiotikaresistens': 'När bakterier blir motståndskraftiga mot antibiotika – ett allvarligt globalt hot.',
      'neuron': 'Nervcell som skickar elektriska signaler. Har cellkropp, dendriter och axon.',
      'synaps': 'Kontaktpunkten mellan två neuroner där signalsubstanser frisätts.',
      'hormon': 'Kemiska budbärare som transporteras via blodet och påverkar organ på avstånd.',
      'insulin': 'Hormon från bukspottkörteln som sänker blodsockret.',
      'adrenalin': 'Stresshormon: ökar puls, andning och energi vid "kamp eller flykt".',
      'hemoglobin': 'Protein i röda blodkroppar som binder och transporterar syre.',
      'artär': 'Blodkärl som för blod FRÅN hjärtat. Tjocka väggar, högt tryck.',
      'ven': 'Blodkärl som för blod TILL hjärtat. Har klaffar.',
      'kapillär': 'Mycket tunna blodkärl där utbyte av syre, koldioxid och näring sker.',
      'alveol': 'Lungblåsa där gasutbytet sker – syre in i blodet, koldioxid ut.',
      'reflex': 'Snabb, automatisk reaktion som inte går via hjärnan utan via ryggmärgen.',
      'biologisk mångfald': 'Variation av arter, gener och ekosystem. Hög mångfald = stabilare ekosystem.',
      'symbios': 'Samspel där båda arter gynnas, t.ex. bin och blommor.',
      'parasitism': 'Samspel där en art gynnas och den andra skadas, t.ex. fästingar.',
      'fossil': 'Bevarade rester av forntida organismer i bergarter. Bevis för evolution.',
      'homologa organ': 'Organ med samma grundstruktur men olika funktion – bevisar gemensamt ursprung.',
      'artbildning': 'Processen där en population utvecklas till nya arter genom isolering och urval.',
      'kretslopp': 'Ämnen som kol, kväve och vatten cirkulerar i naturen i kretslopp.',
      'matspjälkning': 'Nedbrytning av mat till små näringsämnen som kroppen kan ta upp.',
      'enzym': 'Protein som påskyndar kemiska reaktioner i kroppen, t.ex. amylas, pepsin.',
      'amylas': 'Enzym i saliven som bryter ner stärkelse till socker.',
      'pepsin': 'Enzym i magen som bryter ner proteiner.',
      'tarmludd': 'Fingerlika utskott i tunntarmen som ökar ytan för näringsupptag.',
      'diabetes': 'Sjukdom där kroppen inte kan reglera blodsockret. Typ 1: kan inte producera insulin.',
      'dopamin': 'Signalsubstans kopplad till belöning och motivation.',
      'serotonin': 'Signalsubstans kopplad till humör och välmående.',
      'prokaryot': 'Cell utan cellkärna, t.ex. bakterier.',
      'eukaryot': 'Cell med cellkärna, t.ex. djur-, växt- och svampceller.',
    };

    // Find exact or partial match
    for (const [term, explanation] of Object.entries(glossary)) {
      if (term === q || q.includes(term) || term.includes(q)) {
        return { term, explanation };
      }
    }
    return null;
  }, [query]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Sök" subtitle="Hitta begrepp och förklaringar" icon="🔍" showBack={false} />

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Sök på begrepp, ämne eller nyckelord..."
            className="pl-10 h-12 rounded-xl text-base bg-card border-border"
            autoFocus
          />
        </div>

        <AnimatePresence mode="wait">
          {query.length < 2 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-muted-foreground text-sm">Skriv minst 2 tecken för att söka</p>
              <p className="text-muted-foreground text-xs mt-1">Sök på t.ex. "fotosyntes", "DNA", "hjärtat"</p>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {glossaryMatch && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-primary" />
                    <h3 className="font-bold text-sm text-primary capitalize">{glossaryMatch.term}</h3>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{glossaryMatch.explanation}</p>
                </motion.div>
              )}

              {results.length > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground mb-3">{results.length} träff{results.length !== 1 ? 'ar' : ''} i studiematerialet</p>
                  <div className="space-y-2">
                    {results.map((r, i) => (
                      <motion.button
                        key={`${r.chapterId}-${r.sectionTitle}-${i}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => navigate(`/chapter/${r.chapterId}`)}
                        className="w-full bg-card border border-border rounded-xl p-3 text-left hover:border-primary/30 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{r.chapterIcon}</span>
                          <span className="text-xs text-muted-foreground font-semibold">{r.chapterTitle}</span>
                          <ChevronRight size={12} className="text-muted-foreground ml-auto" />
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">{r.sectionTitle}</p>
                        {r.matchedText && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{r.matchedText}</p>
                        )}
                        {r.keyPoints.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {r.keyPoints.map((kp, j) => (
                              <span key={j} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{kp}</span>
                            ))}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : !glossaryMatch ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🤔</p>
                  <p className="text-muted-foreground text-sm">Inga resultat för "{query}"</p>
                  <p className="text-muted-foreground text-xs mt-1">Prova ett annat sökord</p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default SearchPage;

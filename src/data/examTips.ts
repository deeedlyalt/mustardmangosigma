import { ChapterId } from './chapters';

export interface ExamTip {
  title: string;
  content: string;
  icon: string;
}

export const examTips: ExamTip[] = [
  { title: 'Läs frågan noga', content: 'Stryka under nyckelord i frågan. Vad frågas det egentligen efter? Många fel beror på att man svarar på fel sak.', icon: '👀' },
  { title: 'Använd biologiska begrepp', content: 'Visa att du kan ämnet genom att använda rätt termer: "cellandning", "naturligt urval", "allel" osv. Det ger poäng!', icon: '📝' },
  { title: 'Förklara sambanden', content: 'På nationella provet vill de att du visar att du förstår HUR saker hänger ihop, inte bara vad de heter.', icon: '🔗' },
  { title: 'Rita om det hjälper', content: 'En enkel skiss av t.ex. en näringskedja, korsningsschema eller cell kan visa att du förstår.', icon: '✏️' },
  { title: 'Svara i flera steg', content: 'Vid öppna frågor: börja med påstående → förklara varför → ge ett exempel. Det ger maximala poäng.', icon: '📊' },
  { title: 'Vanliga misstag att undvika', content: 'Blanda INTE ihop: fotosyntes/cellandning, artär/ven, mitos/meios, dominant/recessiv, DNA/gen/kromosom.', icon: '⚠️' },
  { title: 'Tidplanera', content: 'Dela upp tiden mellan frågorna. Fastna inte på en fråga – gå vidare och kom tillbaka sen.', icon: '⏰' },
  { title: 'Repetera med varierande metoder', content: 'Läs, skriv flashcards, förklara högt, gör quiz. Ju fler sätt du repeterar på, desto bättre fastnar det.', icon: '🔄' },
];

export const chapterKeywords: Record<ChapterId, string[]> = {
  grundbiologi: ['cell', 'cellmembran', 'cellkärna', 'mitokondrie', 'kloroplast', 'cellandning', 'fotosyntes', 'prokaryot', 'eukaryot', 'bakterie', 'virus', 'DNA', 'organism'],
  ekologi: ['ekosystem', 'producent', 'konsument', 'nedbrytare', 'näringskedja', 'näringsväv', 'biologisk mångfald', 'kretslopp', 'fotosyntes', 'symbios', 'population'],
  kroppen: ['matspjälkning', 'enzym', 'tunntarm', 'hjärta', 'artär', 'ven', 'kapillär', 'alveol', 'hemoglobin', 'skelett', 'muskel', 'galla', 'lever'],
  nervsystemet: ['neuron', 'synaps', 'CNS', 'reflex', 'hormon', 'insulin', 'adrenalin', 'storhjärnan', 'lillhjärnan', 'receptor', 'signalsubstans'],
  genetik: ['DNA', 'gen', 'kromosom', 'allel', 'dominant', 'recessiv', 'genotyp', 'fenotyp', 'mutation', 'meios', 'mitos', 'korsningsschema'],
  evolution: ['naturligt urval', 'anpassning', 'fossil', 'Darwin', 'artbildning', 'variation', 'gemensam anfader', 'Homo sapiens', 'selektion'],
};

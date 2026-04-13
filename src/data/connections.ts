import { ChapterId } from './chapters';

export interface ConnectionExercise {
  id: string;
  title: string;
  prompt: string;
  chapters: ChapterId[];
  modelAnswer: string;
}

export const connectionExercises: ConnectionExercise[] = [
  {
    id: 'conn-a',
    title: 'A: Celler och kroppen',
    prompt: 'Förklara hur celler i kroppen samarbetar för att du ska kunna springa. Beskriv vad som händer i muskelceller, blodceller och lungceller.',
    chapters: ['grundbiologi', 'kroppen'],
    modelAnswer: 'När du springer behöver muskelcellerna energi. De utför cellandning: socker + syre → koldioxid + vatten + energi. Lungcellerna (alveolerna) tar upp syre från luften och lämnar av koldioxid. Röda blodkroppar med hemoglobin transporterar syret via blodet till musklerna. Hjärtat pumpar snabbare för att leverera mer syrerikt blod. Allt hänger ihop – från cellen till hela kroppens organsystem.',
  },
  {
    id: 'conn-b',
    title: 'B: Ekologi och evolution',
    prompt: 'Hur hänger ekologi och evolution ihop? Förklara med hjälp av begreppen naturligt urval, anpassning och ekosystem.',
    chapters: ['ekologi', 'evolution'],
    modelAnswer: 'I ett ekosystem finns konkurrens om resurser. Genom naturligt urval överlever de individer som är bäst anpassade till sin miljö. Över tid leder detta till evolution – arterna förändras. T.ex. kan rovdjur utveckla bättre syn, medan bytesdjur utvecklar bättre kamouflage. Ekosystemets förhållanden styr vilka egenskaper som gynnas genom naturligt urval.',
  },
  {
    id: 'conn-c',
    title: 'C: Genetik och evolution',
    prompt: 'Förklara sambandet mellan mutationer, naturligt urval och evolution. Varför är genetisk variation nödvändig för evolution?',
    chapters: ['genetik', 'evolution'],
    modelAnswer: 'Mutationer skapar nya alleler och genetisk variation. Meios och sexuell fortplantning blandar generna ytterligare. Naturligt urval "väljer" de individer med fördelaktiga egenskaper – de överlever och sprider sina gener. Utan variation finns inget att välja bland, och evolution kan inte ske. Mutationer → variation → naturligt urval → evolution.',
  },
  {
    id: 'conn-d',
    title: 'D: Nervsystemet och kroppen',
    prompt: 'Beskriv hur nervsystemet och hormonsystemet samarbetar för att reglera blodsockret efter en måltid.',
    chapters: ['nervsystemet', 'kroppen'],
    modelAnswer: 'Efter en måltid bryts maten ner i matspjälkningssystemet och glukos tas upp i blodet via tunntarmen. Bukspottkörteln känner av det höga blodsockret och utsöndrar hormonet insulin. Insulin transporteras via blodet och hjälper celler i kroppen att ta upp glukos. Nervsystemet övervakar processen – t.ex. kan stress (via adrenalin) tillfälligt höja blodsockret. Samarbetet mellan nerver och hormoner håller blodsockret i balans.',
  },
  {
    id: 'conn-e',
    title: 'E: Grundbiologi och ekologi',
    prompt: 'Förklara sambandet mellan fotosyntes och cellandning och varför de är viktiga för kolets kretslopp.',
    chapters: ['grundbiologi', 'ekologi'],
    modelAnswer: 'Fotosyntes (i kloroplaster): CO₂ + H₂O + solenergi → socker + O₂. Cellandning (i mitokondrier): socker + O₂ → CO₂ + H₂O + energi. Dessa processer är varandras motsatser och driver kolets kretslopp. Växter tar upp CO₂ och binder kol. Djur äter växter och frigör CO₂ genom cellandning. Nedbrytare frigör kol från dött material. Kol cirkulerar ständigt mellan atmosfären och levande organismer.',
  },
  {
    id: 'conn-f',
    title: 'F: Genetik och grundbiologi',
    prompt: 'Förklara var i cellen DNA finns, hur det kopieras vid celldelning och varför detta är viktigt.',
    chapters: ['genetik', 'grundbiologi'],
    modelAnswer: 'DNA finns i cellkärnan, organiserat i 46 kromosomer. Vid mitos kopieras allt DNA exakt så att varje dottercell får en identisk uppsättning med 46 kromosomer. Vid meios halveras antalet till 23 för att bilda könsceller. Korrekt DNA-kopiering är avgörande – fel kan leda till mutationer. DNA styr cellens funktioner genom att koda för proteiner. Utan fungerande celldelning kan kroppen inte växa eller reparera sig.',
  },
];

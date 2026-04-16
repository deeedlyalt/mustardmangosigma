export interface HardModeQuestion {
  id: string;
  question: string;
  topic: string;
  expectedAnswer: string; // used by AI to grade
}

export const hardModeQuestions: HardModeQuestion[] = [
  { id: 'hm1', question: 'Beskriv fotosyntesens process steg för steg och ange den kemiska formeln.', topic: 'Grundbiologi', expectedAnswer: 'Fotosyntes: 6CO₂ + 6H₂O + solenergi → C₆H₁₂O₆ + 6O₂. Växter tar upp koldioxid och vatten, använder solljus för att producera socker och syre i kloroplasterna.' },
  { id: 'hm2', question: 'Förklara hur energin förflyttas genom en näringskedja och varför antalet nivåer är begränsat.', topic: 'Ekologi', expectedAnswer: 'Energi förs från producenter till konsumenter. Bara ca 10% av energin överförs till nästa nivå – resten förbrukas som värme. Därför finns sällan fler än 4-5 nivåer.' },
  { id: 'hm3', question: 'Beskriv blodets väg genom hjärtat, från hålvenen till aorta.', topic: 'Kroppen', expectedAnswer: 'Syrefattigt blod → höger förmak → höger kammare → lungartären → lungorna (gasutbyte) → lungvenen → vänster förmak → vänster kammare → aorta → kroppen.' },
  { id: 'hm4', question: 'Förklara hur en nervimpuls överförs från en neuron till en annan via synapsen.', topic: 'Nervsystemet', expectedAnswer: 'Elektrisk signal når axonänden → signalsubstanser frisätts i synaptiska spalten → binder till receptorer på nästa neuron → ny elektrisk signal startas.' },
  { id: 'hm5', question: 'Vad är naturligt urval och hur leder det till evolution? Ge ett exempel.', topic: 'Evolution', expectedAnswer: 'Individer med egenskaper som ger bättre överlevnad och fortplantning i sin miljö sprider sina gener mer. Över generationer förändras populationen. Exempel: pepparfjärilar – mörkare varianter överlevde bättre i smutsiga industrimiljöer.' },
  { id: 'hm6', question: 'Förklara skillnaden mellan dominant och recessiv nedärvning med ett korsningsschema.', topic: 'Genetik', expectedAnswer: 'Dominant allel (stor bokstav) syns även om bara en kopia finns. Recessiv (liten) syns bara vid dubbel uppsättning. Korsning Aa × Aa → 25% AA, 50% Aa, 25% aa. 75% visar dominant fenotyp.' },
  { id: 'hm7', question: 'Beskriv kolets kretslopp och förklara människans påverkan på det.', topic: 'Ekologi', expectedAnswer: 'Kol cirkulerar: fotosyntes binder CO₂, cellandning och förbränning frigör CO₂. Fossila bränslen frigör gammalt kol snabbt, ökar CO₂ i atmosfären, förstärker växthuseffekten.' },
  { id: 'hm8', question: 'Hur fungerar immunförsvaret? Beskriv skillnaden mellan det medfödda och det förvärvade immunförsvaret.', topic: 'Kroppen', expectedAnswer: 'Medfött: ospecifikt, snabbt – hud, slemhinnor, fagocyter. Förvärvat: specifikt, långsammare – T-celler och B-celler, producerar antikroppar, ger minnesceller för framtida infektioner.' },
  { id: 'hm9', question: 'Vad är en mutation och hur kan den påverka en organism? Ge exempel på positiva och negativa mutationer.', topic: 'Genetik', expectedAnswer: 'Mutation = förändring i DNA-sekvensen. Kan vara neutral, skadlig (t.ex. cystisk fibros) eller fördelaktig (t.ex. resistens mot sjukdom). Driver evolution genom att skapa variation.' },
  { id: 'hm10', question: 'Förklara hormonernas roll i puberteten. Vilka hormoner är involverade och vad gör de?', topic: 'Nervsystemet', expectedAnswer: 'Hypofysen stimulerar könskörtlarna. Testosteron (pojkar): muskelökning, röstförändring, behåring. Östrogen (flickor): bröstuveckling, menstruation. Tillväxthormon påverkar längdtillväxten.' },
];

import { ChapterId } from './chapters';

export interface StudySection {
  title: string;
  content: string;
  keyPoints?: string[];
  image?: string; // emoji illustration
}

export interface ChapterStudyContent {
  chapterId: ChapterId;
  introduction: string;
  sections: StudySection[];
  summary: string[];
}

export const studyContent: Record<ChapterId, ChapterStudyContent> = {
  grundbiologi: {
    chapterId: 'grundbiologi',
    introduction: 'Alla levande organismer – från de minsta bakterierna till de största valarna – är uppbyggda av celler. Cellen är livets grundläggande byggsten. I det här kapitlet lär du dig om cellens delar, skillnaden mellan olika celltyper, och hur bakterier och virus fungerar.',
    sections: [
      {
        title: '🔬 Cellen – livets byggsten',
        content: 'En cell är den minsta enheten som kan kallas levande. Det finns två huvudtyper av celler:\n\n**Prokaryota celler** (t.ex. bakterier) saknar cellkärna. DNA:t ligger fritt i cytoplasman.\n\n**Eukaryota celler** (t.ex. djur- och växtceller) har en cellkärna som omsluter DNA:t.\n\nAlla celler har ett **cellmembran** som omger cellen och kontrollerar vad som kommer in och ut. Inuti cellen finns **cytoplasma** – en geléaktig vätska där cellens delar (organeller) finns.',
        keyPoints: [
          'Cellen är den minsta levande enheten',
          'Prokaryota celler saknar cellkärna (bakterier)',
          'Eukaryota celler har cellkärna (djur, växter, svampar)',
          'Cellmembranet kontrollerar transport in och ut',
        ],
      },
      {
        title: '🧩 Cellens delar – organeller',
        content: 'Inuti en eukaryot cell finns flera viktiga organeller:\n\n**Cellkärnan** – cellens "hjärna" som innehåller DNA med all genetisk information. Styr cellens funktioner.\n\n**Mitokondrier** – cellens kraftverk. Här sker **cellandningen** där socker bryts ner med hjälp av syre och energi frigörs:\n\n*C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energi*\n\n**Kloroplaster** – finns bara i växtceller! Här sker **fotosyntesen** där koldioxid och vatten omvandlas till socker och syre med hjälp av solljus:\n\n*6CO₂ + 6H₂O + solenergi → C₆H₁₂O₆ + 6O₂*\n\n**Ribosomer** – tillverkar proteiner utifrån instruktioner från DNA.\n\n**Cellvägg** – finns i växtceller (men inte djurceller). Ger cellen stadga och skydd.',
        keyPoints: [
          'Cellkärnan innehåller DNA och styr cellen',
          'Mitokondrier = cellandning = energi',
          'Kloroplaster = fotosyntes (bara växtceller)',
          'Växtceller har cellvägg, djurceller har det inte',
          'Cellandning: socker + syre → koldioxid + vatten + energi',
          'Fotosyntes: koldioxid + vatten + solenergi → socker + syre',
        ],
      },
      {
        title: '🦠 Bakterier',
        content: 'Bakterier är encelliga prokaryota organismer – de saknar cellkärna. De finns överallt: i marken, i luften, i vatten och i vår kropp.\n\n**Nyttiga bakterier:**\n- Tarmbakterier som hjälper oss bryta ner mat\n- Mjölksyrabakterier som används för att göra yoghurt och ost\n- Bakterier i marken som bryter ner dött material (nedbrytare)\n\n**Skadliga bakterier:**\n- Kan orsaka infektioner som halsfluss och lunginflammation\n- Bekämpas med **antibiotika** – medicin som dödar bakterier\n\n⚠️ **Antibiotikaresistens** är ett stort problem! Om antibiotika används felaktigt kan bakterier bli resistenta (motståndskraftiga) och medicinerna slutar fungera.',
        keyPoints: [
          'Bakterier är prokaryota – saknar cellkärna',
          'De flesta bakterier är ofarliga eller nyttiga',
          'Antibiotika dödar bakterier men inte virus',
          'Antibiotikaresistens är ett allvarligt hot',
        ],
      },
      {
        title: '🧫 Virus',
        content: 'Virus är **inte levande organismer**! De saknar egen ämnesomsättning och kan inte föröka sig utan en värdcell.\n\nSå här fungerar virus:\n1. Viruset fäster vid en värdcell\n2. Det injicerar sitt DNA eller RNA\n3. Värdcellen tvingas tillverka nya viruspartiklar\n4. Cellen spricker och nya virus sprids\n\n**Skillnader mellan virus och bakterier:**\n- Virus är mycket mindre än bakterier\n- Virus kan inte föröka sig själva\n- Antibiotika fungerar INTE mot virus\n- Vaccination kan skydda mot virus\n\nExempel på virussjukdomar: influensa, covid-19, vattkoppor.',
        keyPoints: [
          'Virus är inte levande – saknar egen ämnesomsättning',
          'Behöver en värdcell för att föröka sig',
          'Antibiotika fungerar INTE mot virus',
          'Virus är mycket mindre än bakterier',
        ],
      },
      {
        title: '🔄 Encelliga & flercelliga organismer',
        content: '**Encelliga organismer** består av bara en enda cell som sköter allt: ta upp näring, förflytta sig, föröka sig. Exempel: bakterier, amöbor.\n\n**Flercelliga organismer** har miljontals celler med olika funktioner. Cellerna är specialiserade – muskelceller drar ihop sig, nervceller skickar signaler, blodceller transporterar syre. Exempel: djur, växter, människor.\n\nOrganisationsnivåer:\n**Celler → Vävnader → Organ → Organsystem → Organism**\n\nExempel: Muskelceller bildar muskelvävnad → hjärtat (organ) → cirkulationssystemet → hela kroppen.',
        keyPoints: [
          'Encelliga organismer = en cell gör allt',
          'Flercelliga organismer = specialiserade celler',
          'Cell → vävnad → organ → organsystem → organism',
        ],
      },
    ],
    summary: [
      'Cellen är livets minsta enhet med cellmembran, cytoplasma och (i eukaryoter) cellkärna',
      'Mitokondrier gör cellandning (energi), kloroplaster gör fotosyntes (socker + syre)',
      'Bakterier är levande encelliga prokaryoter – kan vara nyttiga eller skadliga',
      'Virus är inte levande och behöver en värdcell – antibiotika hjälper inte',
      'Flercelliga organismer har specialiserade celler organiserade i vävnader, organ och organsystem',
    ],
  },

  ekologi: {
    chapterId: 'ekologi',
    introduction: 'Ekologi handlar om hur levande organismer samspelar med varandra och med sin miljö. I det här kapitlet lär du dig om ekosystem, näringskedjor, kretslopp och varför biologisk mångfald är så viktig.',
    sections: [
      {
        title: '🌍 Ekosystem',
        content: 'Ett **ekosystem** är ett avgränsat område i naturen som inkluderar alla levande organismer (biotiska faktorer) och den icke-levande miljön (abiotiska faktorer som vatten, temperatur, ljus och mark).\n\nExempel på ekosystem: en sjö, en skog, en äng, ett korallrev.\n\nI varje ekosystem finns det tre grupper av organismer:\n\n**Producenter** – växter och alger som gör fotosyntes och skapar näring från solenergi\n\n**Konsumenter** – djur som äter andra organismer:\n- Primärkonsumenter (växtätare, t.ex. kaniner)\n- Sekundärkonsumenter (rovdjur som äter växtätare, t.ex. rävar)\n- Toppkonsumenter (rovdjur utan egna fiender, t.ex. örnar)\n\n**Nedbrytare** – svampar och bakterier som bryter ner dött material och återför näring till marken',
        keyPoints: [
          'Ekosystem = levande organismer + icke-levande miljö',
          'Producenter gör fotosyntes (växter, alger)',
          'Konsumenter äter andra organismer',
          'Nedbrytare bryter ner dött material',
        ],
      },
      {
        title: '🔗 Näringskedjor & näringsvävar',
        content: 'En **näringskedja** visar hur energi överförs steg för steg:\n\n*Gräs → Kanin → Räv → Örn*\n\nProducent → Primärkonsument → Sekundärkonsument → Toppkonsument\n\nViktigt: I varje steg förloras ca 90% av energin som värme (cellandning). Bara ~10% förs vidare till nästa nivå. Därför finns det fler växtätare än rovdjur.\n\nEn **näringsväv** är ett nätverk av många sammankopplade näringskedjor – det visar den verkliga komplexiteten i ett ekosystem.\n\n**Vad händer om en art försvinner?**\nOm toppkonsumenten (t.ex. vargen) försvinner kan bytesdjuren (t.ex. rådjur) öka okontrollerat → överbetning → ekosystemet blir obalanserat.',
        keyPoints: [
          'Energin minskar med ~90% i varje steg',
          'Därför finns fler växtätare än rovdjur',
          'Näringsväv = många sammankopplade näringskedjor',
          'Om en art försvinner påverkas hela ekosystemet',
        ],
      },
      {
        title: '☀️ Fotosyntesen',
        content: 'Fotosyntesen är den viktigaste processen på jorden! Den sker i växternas kloroplaster.\n\n**Formel:**\n*6CO₂ + 6H₂O + solenergi → C₆H₁₂O₆ + 6O₂*\n\nKoldioxid + vatten + solenergi → socker + syre\n\n**Varför är fotosyntesen så viktig?**\n- Producerar syre som vi andas\n- Skapar näring (socker) som alla andra organismer i ekosystemet är beroende av\n- Tar upp koldioxid från atmosfären\n\nFotosyntesen är motsatsen till cellandning – de bildar ett kretslopp!',
        keyPoints: [
          'Fotosyntes: CO₂ + H₂O + solenergi → socker + O₂',
          'Sker i kloroplaster',
          'Producerar syre och näring',
          'Motsatsen till cellandning',
        ],
      },
      {
        title: '♻️ Kretslopp',
        content: '**Kolets kretslopp:**\n1. Växter tar upp CO₂ från luften vid fotosyntes\n2. Djur äter växter och får i sig kolet\n3. Cellandning frigör CO₂ tillbaka till luften\n4. Nedbrytare bryter ner döda organismer och frigör CO₂\n5. Förbränning av fossila bränslen frigör lagrad CO₂ (klimatpåverkan!)\n\n**Kvävets kretslopp:**\n1. Kvävefixerande bakterier omvandlar kvävgas (N₂) till näring i marken\n2. Växter tar upp kväve via rötterna\n3. Djur äter växter\n4. Nedbrytare frigör kväve tillbaka till marken\n\n**Vattnets kretslopp:**\nAvdunstning → molnbildning → nederbörd → grundvatten → tillbaka till hav/sjöar',
        keyPoints: [
          'Kol cirkulerar genom fotosyntes, cellandning och förbränning',
          'Fossila bränslen stör kolets kretslopp → klimatförändringar',
          'Kväve fixeras av bakterier och cirkulerar via växter och djur',
          'Ämnen återvinns – energi förbrukas',
        ],
      },
      {
        title: '🌸 Biologisk mångfald & samspel',
        content: '**Biologisk mångfald** = variation av arter, gener och ekosystem.\n\nHög mångfald gör ekosystem mer stabila – om en art försvinner kan andra ta över.\n\n**Hot mot biologisk mångfald:**\n- Avskogning och förstöring av livsmiljöer\n- Föroreningar och övergödning\n- Överfiske och överkonsumtion\n- Klimatförändringar\n- Invasiva arter\n\n**Samspel mellan arter:**\n- **Symbios** – båda arter gynnas (t.ex. bin och blommor)\n- **Parasitism** – en art gynnas, den andra skadas (t.ex. fästingar)\n- **Konkurrens** – arter tävlar om samma resurser\n- **Predation** – rovdjur jagar bytesdjur\n\n**Ekosystemtjänster** – tjänster naturen ger oss gratis: pollinering, vattenrening, syreproduktion, livsmedel.',
        keyPoints: [
          'Hög mångfald = mer stabila ekosystem',
          'Människan hotar mångfalden genom avskogning, föroreningar m.m.',
          'Symbios, parasitism, konkurrens och predation',
          'Naturen ger oss viktiga ekosystemtjänster',
        ],
      },
    ],
    summary: [
      'Ekosystem består av producenter, konsumenter och nedbrytare',
      'Energin minskar ~90% i varje steg i näringskedjan',
      'Fotosyntesen ger oss syre och näring, cellandningen frigör energi',
      'Kol, kväve och vatten cirkulerar i kretslopp',
      'Biologisk mångfald är avgörande för stabila ekosystem',
    ],
  },

  kroppen: {
    chapterId: 'kroppen',
    introduction: 'Din kropp är en fantastisk maskin med organ och system som samarbetar för att hålla dig vid liv. I det här kapitlet lär du dig om matspjälkning, blodcirkulation, andning och skelettet.',
    sections: [
      {
        title: '🍽️ Matspjälkningen',
        content: 'Matspjälkning är nedbrytning av mat till små näringsämnen som kroppen kan ta upp.\n\n**Vägen genom matspjälkningskanalen:**\n\n1. **Munnen** – tänderna tuggar och enzymet **amylas** i saliven börjar bryta ner stärkelse\n2. **Matstrupen** – maten transporteras ner till magen med muskelrörelser (peristaltik)\n3. **Magen** – saltsyra dödar bakterier, enzymet pepsin bryter ner proteiner\n4. **Tunntarmen** – här sker det mesta! Galla från levern bryter ner fett. Enzymer bryter ner alla näringsämnen. Näring tas upp genom **tarmluddet** (fingerlika utskott med stor yta)\n5. **Tjocktarmen** – vatten och salter tas upp. Resten blir avföring\n\n**Leverns roll:** Producerar galla, lagrar näring, renar blodet från gifter\n\n**Bukspottkörteln:** Producerar enzymer och hormonet insulin',
        keyPoints: [
          'Matspjälkningen börjar i munnen (amylas)',
          'Magen bryter ner protein med pepsin + saltsyra',
          'Tunntarmen: största upptagningen via tarmluddet',
          'Levern producerar galla som bryter ner fett',
          'Tjocktarmen tar upp vatten',
        ],
      },
      {
        title: '❤️ Blodcirkulationen',
        content: '**Hjärtat** är en muskel som pumpar blod genom kroppen. Det har fyra rum:\n- Höger förmak & höger kammare (syrefattigt blod)\n- Vänster förmak & vänster kammare (syrerikt blod)\n\n**Blodets kretslopp:**\n1. Syrefattigt blod → höger förmak → höger kammare → **lungorna** (tar upp syre)\n2. Syrerikt blod → vänster förmak → vänster kammare → ut i kroppen via **aorta**\n\n**Tre typer av blodkärl:**\n- **Artärer** – för blod FRÅN hjärtat. Tjocka elastiska väggar, högt tryck\n- **Kapillärer** – mycket tunna kärl där utbyte av syre, CO₂ och näring sker\n- **Vener** – för blod TILL hjärtat. Har klaffar som hindrar blodet att rinna bakåt\n\n**Blodets beståndsdelar:**\n- Röda blodkroppar – innehåller **hemoglobin** som binder syre\n- Vita blodkroppar – bekämpar infektioner (immunförsvaret)\n- Blodplättar – hjälper blodet att levra sig vid sår\n- Plasma – vätska som transporterar allt',
        keyPoints: [
          'Hjärtat har fyra rum och pumpar blod i två kretslopp',
          'Artärer: från hjärtat, vener: till hjärtat',
          'Kapillärer: utbyte av gaser och näring',
          'Hemoglobin i röda blodkroppar transporterar syre',
          'Vita blodkroppar = immunförsvar',
        ],
      },
      {
        title: '🫁 Andningen',
        content: 'Andningens syfte är att förse kroppen med syre och bli av med koldioxid.\n\n**Inandning:**\n- Diafragman dras ner, bröstkorgen utvidgas\n- Luft sugs in genom näsa/mun → luftstrupe → bronker → bronkioler → **alveoler**\n\n**Gasutbyte i alveolerna:**\n- Alveolerna (lungblåsor) har extremt tunna väggar\n- Syre diffunderar från alveolerna till blodet\n- Koldioxid diffunderar från blodet till alveolerna\n- Syre binds till hemoglobin och transporteras till cellerna\n\n**Utandning:**\n- Diafragman slappnar av, bröstkorgen trycks ihop\n- Luft med koldioxid pressas ut\n\n**Cellandning** (sker i alla kroppens celler, i mitokondrerna):\n*C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energi*\n\nDet är cellandningen som ger cellerna energi att fungera!',
        keyPoints: [
          'Gasutbytet sker i alveolerna (lungblåsorna)',
          'Syre → blodet, koldioxid → ut',
          'Diafragman styr inandning och utandning',
          'Cellandning i mitokondrerna ger cellen energi',
        ],
      },
      {
        title: '🦴 Skelettet & rörelseapparaten',
        content: '**Skelettets tre huvudfunktioner:**\n1. **Stöd** – ger kroppen form och stadga\n2. **Skydd** – kraniet skyddar hjärnan, revbenen skyddar lungor och hjärta\n3. **Rörelse** – muskler fäster vid ben och möjliggör rörelse\n\n**Leder** – där ben möts:\n- Brosk skyddar benändarna\n- Ledvätska smörjer och minskar friktion\n- Ledband håller ihop leden\n\n**Typer av leder:**\n- Kulleder (höft, axel) – rörliga åt alla håll\n- Gångjärnsleder (knä, armbåge) – rörliga åt ett håll\n\n**Muskler:**\n- Fäster vid ben via senor\n- Arbetar i par: en böjer (biceps) och en sträcker (triceps)\n- Kan bara dra, inte trycka – därför behövs motståndsmuskler\n\nKroppen har ca 206 ben och över 600 muskler!',
        keyPoints: [
          'Skelettets funktioner: stöd, skydd, rörelse',
          'Leder: brosk + ledvätska + ledband',
          'Muskler arbetar i par (böjare & sträckare)',
          'Ca 206 ben och 600+ muskler',
        ],
      },
    ],
    summary: [
      'Matspjälkningen bryter ner mat från mun till tjocktarm – tunntarmen tar upp mest näring',
      'Hjärtat pumpar blod i lilla (lungor) och stora (kroppen) kretsloppet',
      'Artärer: från hjärtat, kapillärer: utbyte, vener: till hjärtat',
      'Gasutbyte sker i alveolerna – syre in, koldioxid ut',
      'Skelettet ger stöd, skydd och rörelse med hjälp av muskler och leder',
    ],
  },

  nervsystemet: {
    chapterId: 'nervsystemet',
    introduction: 'Nervsystemet är kroppens styrsystem – det tar emot information från omvärlden, bearbetar den och skickar signaler till muskler och organ. Tillsammans med hormonsystemet koordinerar det allt som händer i din kropp.',
    sections: [
      {
        title: '🧠 Nervsystemets uppbyggnad',
        content: 'Nervsystemet delas in i två delar:\n\n**Centrala nervsystemet (CNS):**\n- **Hjärnan** – bearbetar information, styr tankar och rörelser\n- **Ryggmärgen** – förmedlar signaler mellan hjärnan och resten av kroppen\n\n**Perifera nervsystemet (PNS):**\n- Alla nerver utanför hjärnan och ryggmärgen\n- Skickar signaler till och från CNS\n\n**Hjärnans delar:**\n- **Storhjärnan** – tankar, minne, medvetna rörelser, sinnesintryck, språk. Har två halvor!\n- **Lillhjärnan** – balans och koordination av rörelser\n- **Hjärnstammen** – styr livsuppehållande funktioner: andning, hjärtslag, sömn\n- **Hypofysen** – "hormonköngens chef" – styr andra hormonkörtlar',
        keyPoints: [
          'CNS = hjärnan + ryggmärgen',
          'PNS = alla nerver i resten av kroppen',
          'Storhjärnan: tankar, minne, medvetna rörelser',
          'Lillhjärnan: balans, koordination',
          'Hjärnstammen: andning, hjärtslag',
        ],
      },
      {
        title: '⚡ Nervceller & signaler',
        content: '**Neuroner (nervceller)** skickar elektriska signaler genom kroppen.\n\nEn neuron har tre delar:\n1. **Cellkropp** – med cellkärna och organeller\n2. **Dendriter** – korta utskott som TAR EMOT signaler\n3. **Axon** – ett långt utskott som SKICKAR VIDARE signaler\n\n**Synapsen** – kontaktpunkten mellan två neuroner:\n- Signalen kan inte hoppa direkt mellan nervceller\n- Istället frisätts **signalsubstanser** (kemiska budbärare)\n- Signalsubstanserna binder till receptorer på nästa neuron och skapar en ny elektrisk signal\n\nExempel på signalsubstanser:\n- **Dopamin** – belöning och motivation\n- **Serotonin** – humör och välmående\n- **Adrenalin/noradrenalin** – stress och vakenhet',
        keyPoints: [
          'Neuroner har cellkropp, dendriter och axon',
          'Dendriter tar emot, axon skickar vidare',
          'Synapser använder kemiska signalsubstanser',
          'Dopamin, serotonin = viktiga signalsubstanser',
        ],
      },
      {
        title: '🦵 Reflexer',
        content: '**Reflexer** är snabba, automatiska reaktioner som skyddar oss.\n\n**Reflexbågen:**\n1. Receptor (t.ex. i huden) registrerar stimulus (smärta/värme)\n2. Sensorisk nerv skickar signal till ryggmärgen\n3. Ryggmärgen skickar signal direkt till motorisk nerv\n4. Motorisk nerv aktiverar muskeln (du drar bort handen)\n\n**Varför är reflexer snabba?**\nSignalen går INTE via hjärnan! Den går direkt genom ryggmärgen, vilket sparar tid.\n\n**Exempel på reflexer:**\n- Dra bort handen från hett föremål\n- Knäreflex (läkaren slår med hammare)\n- Blinkreflex (något kommer mot ögat)\n- Pupillreflex (ögats pupill krymper i starkt ljus)\n\nHjärnan informeras EFTERÅT om vad som hänt.',
        keyPoints: [
          'Reflexer går inte via hjärnan – de är snabbare',
          'Reflexbågen: receptor → sensorisk nerv → ryggmärg → motorisk nerv → muskel',
          'Skyddar oss från skada',
          'Hjärnan informeras efteråt',
        ],
      },
      {
        title: '🧪 Hormonsystemet',
        content: 'Hormoner är **kemiska budbärare** som transporteras via blodet och påverkar organ på avstånd.\n\n**Skillnaden mellan nerver och hormoner:**\n| | Nervsignaler | Hormoner |\n|---|---|---|\n| Hastighet | Snabba (millisekunder) | Långsamma (sekunder–minuter) |\n| Transport | Via nerver | Via blodet |\n| Varaktighet | Kort | Lång |\n| Mål | Specifikt | Brett (många organ) |\n\n**Viktiga hormoner:**\n- **Adrenalin** (binjurarna) – "kamp eller flykt": ökar puls, andning, energi\n- **Insulin** (bukspottkörteln) – sänker blodsockret\n- **Glukagon** (bukspottkörteln) – höjer blodsockret\n- **Tillväxthormon** (hypofysen) – styr tillväxt\n- **Östrogen/testosteron** – könshormonerna, styr pubertet\n- **Melatonin** (tallkottkörteln) – styr dygnsrytm och sömn\n\n**Diabetes typ 1:** Kroppen kan inte producera insulin → blodsockret kan inte regleras → personen måste ta insulin via sprutor.',
        keyPoints: [
          'Hormoner transporteras via blodet – långsammare men mer utbredd effekt',
          'Adrenalin: stresshormon, kamp eller flykt',
          'Insulin: sänker blodsockret',
          'Diabetes typ 1: kroppen kan inte producera insulin',
          'Hypofysen styr många andra hormonkörtlar',
        ],
      },
      {
        title: '👁️ Sinnesorganen',
        content: '**Receptorer** är speciella sinnesceller som tar emot stimuli och omvandlar dem till nervsignaler.\n\n**De fem sinnena:**\n\n👁️ **Syn** – ögat:\n- Hornhinnan och linsen fokuserar ljus på näthinnan\n- Stavar (svart/vitt, mörkerseende) och tappar (färgseende)\n- Synnerven skickar signaler till hjärnan\n\n👂 **Hörsel** – örat:\n- Ljudvågor → trumhinnan → hörselbenen → snäckan → hörselnerven\n\n👃 **Lukt** – näsan:\n- Luktceller i näsans slemhinna känner av kemiska ämnen\n\n👅 **Smak** – tungan:\n- Smaklökar känner av sött, salt, surt, beskt och umami\n\n✋ **Känsel** – huden:\n- Receptorer för tryck, värme, kyla och smärta',
        keyPoints: [
          'Receptorer omvandlar stimuli till nervsignaler',
          'Ögat: stavar (mörker) och tappar (färg)',
          'Örat: trumhinna → hörselbenen → snäckan',
          'Alla sinnesintryck tolkas av hjärnan',
        ],
      },
    ],
    summary: [
      'CNS (hjärna + ryggmärg) bearbetar information, PNS skickar signaler',
      'Neuroner kommunicerar via synapser med signalsubstanser',
      'Reflexer går via ryggmärgen och är snabbare än medvetna reaktioner',
      'Hormoner transporteras i blodet och har långsam men utbredd effekt',
      'Sinnesorganen har receptorer som omvandlar stimuli till nervsignaler',
    ],
  },

  genetik: {
    chapterId: 'genetik',
    introduction: 'Genetik handlar om arv – hur egenskaper överförs från föräldrar till barn genom DNA. I det här kapitlet lär du dig om DNA, gener, kromosomer, hur arv fungerar och varför syskon kan se så olika ut.',
    sections: [
      {
        title: '🧬 DNA – livets kod',
        content: '**DNA (deoxiribonukleinsyra)** är en lång molekyl som bär all genetisk information.\n\n**DNA:s struktur:**\n- Formad som en **dubbelspiral** (dubbelhelix)\n- Består av fyra kvävebaser: **A**denin, **T**ymin, **G**uanin, **C**ytosin\n- Baserna paras ihop: A–T och G–C (komplementära baspar)\n- Ordningen av baserna = den genetiska koden\n\n**Från DNA till egenskap:**\n1. DNA finns i cellkärnan\n2. En **gen** är en bit av DNA som kodar för ett specifikt protein\n3. Proteinet påverkar en egenskap (t.ex. ögonfärg, enzymer)\n\n**Kromosomer:**\n- DNA är upprullat i kompakta strukturer = kromosomer\n- Människan har **46 kromosomer** (23 par)\n- 22 par autosomer + 1 par könskromosomer (XX = kvinna, XY = man)\n- Könsceller (spermier och äggceller) har bara 23 kromosomer',
        keyPoints: [
          'DNA är en dubbelspiral med baserna A, T, G, C',
          'En gen kodar för ett protein → en egenskap',
          'Människan har 46 kromosomer (23 par)',
          'XX = kvinna, XY = man',
          'Könsceller har 23 kromosomer',
        ],
      },
      {
        title: '🎯 Arv – dominant & recessivt',
        content: 'Vi har **två alleler** (varianter) av varje gen – en från mamma och en från pappa.\n\n**Dominant allel (stor bokstav, t.ex. B):**\n- Uttrycks alltid, även med bara en kopia\n- BB eller Bb → dominant fenotyp\n\n**Recessiv allel (liten bokstav, t.ex. b):**\n- Uttrycks bara om det finns två kopior\n- bb → recessiv fenotyp\n\n**Viktiga begrepp:**\n- **Genotyp** = den genetiska uppsättningen (t.ex. Bb)\n- **Fenotyp** = det som syns utåt (t.ex. bruna ögon)\n- **Homozygot** = två lika alleler (BB eller bb)\n- **Heterozygot** = två olika alleler (Bb)\n\n**Korsningsschema (Punnett-ruta):**\nOm båda föräldrarna har genotyp Bb:\n\n|  | B | b |\n|---|---|---|\n| **B** | BB | Bb |\n| **b** | Bb | bb |\n\nResultat: 25% BB, 50% Bb, 25% bb\n→ 75% dominant fenotyp, 25% recessiv fenotyp',
        keyPoints: [
          'Dominant allel: uttrycks med en kopia (Bb → dominant)',
          'Recessiv allel: kräver två kopior (bb → recessiv)',
          'Genotyp = gen-uppsättning, fenotyp = utseende',
          'Korsningsschema visar möjliga avkommor',
        ],
      },
      {
        title: '🔄 Celldelning: mitos & meios',
        content: '**Mitos – vanlig celldelning:**\n- En cell → två identiska dotterceller\n- Varje dottercell har 46 kromosomer\n- Används för: tillväxt, reparation, ersättning av celler\n- DNA kopieras först, sedan delas cellen\n\n**Meios – reduktionsdelning:**\n- En cell → fyra könsceller (spermier eller ägg)\n- Varje könscell har bara **23 kromosomer** (hälften)\n- Sker i äggstockar och testiklar\n- Kromosomerna blandas slumpmässigt → unik kombination\n- **Överkorsning** – bitar av kromosomer byter plats → ännu mer variation!\n\n**Befruktning:**\nSpermie (23) + äggcell (23) = befruktat ägg (46)\n→ Barnet får hälften av sina gener från varje förälder\n\n**Varför ser syskon olika ut?**\nMeios ger slumpmässig blandning av gener + överkorsning = varje könscell är unik. Chansen att två syskon får exakt samma kombination är astronomiskt liten.',
        keyPoints: [
          'Mitos: 1 cell → 2 identiska (46 kromosomer), för tillväxt',
          'Meios: 1 cell → 4 könsceller (23 kromosomer), för fortplantning',
          'Meios ger genetisk variation genom slumpmässig blandning',
          'Befruktning: 23 + 23 = 46 kromosomer',
        ],
      },
      {
        title: '💥 Mutationer',
        content: 'En **mutation** är en förändring i DNA-sekvensen.\n\n**Hur uppstår mutationer?**\n- Slumpmässiga fel vid DNA-kopiering\n- UV-strålning eller kemikalier kan orsaka mutationer\n- De flesta mutationer repareras av cellens system\n\n**Typer av mutationer:**\n- **Neutrala** – ingen märkbar effekt (vanligast)\n- **Skadliga** – kan orsaka sjukdomar (t.ex. cancer, ärftliga sjukdomar)\n- **Fördelaktiga** – ger en fördel i miljön (sällsynt men viktigt för evolution!)\n\n**Mutation + naturligt urval:**\nFördelaktiga mutationer kan spridas i en population genom naturligt urval. T.ex. en mutation som ger resistens mot en sjukdom gör att individen överlever bättre och för mutationen vidare.\n\n**Ärftliga mutationer:**\nMutationer i könsceller kan ärvas till nästa generation. Mutationer i vanliga celler (somatiska) ärvas inte.',
        keyPoints: [
          'Mutation = förändring i DNA',
          'Kan vara neutral, skadlig eller fördelaktig',
          'Fördelaktiga mutationer driver evolution',
          'Bara mutationer i könsceller ärvas',
        ],
      },
    ],
    summary: [
      'DNA är en dubbelspiral med baserna A, T, G, C som kodar för proteiner',
      'Gener ärvas i två kopior (alleler) – dominant vs recessiv',
      'Mitos: tillväxt (46 kromosomer), meios: könsceller (23 kromosomer)',
      'Meios ger genetisk variation – varje könscell är unik',
      'Mutationer är förändringar i DNA som driver evolution',
    ],
  },

  evolution: {
    chapterId: 'evolution',
    introduction: 'Evolution är förändring av arter över tid. Genom naturligt urval anpassas organismer till sin miljö under miljontals år. I det här kapitlet lär du dig om Darwins teori, fossil, artbildning och människans historia.',
    sections: [
      {
        title: '🌱 Vad är evolution?',
        content: '**Evolution** = förändring av arters egenskaper över lång tid.\n\nEvolution drivs av:\n1. **Naturligt urval** – de bäst anpassade överlever\n2. **Mutationer** – slumpmässiga förändringar i DNA ger variation\n3. **Genetisk drift** – slumpmässiga förändringar, särskilt i små populationer\n\n**Viktigt att förstå:**\n- Evolution sker INTE hos individer – det sker i populationer över generationer\n- Organismer "väljer" inte att utvecklas – det sker genom slumpmässig variation + urval\n- Evolution tar ofta tusentals till miljontals år\n- Alla levande varelser har en gemensam anfader',
        keyPoints: [
          'Evolution = förändring av arter över tid',
          'Drivs av naturligt urval, mutationer och genetisk drift',
          'Sker i populationer, inte hos individer',
          'Alla levande varelser har gemensamma förfäder',
        ],
      },
      {
        title: '🔍 Naturligt urval – Darwins teori',
        content: '**Charles Darwin** reste med HMS Beagle till Galápagosöarna (1830-talet) och observerade att finkar på olika öar hade olika näbbformer anpassade till deras föda.\n\n**Naturligt urval i fyra steg:**\n1. **Variation** – individer inom en art ser olika ut (pga genetisk variation)\n2. **Överproduktion** – fler individer föds än miljön kan försörja\n3. **Kamp om överlevnad** – individer konkurrerar om mat, partners och utrymme\n4. **Urval** – de med fördelaktiga egenskaper överlever och for vidare sina gener\n\n**Klassiskt exempel – björkmätarfjärilarna:**\n- Före industrialiseringen: ljusa fjärilar kamouflerade på ljusa björkstammar\n- Under industrialiseringen: stammarna svärtades av sot → mörka fjärilar överlevde bättre\n- Efter luftrening: ljusa fjärilar ökade igen\n\n**Darwin vs Lamarck:**\n- Lamarck trodde att förvärvade egenskaper ärvdes (t.ex. giraffens hals blev lång av att sträcka sig) – FELAKTIGT\n- Darwin visade att variation + urval = evolution – RÄTT',
        keyPoints: [
          'Darwin studerade finkar på Galápagos',
          'Variation → överproduktion → kamp → urval',
          'Björkmätarfjärilarna = klassiskt exempel',
          'Lamarck hade fel: förvärvade egenskaper ärvas inte',
        ],
      },
      {
        title: '🦴 Bevis för evolution',
        content: '**1. Fossil:**\n- Bevarade rester av forntida organismer i bergarter\n- Visar hur arter har förändrats över tid\n- Övergångsformer (t.ex. Archaeopteryx – mellan dinosaurie och fågel)\n- Äldre fossil i djupare lager, nyare nära ytan\n\n**2. Jämförande anatomi:**\n- Homologa organ: samma grundstruktur men olika funktion\n  - Människoarm, valsfena, fladdermusvinge, hästben – alla har samma skelett-grundstruktur!\n  - Bevisar gemensamt ursprung\n\n**3. DNA-jämförelser:**\n- Arter som är nära besläktade har liknande DNA\n- Människan delar ~98% av DNA med schimpanser\n- Alla levande varelser använder DNA = gemensamt ursprung\n\n**4. Embryologi:**\n- Embryon hos olika ryggradsdjur ser väldigt lika ut tidigt i utvecklingen\n- Tyder på gemensam anfader\n\n**5. Vestigiala organ:**\n- Organ som inte längre har funktion men vittnar om evolution\n- Blindtarmen, svanskotan hos människan',
        keyPoints: [
          'Fossil visar arternas förändring över tid',
          'Homologa organ bevisar gemensamt ursprung',
          'DNA-likheter visar släktskap mellan arter',
          'Embryon liknar varandra tidigt → gemensam anfader',
        ],
      },
      {
        title: '🏝️ Artbildning',
        content: '**Artbildning** = processen där en population utvecklas till nya arter.\n\n**Hur bildas nya arter?**\n1. **Geografisk isolering:**\n   - En population delas av en barriär (berg, hav, flod)\n   - Grupperna utsätts för olika miljöer\n   - Naturligt urval och mutationer ger olika egenskaper\n   - Till slut kan de inte längre fortplanta sig med varandra → ny art!\n\n2. **Ekologisk isolering:**\n   - Individer i samma område specialiserar sig på olika nischer\n   - T.ex. olika föda, olika tid på dygnet\n\n**Definition av art:**\nEn grupp organismer som kan fortplanta sig med varandra och få fertil (fortplantningsduglig) avkomma.\n\n**Exempel – Darwins finkar:**\n- En finkart från fastlandet spred sig till Galápagosöarna\n- Olika öar hade olika mat → olika näbbformer utvecklades\n- Nu finns ~15 olika finkarter!',
        keyPoints: [
          'Artbildning sker genom isolering + naturligt urval',
          'Geografisk isolering: barriärer separerar populationer',
          'Art = kan fortplanta sig och få fertil avkomma',
          'Darwins finkar = klassiskt exempel på artbildning',
        ],
      },
      {
        title: '🧑 Människans evolution',
        content: '**Människan (Homo sapiens)** utvecklades i Afrika för ca 300 000 år sedan.\n\n**Vår plats i naturen:**\n- Vi tillhör primater (apor)\n- Vi delar en gemensam anfader med schimpanser (~6–7 miljoner år sedan)\n- Vi härstammar INTE från schimpanser – vi är kusiner!\n\n**Viktiga steg i människans evolution:**\n- **~6–7 miljoner år sedan:** Gemensam anfader med schimpanser\n- **~4 miljoner år sedan:** Australopithecus – gick upprätt, liten hjärna\n- **~2 miljoner år sedan:** Homo erectus – större hjärna, använde verktyg, eld\n- **~300 000 år sedan:** Homo sapiens – modern människa, språk, konst, kultur\n- **~70 000 år sedan:** Homo sapiens lämnade Afrika och spred sig över världen\n\n**Vad gjorde oss till människor?**\n- Upprätt gång → frigjorde händerna\n- Stor hjärna → avancerat tänkande och språk\n- Verktyg och eld → bättre överlevnad\n- Socialt samarbete → kultur och civilisation',
        keyPoints: [
          'Homo sapiens uppstod i Afrika för ~300 000 år sedan',
          'Vi delar anfader med schimpanser – vi härstammar inte från dem',
          'Upprätt gång, stor hjärna och verktyg var avgörande',
          'Människan spred sig från Afrika för ~70 000 år sedan',
        ],
      },
    ],
    summary: [
      'Evolution drivs av naturligt urval, mutationer och genetisk drift',
      'Darwin: variation → överproduktion → kamp → urval',
      'Bevis: fossil, homologa organ, DNA-likheter, embryologi',
      'Artbildning sker genom isolering och naturligt urval',
      'Homo sapiens uppstod i Afrika och spred sig globalt',
    ],
  },
};

import { Answers, DimensionScores, ArchetypeScores, ResultProfile } from '../types/quiz';

/**
 * Calculates raw dimensions and maps them to Atzig, Mausig, Fotzig.
 */
export function calculateResults(name: string, answers: Answers): ResultProfile {
  // Helpers to fetch answer (1-5), or default to 3 (Neutral)
  const val = (id: number): number => answers[id] || 3;
  // Helper to reverse score
  const rev = (id: number): number => 6 - val(id);

  // 1. Big Five Subscales (1 to 5 scale)
  const neuroticism = (val(1) + val(6) + rev(10) + val(14) + val(19)) / 5;
  const extraversion = (val(2) + val(7) + rev(11) + val(15)) / 4;
  const agreeableness = (rev(3) + val(8) + rev(12) + val(16) + rev(20)) / 5;
  const conscientiousness = (rev(4) + val(9) + rev(13) + val(17)) / 4;
  const openness = (val(5) + val(18)) / 2;

  const dimensions: DimensionScores = {
    Neurotizismus: neuroticism,
    Extraversion: extraversion,
    Verträglichkeit: agreeableness,
    Gewissenhaftigkeit: conscientiousness,
    Offenheit: openness,
  };

  // 2. Archetype calculation
  // Mausig: High Neuroticism, High Agreeableness, Low Extraversion
  const rawM = (neuroticism * 1.2 + agreeableness * 1.0 + (6 - extraversion) * 0.8) / 3;
  
  // Atzig: High Extraversion, Low Conscientiousness, High Openness
  const rawA = (extraversion * 1.2 + (6 - conscientiousness) * 1.0 + openness * 0.8) / 3;
  
  // Fotzig: Low Agreeableness, High Conscientiousness, Low Neuroticism (thick skin)
  const rawF = ((6 - agreeableness) * 1.2 + conscientiousness * 1.0 + (6 - neuroticism) * 0.8) / 3;

  // Polarize the raw scores to push results towards the extremes (corners of the ternary plot)
  // By raising them to the power of 4, small differences become large differences.
  const polarizationFactor = 4;
  const polM = Math.pow(rawM, polarizationFactor);
  const polA = Math.pow(rawA, polarizationFactor);
  const polF = Math.pow(rawF, polarizationFactor);

  // Normalize scores to sum to 100% using Largest Remainder Method
  // This eliminates the systematic rounding bias that previously favored Fotzig
  const sumRaw = polM + polA + polF;
  const rawPcts = [
    { key: 'mausig' as const, exact: (polM / sumRaw) * 100 },
    { key: 'atzig' as const, exact: (polA / sumRaw) * 100 },
    { key: 'fotzig' as const, exact: (polF / sumRaw) * 100 },
  ];
  const floored = rawPcts.map(p => ({ ...p, floor: Math.floor(p.exact), remainder: p.exact - Math.floor(p.exact) }));
  let remaining = 100 - floored.reduce((sum, p) => sum + p.floor, 0);
  // Distribute remaining points to entries with largest remainders
  floored.sort((a, b) => b.remainder - a.remainder);
  for (const p of floored) {
    if (remaining > 0) { p.floor += 1; remaining--; }
  }
  const pctMap = Object.fromEntries(floored.map(p => [p.key, p.floor])) as Record<'mausig' | 'atzig' | 'fotzig', number>;
  const mausigPct = pctMap.mausig;
  const atzigPct = pctMap.atzig;
  const fotzigPct = pctMap.fotzig;

  const scores: ArchetypeScores = {
    mausig: mausigPct,
    atzig: atzigPct,
    fotzig: fotzigPct,
  };

  // 3. Find primary and secondary archetypes
  const sorted: { key: 'mausig' | 'atzig' | 'fotzig'; value: number }[] = [
    { key: 'mausig' as const, value: mausigPct },
    { key: 'atzig' as const, value: atzigPct },
    { key: 'fotzig' as const, value: fotzigPct },
  ].sort((a, b) => b.value - a.value);

  const primary = sorted[0].key;
  const secondary = sorted[1].key;

  // 4. Generate profile details based on combinations
  let hybridTitle = '';
  let hybridDescription = '';
  let colorTheme = {
    primary: '#FF69B4',
    secondary: '#39FF14',
    border: 'border-neo-pink',
    bg: 'bg-[#ffebf3]',
    glow: 'shadow-brutal-pink',
  };

  if (primary === 'atzig') {
    if (secondary === 'mausig') {
      hybridTitle = 'Kuschel-Atze';
      hybridDescription = '<strong>Der Comfort-Zone Party Animal.</strong> Du liebst es, am <strong>Wochenende auf Raves</strong> komplett die Kontrolle zu verlieren und die <strong>Atzen-Energie</strong> auf 120% hochzudrehen. Aber sobald die Sonne aufgeht, verwandelt sich der Party-Löwe in eine <strong>schutzbedürftige kleine Maus</strong>. Du brauchst dann sofort eine Decke, <strong>Zuneigung, Snacks</strong> und viel <strong>Social-Battery-Regeneration</strong>. Ein absoluter Schatz, aber man sollte dich vor 14 Uhr nicht ansprechen.';
      colorTheme = {
        primary: '#39FF14', // Lime
        secondary: '#FF69B4', // Pink
        border: 'border-neo-lime',
        bg: 'bg-[#f4fff0]',
        glow: 'shadow-brutal-lime',
      };
    } else {
      hybridTitle = 'Gossen-Snob';
      hybridDescription = '<strong>Die High-Society Chaos-Königin.</strong> Deine Aura ist absolut einschüchternd. Du besitzt einen unverschämt <strong>extravaganten Modegeschmack</strong> und liebst unkonventionelle Kultur – feierst aber am liebsten in den <strong>staubigsten Techno-Kellern</strong>, die das Land zu bieten hat. Du strahlst <strong>extreme Arroganz</strong> aus, während du auf einer <strong>versifften Bierkiste</strong> stehst. Wenn jemand dein Outfit dumm anguckt, wird er mit einem <strong>einzigen Blick vernichtet</strong>. Faszinierend und gefährlich!';
      colorTheme = {
        primary: '#39FF14', // Lime
        secondary: '#FF4500', // Orange
        border: 'border-neo-lime',
        bg: 'bg-[#f4fff0]',
        glow: 'shadow-brutal-lime',
      };
    }
  } else if (primary === 'mausig') {
    if (secondary === 'atzig') {
      hybridTitle = 'Party-Maus';
      hybridDescription = '<strong>Die Aperol-Spritzen-Tanzkönigin.</strong> Im Alltag bist du ein leises, extrem empathisches <strong>kleines Mäuschen</strong>, das sich ständig entschuldigt, wenn jemand anderes ihr auf den Fuß tritt. Du leidest unter <strong>chronischem Overthinking</strong>. Aber wehe, jemand stellt dir <strong>zwei Drinks</strong> oder <strong>gute Bässe</strong> hin! Dann mutierst du blitzschnell zur <strong>absoluten Party-Maus</strong>, stürmst die Tanzfläche und schreist die Songtexte lauter mit als die Boxen erlauben. Deine Freunde lieben dich für dieses irre Jekyll-and-Hyde-Dasein!';
      colorTheme = {
        primary: '#FF69B4', // Pink
        secondary: '#00E5FF', // Blue
        border: 'border-neo-pink',
        bg: 'bg-[#ffebf3]',
        glow: 'shadow-brutal-pink',
      };
    } else {
      hybridTitle = 'Boss-Maus';
      hybridDescription = '<strong>Die Passiv-Aggressive Kuschelextremistin.</strong> Nach außen hin wirkst du <strong>zuckersüß, verletzlich</strong> und extrem harmoniebedürftig. Doch das ist <strong>reine Tarnung</strong>! In Wahrheit bist du ein <strong>knallharter Kontrollfreak</strong>. Du planst Urlaube per <strong>Excel-Tabelle</strong> auf die Minute genau. Wenn jemand unpünktlich ist, speichert dein Gehirn das als <strong>Rache-Konto</strong> ab. Du bist die Königin der <strong>passiven Aggression</strong> („Nein, alles super! :-)“). Jeder spürt deine absolute Macht, aber niemand ist dir böse, weil du so süß bist.';
      colorTheme = {
        primary: '#FF69B4', // Pink
        secondary: '#8A2BE2', // Purple
        border: 'border-neo-pink',
        bg: 'bg-[#ffebf3]',
        glow: 'shadow-brutal-pink',
      };
    }
  } else { // primary === 'fotzig'
    if (secondary === 'atzig') {
      hybridTitle = 'Boss-Bitch Atze';
      hybridDescription = '<strong>Der Champagner-Vollstrecker.</strong> Du bist der unumstrittene <strong>Anführer jeder Gruppe</strong>. Du nimmst absolut kein Blatt vor den Mund, sagst den Leuten deine <strong>ehrliche Meinung direkt ins Gesicht</strong> und bist extrem schwer zu beeindrucken. Dein Standard ist absolut <strong>elitär</strong>. Gleichzeitig feierst du <strong>exzessiv</strong> und hast keinerlei Berührungsängste. Du trinkst edlen <strong>Champagner direkt aus der Flasche</strong> auf der Tanzfläche. Du brichst Herzen im Sekundentakt und bereust absolut nichts. Legendär!';
      colorTheme = {
        primary: '#8A2BE2', // Purple
        secondary: '#39FF14', // Lime
        border: 'border-neo-purple',
        bg: 'bg-[#f7efff]',
        glow: 'shadow-brutal-purple',
      };
    } else {
      hybridTitle = 'Getarnter Kontrollfreak';
      hybridDescription = '<strong>Die Elite-Maus mit Overthinking-Garantie.</strong> Du forderst von dir und deinem Umfeld <strong>absolute Exzellenz</strong>. Deine <strong>Finanzen, Termine und Lebensplanung</strong> sind so perfekt diszipliniert geordnet, dass es fast unheimlich ist. Du wirkst <strong>arrogant, unnahbar</strong> und extrem ehrgeizig. Doch tief im Inneren bist du ein <strong>sensibles kleines Mäuschen</strong>, das ständig <strong>Angst hat, Fehler zu machen</strong>. Du machst dir tagelang Gedanken über winzige Kleinigkeiten. Chill mal, Bestie!';
      colorTheme = {
        primary: '#8A2BE2', // Purple
        secondary: '#FF69B4', // Pink
        border: 'border-neo-purple',
        bg: 'bg-[#f7efff]',
        glow: 'shadow-brutal-purple',
      };
    }
  }

  return {
    name,
    scores,
    dimensions,
    primaryArchetype: primary,
    hybridTitle,
    hybridDescription,
    colorTheme,
  };
}

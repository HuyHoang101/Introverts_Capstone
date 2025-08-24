// constants/lockers.ts

export type LockerItem = {
  id: string;           // e.g. "1A"
  name: string;         // e.g. "Microscope"
  quantity: number;     // simulated stock
  weight: string;       // per unit or per kit, human-readable
  overview: string;     // short intro
  usage: string;        // how to use / typical steps
  purpose: string;      // what it’s for / learning goals
  history: string;      // 1–2 sentence history background
};

// Display order along the left wall (top→bottom = near Table 7 → Table 1)
export const LOCKER_NUMS = [5, 4, 3, 2, 1];

export const LOCKER_CONTENTS: Record<number, LockerItem[]> = {
  1: [
    {
      id: '1A',
      name: 'Optical Microscope',
      quantity: 2,
      weight: '≈ 6 kg each',
      overview:
        'A compound optical microscope that magnifies small specimens using multiple glass lenses.',
      usage:
        'Prepare slide → place on stage → set lowest objective → coarse focus, then fine focus → adjust light and diaphragm.',
      purpose:
        'Introduces microscopy, cellular structure, and observation skills at low–medium magnification.',
      history:
        'Evolved from 17th-century designs by pioneers such as Antonie van Leeuwenhoek and Robert Hooke.',
    },
    {
      id: '1B',
      name: 'Nitrile Lab Gloves (box)',
      quantity: 100,
      weight: '≈ 500 g per box',
      overview:
        'Disposable, chemical-resistant gloves for routine handling and protection.',
      usage:
        'Pick correct size → wear on clean, dry hands → replace if torn or after chemical exposure → dispose as lab waste.',
      purpose:
        'Basic protection against contamination and low-risk chemical splash.',
      history:
        'Disposable gloves became standard PPE in clinical and lab settings in the late 20th century.',
    },
    {
      id: '1C',
      name: 'Glass Beakers (250 mL)',
      quantity: 12,
      weight: '≈ 150 g each',
      overview:
        'Borosilicate beakers used for mixing, heating, and approximate volume measurement.',
      usage:
        'Pour liquids carefully → use stirring rod → heat with hotplate if needed → never seal a heated beaker.',
      purpose:
        'Fundamental vessel for solution prep, mixing, and warming in general chemistry.',
      history:
        'Glass labware standardized widely in the 19th–20th centuries with the adoption of borosilicate glass.',
    },
  ],
  2: [
    {
      id: '2A',
      name: 'Test Tubes Set',
      quantity: 24,
      weight: '≈ 30 g each (glass)',
      overview:
        'Cylindrical glass tubes for small-scale reactions, heating, and observation.',
      usage:
        'Load small volumes → use rack → heat with holder and gentle flame → label clearly to avoid mix-ups.',
      purpose:
        'Safe, small-volume experimentation for qualitative observations and simple kinetics.',
      history:
        'A mainstay of experimental chemistry since the 19th century laboratory revolution.',
    },
    {
      id: '2B',
      name: 'Manual Pipettes (1–10 mL)',
      quantity: 6,
      weight: '≈ 90 g each',
      overview:
        'Adjustable-volume pipettes for accurate liquid transfer in the milliliter range.',
      usage:
        'Set volume → attach tip → pre-wet tip → aspirate slowly → dispense along container wall → change tips between reagents.',
      purpose:
        'Teaches accuracy, precision, and sterile technique in liquid handling.',
      history:
        'Modern adjustable pipettes were popularized in the 1960s–70s to improve reproducibility.',
    },
    {
      id: '2C',
      name: 'Digital pH Meter',
      quantity: 1,
      weight: '≈ 250 g',
      overview:
        'Electronic meter with glass electrode for measuring acidity/alkalinity of solutions.',
      usage:
        'Calibrate with buffers (pH 4/7/10) → rinse probe → immerse in sample → wait for stable reading → store in probe solution.',
      purpose:
        'Introduces electrochemical measurement and pH control in reactions and biology labs.',
      history:
        'Glass-electrode pH measurement dates to the early 20th century; pocket meters are now ubiquitous.',
    },
  ],
  3: [
    {
      id: '3A',
      name: 'Bunsen Burner',
      quantity: 2,
      weight: '≈ 350 g',
      overview:
        'Adjustable gas burner for heating, sterilization, and combustion experiments.',
      usage:
        'Check gas hose → ignite with striker → adjust air intake for blue flame → never leave unattended.',
      purpose:
        'Provides controlled heat for flame tests, sterilization, and simple thermochemistry.',
      history:
        'Invented by Robert Bunsen (1850s), became a standard heat source in chemistry labs.',
    },
    {
      id: '3B',
      name: 'Safety Goggles',
      quantity: 10,
      weight: '≈ 80 g each',
      overview:
        'Impact-resistant, splash-resistant goggles to protect eyes from particles and chemicals.',
      usage:
        'Wear at all times in wet-chem areas → replace if scratched or damaged → clean with mild soap.',
      purpose:
        'Critical personal protective equipment to prevent eye injury.',
      history:
        'Protective eyewear adoption accelerated with modern lab safety standards in the 20th century.',
    },
    {
      id: '3C',
      name: 'Petri Dishes (sterile)',
      quantity: 30,
      weight: '≈ 20 g each (plastic)',
      overview:
        'Shallow dishes for culturing microbes or observing small specimens.',
      usage:
        'Work near flame or hood → pour agar → inoculate → incubate inverted → label bottom with date & sample.',
      purpose:
        'Introduces aseptic technique and basics of microbiology growth.',
      history:
        'Named after Julius Richard Petri (1887) during Koch’s bacteriological research era.',
    },
  ],
  4: [
    {
      id: '4A',
      name: 'Mini Centrifuge',
      quantity: 1,
      weight: '≈ 1.5 kg',
      overview:
        'Compact centrifuge for rapid separation of small sample volumes.',
      usage:
        'Balance tubes by mass → close lid → set speed/time → wait for full stop before opening.',
      purpose:
        'Demonstrates sedimentation, phase separation, and sample prep for analysis.',
      history:
        'Centrifugation became essential in biochemistry and molecular biology in the 20th century.',
    },
    {
      id: '4B',
      name: 'Digital Thermometer (probe)',
      quantity: 2,
      weight: '≈ 120 g each',
      overview:
        'Probe-based thermometer for measuring solution and apparatus temperature.',
      usage:
        'Insert probe into medium → avoid contact with vessel walls → wait for stable reading → clean after use.',
      purpose:
        'Teaches temperature control and monitoring in kinetics and equilibrium experiments.',
      history:
        'Thermometry evolved from liquid-in-glass devices to precise electronic sensors.',
    },
    {
      id: '4C',
      name: 'Magnetic Stirrer (with stir bars)',
      quantity: 1,
      weight: '≈ 800 g',
      overview:
        'Motorized plate spins a magnetic bar to mix solutions uniformly.',
      usage:
        'Place stir bar in beaker → set vessel on plate → start at low speed → increase gradually to avoid vortexing spillover.',
      purpose:
        'Ensures homogeneous mixing, useful for titrations, dissolving solids, and gentle heating (if hotplate combo).',
      history:
        'Magnetic stirring became common mid-20th century with compact lab mixers.',
    },
  ],
  5: [
    {
      id: '5A',
      name: 'Precision Scale (0.01 g)',
      quantity: 1,
      weight: '≈ 3 kg',
      overview:
        'Electronic balance for measuring sample mass with two-decimal precision.',
      usage:
        'Level the scale → tare container → add sample slowly → record stable value → keep draft shield closed.',
      purpose:
        'Teaches mass accuracy, error sources, and proper weighing technique.',
      history:
        'Modern electronic balances replaced mechanical trip scales for routine lab work.',
    },
    {
      id: '5B',
      name: 'First-Aid Kit',
      quantity: 1,
      weight: '≈ 1.2 kg',
      overview:
        'Emergency kit with bandages, antiseptic, burn gel, eye wash, and gloves.',
      usage:
        'Follow lab emergency procedures → treat minor injuries immediately → report incidents to supervisor.',
      purpose:
        'Supports immediate response to minor cuts, burns, or splashes.',
      history:
        'Standardized lab first-aid provisions follow occupational safety regulations.',
    },
    {
      id: '5C',
      name: 'Ethanol 70% (disinfectant)',
      quantity: 2,
      weight: '≈ 500 mL per bottle',
      overview:
        'A common disinfectant concentration for routine bench sterilization.',
      usage:
        'Apply to wipes or surfaces → allow contact time (≥30 s) → keep away from open flames.',
      purpose:
        'Reduces microbial load and maintains aseptic work areas.',
      history:
        'Alcohol disinfection has been documented since the 1800s; 70% strikes a balance of efficacy and evaporation rate.',
    },
  ],
};

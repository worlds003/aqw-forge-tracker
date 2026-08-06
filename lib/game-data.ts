// Modelo de dados do AQW Forge Tracker.
// Toda a informação do jogo vive aqui para facilitar atualizações quando o AQW muda quests.

export type Slot = "req" | "weapon" | "helm" | "cape"

export type Bag = {
  id: string
  name: string
  max: number
  /** Estimativa padrão de quantos reagentes caem por run/farm. O usuário pode sobrescrever. */
  dropsPerRun: number
}

export type Quest = {
  id: string
  name: string
  npc: string
  map: string
  wiki: string
  bags: Bag[]
  /** IDs de quests que precisam estar 100% concluídas antes desta. */
  requires: string[]
  guide?: { title: string; text: string }
}

export type Category = {
  id: string
  label: string
  /** Nome do ícone lucide-react. */
  icon: string
  slot: Slot
  tier?: "Basic" | "Mid" | "End-Game" | "Special"
  quests: Quest[]
}

// Pré-requisitos padrão de toda quest de forja: Blacksmithing Rank 10 + Pyromancer.
const FORGE_REQS = ["req_1", "req_2"]

export const categories: Category[] = [
  {
    id: "req",
    label: "Pré-requisitos",
    icon: "Lock",
    slot: "req",
    quests: [
      {
        id: "req_1",
        name: "Blacksmithing Rank 10",
        npc: "Cysero",
        map: "/join forge",
        wiki: "http://aqwwiki.wikidot.com/blacksmithing-faction",
        requires: [],
        bags: [{ id: "b_req1", name: "Blacksmithing Rep", max: 1, dropsPerRun: 1 }],
      },
      {
        id: "req_2",
        name: "Pyromancer Class",
        npc: "Xang",
        map: "/join firewar",
        wiki: "http://aqwwiki.wikidot.com/pyromancer-class-non-ac",
        requires: [],
        bags: [{ id: "b_req2", name: "Shards of Fire", max: 84, dropsPerRun: 6 }],
      },
      {
        id: "req_3",
        name: "Awescention Completed",
        npc: "Valencia",
        map: "/join museum",
        wiki: "http://aqwwiki.wikidot.com/awescention",
        requires: [],
        bags: [{ id: "b_req3", name: "Relics of Awe", max: 1, dropsPerRun: 1 }],
      },
    ],
  },
  {
    id: "valiant",
    label: "Valiant",
    icon: "Shield",
    slot: "weapon",
    tier: "Basic",
    quests: [
      {
        id: "val_1",
        name: "Valiant Forge Quest",
        npc: "Cysero",
        map: "/join forge",
        wiki: "http://aqwwiki.wikidot.com/valiant-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_val1", name: "Steel Ingot", max: 50, dropsPerRun: 4 }],
      },
    ],
  },
  {
    id: "lacerate",
    label: "Lacerate",
    icon: "Scissors",
    slot: "weapon",
    tier: "Basic",
    quests: [
      {
        id: "lac_1",
        name: "Lacerate Forge Quest",
        npc: "Cysero",
        map: "/join pirates",
        wiki: "http://aqwwiki.wikidot.com/lacerate-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_lac1", name: "Blade Shard", max: 30, dropsPerRun: 3 }],
      },
    ],
  },
  {
    id: "smite",
    label: "Smite",
    icon: "Hammer",
    slot: "weapon",
    tier: "Basic",
    quests: [
      {
        id: "smi_1",
        name: "Smite Forge Quest",
        npc: "Parnassus",
        map: "/join celestialarena",
        wiki: "http://aqwwiki.wikidot.com/smite-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_smi1", name: "Divine Spark", max: 25, dropsPerRun: 3 }],
      },
    ],
  },
  {
    id: "helix",
    label: "Helix / Exalt",
    icon: "Dna",
    slot: "weapon",
    tier: "Mid",
    quests: [
      {
        id: "hel_1",
        name: "Helix Forge Quest",
        npc: "Gaian",
        map: "/join gaia",
        wiki: "http://aqwwiki.wikidot.com/helix-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_hel1", name: "Crown Relic", max: 20, dropsPerRun: 2 }],
      },
    ],
  },
  {
    id: "lament",
    label: "Lament",
    icon: "Ghost",
    slot: "weapon",
    tier: "Mid",
    quests: [
      {
        id: "lam_1",
        name: "Lament Forge Quest",
        npc: "Undead",
        map: "/join underworld",
        wiki: "http://aqwwiki.wikidot.com/lament-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_lam1", name: "Shard of Grief", max: 40, dropsPerRun: 4 }],
      },
    ],
  },
  {
    id: "havi",
    label: "Havoc / Fang",
    icon: "Wind",
    slot: "weapon",
    tier: "Mid",
    quests: [
      {
        id: "hav_1",
        name: "Havoc / Fang Quest",
        npc: "Zephyr",
        map: "/join elemental",
        wiki: "http://aqwwiki.wikidot.com/havoc-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_hav1", name: "Gale Essence", max: 35, dropsPerRun: 3 }],
      },
    ],
  },
  {
    id: "pneuma",
    label: "Pneuma",
    icon: "Feather",
    slot: "helm",
    tier: "Special",
    quests: [
      {
        id: "pne_1",
        name: "Pneuma Helm Quest",
        npc: "Aeria",
        map: "/join celestialrealm",
        wiki: "http://aqwwiki.wikidot.com/pneuma-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_pne1", name: "Aether Feather", max: 20, dropsPerRun: 2 }],
      },
    ],
  },
  {
    id: "vim",
    label: "Vim / Exaltia",
    icon: "Zap",
    slot: "helm",
    tier: "Special",
    quests: [
      {
        id: "vim_1",
        name: "Vim Helm Quest",
        npc: "Cysero",
        map: "/join timeinn",
        wiki: "http://aqwwiki.wikidot.com/vim-enhancement",
        requires: FORGE_REQS,
        bags: [{ id: "b_vim1", name: "Vim Scrap", max: 25, dropsPerRun: 3 }],
      },
    ],
  },
  {
    id: "valiance",
    label: "Valiance",
    icon: "Flame",
    slot: "weapon",
    tier: "End-Game",
    quests: [
      {
        id: "vnc_1",
        name: "Valiance Blade Quest",
        npc: "Cysero",
        map: "/join timeinn",
        wiki: "http://aqwwiki.wikidot.com/valiance",
        requires: FORGE_REQS,
        bags: [{ id: "b_vnc1", name: "Champion's Seal", max: 15, dropsPerRun: 1 }],
      },
    ],
  },
  {
    id: "arcana",
    label: "Arcana's Concerto",
    icon: "Sparkles",
    slot: "weapon",
    tier: "End-Game",
    quests: [
      {
        id: "arc_1",
        name: "Arcana's Concerto",
        npc: "Darkon",
        map: "/join astravia",
        wiki: "http://aqwwiki.wikidot.com/arcana-s-concerto",
        requires: FORGE_REQS,
        guide: {
          title: "Guia Dark Carnax (Arcana)",
          text: "<b>Composição recomendada:</b> ArchPaladin, Lord of Order, StoneCrusher, DragonOfTime. Mantenha o tank segurando aggro enquanto o DPS acumula pilhas.",
        },
        bags: [
          { id: "b_arc1", name: "Poleaxe", max: 1, dropsPerRun: 1 },
          { id: "b_arc2", name: "Synthetic Magi Fluid", max: 300, dropsPerRun: 12 },
        ],
      },
    ],
  },
  {
    id: "elysium",
    label: "Elysium",
    icon: "Sun",
    slot: "weapon",
    tier: "End-Game",
    quests: [
      {
        id: "ely_1",
        name: "Elysium Blade Quest",
        npc: "Willpower",
        map: "/join tercessuinotlim",
        wiki: "http://aqwwiki.wikidot.com/elysium",
        requires: FORGE_REQS,
        guide: {
          title: "Guia Ultra Flibbitiest (Elysium)",
          text: "<b>Composição recomendada:</b> Lord of Order, ArchPaladin, Chaos Avenger, Void Highlord.",
        },
        bags: [
          { id: "b_ely1", name: "Fiend Token", max: 3, dropsPerRun: 1 },
          { id: "b_ely2", name: "Void Bone", max: 15, dropsPerRun: 2 },
        ],
      },
    ],
  },
  {
    id: "avarice",
    label: "Avarice",
    icon: "Coins",
    slot: "weapon",
    tier: "End-Game",
    quests: [
      {
        id: "ava_1",
        name: "Avarice Cape Quest",
        npc: "Cysero",
        map: "/join timeinn",
        wiki: "http://aqwwiki.wikidot.com/avarice",
        requires: FORGE_REQS,
        bags: [
          { id: "b_ava1", name: "Indulgence", max: 300, dropsPerRun: 15 },
          { id: "b_ava2", name: "Gluttony", max: 300, dropsPerRun: 15 },
          { id: "b_ava3", name: "Wrath", max: 300, dropsPerRun: 15 },
        ],
      },
    ],
  },
  {
    id: "dauntless",
    label: "Dauntless",
    icon: "Skull",
    slot: "weapon",
    tier: "End-Game",
    quests: [
      {
        id: "dau_1",
        name: "Dauntless Weapon Quest",
        npc: "Board",
        map: "/join ultraspeaker",
        wiki: "http://aqwwiki.wikidot.com/dauntless",
        requires: FORGE_REQS,
        guide: {
          title: "Guia Ultra Speaker (Dauntless)",
          text: "<b>Composição recomendada:</b> Lord of Order, ArchPaladin, StoneCrusher, Lord of Order / ArchPaladin.",
        },
        bags: [{ id: "b_dau1", name: "Speaker Insignia", max: 20, dropsPerRun: 2 }],
      },
    ],
  },
]

// Índices auxiliares -------------------------------------------------------

export const allQuests: Quest[] = categories.flatMap((c) => c.quests)

export const questById = new Map(allQuests.map((q) => [q.id, q]))

export const categoryByQuestId = new Map(
  categories.flatMap((c) => c.quests.map((q) => [q.id, c] as const)),
)

export const allBagIds: string[] = allQuests.flatMap((q) => q.bags.map((b) => b.id))

export const defaultDropsPerRun: Record<string, number> = Object.fromEntries(
  allQuests.flatMap((q) => q.bags.map((b) => [b.id, b.dropsPerRun])),
)

// --- Conteúdo dos guias (abas de referência) ------------------------------

export const weaponEnhancements = [
  { name: "Valiant", tier: "Basic", desc: "Aumenta ligeiramente todos os atributos base do personagem." },
  { name: "Lacerate", tier: "Basic", desc: "Chance de aplicar um corte crítico que reduz velocidade e defesa." },
  { name: "Smite", tier: "Basic", desc: "Concede dano explosivo massivo em acertos críticos." },
  { name: "Helix / Exaltatus", tier: "Mid", desc: "Aumenta o dano crítico e a taxa de acerto." },
  { name: "Lament", tier: "Mid", desc: "Reduz evasão e resistência do alvo." },
  { name: "Havoc / Fang", tier: "Mid", desc: "Focado em acelerar o tempo de recarga (Cooldown)." },
  { name: "Valiance", tier: "End-Game", desc: "Aumenta massivamente o dano de ataque, intelecto e haste." },
  { name: "Arcana's Concerto", tier: "End-Game", desc: "Bônus formidáveis em Intel, Chance Crítica e Dano Mágico." },
  { name: "Elysium", tier: "End-Game", desc: "Converte parte do dano em pulsos de cura contínua e AoE." },
  { name: "Avarice", tier: "End-Game", desc: "Aumenta velocidade de ataque e recuperação de recursos." },
  { name: "Dauntless", tier: "End-Game", desc: "Desativa auto-attack tradicional e converte em golpes devastadores." },
]

export const helmEnhancements = [
  { name: "Pneuma", desc: "Concede grande quantidade de Intelecto e Sabedoria." },
  { name: "Vim / Exaltia", desc: "Aumenta severamente Destreza, Evasão e Haste." },
]

export const capeEnhancements = [
  { name: "Vainglory", desc: "Aumenta dano causado e reduz defesa (Risco/Recompensa)." },
]

export const classesData = [
  { name: "Void Highlord (VHL)", type: "End-Game Solo / PvP", farm: "/join tercessuinotlim", combo: "3 → 4 → 2 → 5 mantendo buffs defensivos.", enh: "Valiance ou Dauntless | Pneuma/Vim | Vainglory" },
  { name: "ArchMage", type: "End-Game Farming Massivo", farm: "/join archmage", combo: "2 → 3 → 4 → 5 para explosão elemental em área.", enh: "Arcana's Concerto | Pneuma | Vainglory" },
  { name: "Legion Revenant (LR)", type: "Top Farm / Support Universal", farm: "/join revenant", combo: "3 → 2 → 4 → 5.", enh: "Valiance | Wizard/Pneuma | Vainglory" },
  { name: "ArchPaladin (AP)", type: "Top Tank / Ultra Boss Support", farm: "/join celestialrealm", combo: "2 → 3 → 4 → 5 (reduz dano do boss a zero).", enh: "Valiant | Wizard | Healer/Lament" },
  { name: "Lord of Order (LoO)", type: "O Suporte Definitivo", farm: "/join lordoforder (Diárias)", combo: "2 → 3 → 4 → 5 em looping contínuo.", enh: "Valiant | Lucky | Forge Cape" },
  { name: "DragonOfTime (DoT)", type: "High Solo DPS / Boss Fights", farm: "/join dragonoftimes", combo: "3 → 4 → 2 → 5 acumulando DoT progressivo.", enh: "Valiance | Wizard | Vainglory" },
  { name: "Verus DoomKnight (VDK)", type: "Top Solo & Team DPS", farm: "/join verus", combo: "2 → 3 → 4 → 5.", enh: "Dauntless ou Valiance | Vim | Vainglory" },
  { name: "Chaos Avenger (CaV)", type: "Tank Indestrutível / Ultra Bosses", farm: "/join ultrachaos", combo: "2 → 3 → 4 → 5.", enh: "Valiant | Lucky | Forge Cape" },
  { name: "Yami no Ronin (YnR)", type: "Evasão Extrema / Solo Boss Killer", farm: "/join yallor", combo: "3 → 2 → 4 → 5 (mantenha clones ativos).", enh: "Lacerate | Thief/Vim | Forge Cape" },
  { name: "LightCaster (LC)", type: "Caster Balanceado / Suporte", farm: "/join celestialrealm", combo: "3 → 2 → 4 → 5.", enh: "Arcana's Concerto | Pneuma | Vainglory" },
  { name: "ShadowStalker of Time (SSoT)", type: "Burst Nuke / HeroMart Chrono", farm: "HeroMart / TimeShop", combo: "2 → 3 → 5 → 2 → 4 (Nuke massivo).", enh: "Valiance | Lucky | Vainglory" },
  { name: "Master of Moglins (MoM)", type: "Suporte / Cura Coletiva", farm: "Moglin Kickstarter / Special", combo: "2 → 3 → 4 → 5.", enh: "Valiant | Lucky | Forge Cape" },
]

export const factionsData = [
  { faction: "Arcangrove", map: "/join arcangrove", reward: "Shaman Class, Fulgerite Staff" },
  { faction: "Blade of Awe", map: "/join awescamp", reward: "Armor of Awe, Blade of Awe" },
  { faction: "Chaos", map: "/join mountdoomskull", reward: "Chaos Slayer Class" },
  { faction: "DoomWood", map: "/join doomwood", reward: "Necromancer Class" },
  { faction: "Good", map: "/join swordhaven", reward: "Paladin items, Royal Guard" },
  { faction: "Evil", map: "/join shadowfall", reward: "DoomKnight items" },
]

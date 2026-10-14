export const LEVELS = [
  {
    id: "raffinerie",
    name: "Raffinerie",
    subtitle: "Une tournée, cinq bons réflexes.",
    tip: "Un danger repéré mérite une action : baliser, signaler et faire intervenir la bonne personne.",
    length: 7700,
    hazards: [
      [
        "sol",
        "Sol glissant",
        "Baliser le sol",
        "Sol glissant balisé : on limite les chutes en attendant le nettoyage.",
      ],
      [
        "fuite",
        "Fuite sur une conduite",
        "Isoler et alerter",
        "Fuite signalée, zone isolée : seule une équipe habilitée intervient.",
      ],
      [
        "zone",
        "Zone mal balisée",
        "Fermer le balisage",
        "Zone balisée : on évite l’entrée dans un périmètre dangereux.",
      ],
      [
        "caisse",
        "Obstacle dans le passage",
        "Ranger la caisse vide",
        "Passage dégagé : on évite les chutes de plain-pied.",
      ],
      [
        "lunettes",
        "Lunettes requises au poste",
        "Équiper le poste",
        "Lunettes requises au poste : on protège les yeux des projections.",
      ],
    ],
  },
  {
    id: "usine",
    name: "Usine",
    subtitle: "La prévention continue à l’atelier.",
    tip: "La protection collective passe en premier ; les EPI complètent les mesures de prévention.",
    length: 7700,
    hazards: [
      [
        "machine",
        "Machine sans protection",
        "Interdire l’accès et alerter",
        "Accès interdit : pas de remise en marche avant sécurisation par une personne habilitée.",
      ],
      [
        "stock",
        "Charge mal rangée",
        "Isoler et signaler",
        "Stockage signalé : une équipe équipée stabilise les charges avant réouverture.",
      ],
      [
        "chariot",
        "Passage encombré",
        "Ranger le chariot vide",
        "Allée dégagée : les déplacements et l’évacuation restent possibles.",
      ],
      [
        "panneau",
        "Signalisation absente",
        "Installer le panneau",
        "Circulation signalée : on réduit les risques de collision.",
      ],
      [
        "bruit",
        "Zone bruyante",
        "Signaler et équiper",
        "Bruit signalé : on réduit l’exposition et on porte les protections auditives requises.",
      ],
    ],
  },
].map((level) => ({
  ...level,
  hazards: level.hazards.map(([type, title, action, message], i) => ({
    id: `${level.id}-${type}`,
    type,
    title,
    action,
    message,
    x: 840 + i * 1450,
  })),
}));

export const TOTAL_HAZARDS = LEVELS.reduce(
  (n, level) => n + level.hazards.length,
  0,
);
export function formatTime(seconds) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)} min ${String(value % 60).padStart(2, "0")} s`;
}

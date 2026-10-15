# État du projet

Statut : ACTUEL

## Lot actif

- V1 publiée sur GitHub et dans ARCenal Store preview ; qualification YunoHost CI réussie.
- Lots réalisés et livraison preview disponible ; installation sur le serveur du
  client et réception humaine non exécutées. Synthèse : `lots/v1.md`.

## Dernière étape validée

- 14 octobre 2026 : carte blanche du client pour atteindre la V1 sans intervention.
- Architecture et cahier des charges validés auparavant ; contenu et réalisation
  arrêtés par le fournisseur sous ce mandat, sans simuler une réception humaine.
- Publication GitHub preview explicitement demandée ; effectuée le 15 octobre 2026.

## Fichiers importants modifiés

- `web/` : jeu Canvas original, deux niveaux, commandes, écrans et partage.
- `server/` : Flask/SQLite, contrôles, vingt résultats et commandes de gestion.
- `manifest.toml`, `scripts/`, `conf/`, `doc/`, `tests.toml` : paquet YunoHost v2.
- `tests/`, `tools/`, manifestes de dépendances et qualité : vérifications et archives.
- `README.md`, `CHANGELOG.md`, `docs/` : lancement, publication, HSE, recette et revue.
- Cahier des charges 1.2 et suivi `.arcenal/` : mandat, architecture et décisions.

## Tests exécutés

- Prettier, syntaxe JS, Ruff, compilation Python, ShellCheck et syntaxe Bash réussis.
- API : 10 tests réussis (concurrence, refus, rétention, clé, persistance, backup).
- Suite navigateur complète : 17 réussis / 13 combinaisons non applicables ignorées.
- Après optimisation de pause : 16 réussis / 9 non applicables ; inscription réelle
  déjà vérifiée lors de la suite complète, pas répétée dans cette relance ciblée.
- Dernière clarification pédagogique : parcours Chromium et mobile iPhone/Android
  rejoués, 3 réussis / 3 combinaisons non applicables ignorées.
- Chromium, Firefox, WebKit et émulations iPhone/Android ; captures examinées.
- Manifeste conforme au schéma officiel ; audits npm/Python sans vulnérabilité connue.
- Archives : empreintes, intégrité et démarrage de la livraison extraite vérifiés.
- Détails et portée : `docs/recette.md`, revue séparée dans `docs/revue.md`.
- GitHub : contrôles applicatifs et archives verts, run `38622654281`.
- YunoHost 12.1.41.2 amd64 / Incus : installation racine/sous-chemin/multi-instance,
  retrait/réinstallation, backup/restore, upgrade et changement d’URL réussis,
  run `38622654245`. Rapport : `TEST_REPORT.md`.
- Catalogue : 16 tests réussis ; PR #10 fusionnée, promotion sélective Oscar verte.

## Résultats

- Jeu complet : Raffinerie/Usine, dix dangers, messages HSE, bilans et partage.
- Tableau commun réel, inscription facultative sous trois lettres, vingt entrées.
- Client : 71 232 octets ; ZIP statique : 21 785 octets ; aucun asset externe.
- Archives dans `dist/`, générées par `tools/build_release.py`, sans données/secrets.
- Prévisualisation locale Gunicorn sur `http://127.0.0.1:18764`, données isolées
  dans `data/preview/` (service temporaire, disponibilité à recontrôler à la reprise).
- Dépôt public : `https://github.com/arcenal-coder/oscar_ynh`, branche `preview`.
- Tag : `v1.0.0-preview.1`, paquet `1.0.0~ynh1`, SHA installable
  `ac3c74ab2bdb8d8904062e7a268e8d08e33a9067`.
- Catalogue publié : PR `arcenal-systeme-catalogue#10`, fusion
  `6c6e70f111b28dac94080928f69eef35e6972288`, flux raw preview relu et conforme.
- Archives vérifiées attachées à la prérelease GitHub ; niveau amont 0 conservé.

## Blocages

- Aucun blocage de publication. Instance client non installée, accès non fourni ;
  cycle de vie déjà qualifié sur instance CI, sans prétendre à une recette client.
- NON MESURÉ : panel humain de trois débutants (AC-13), appareils physiques,
  Edge natif et publication LinkedIn réelle.
- Rétention des sauvegardes/journaux dépendante de la politique du serveur.
- Logo graphique source absent du dépôt : signature ONYX textuelle en V1.

## Décisions récentes

- Mandat d’autonomie : plus de demandes d’accord intermédiaires pour réaliser la V1.
- Illustrations originales, contenus délégués, Flask/Gunicorn/SQLite épinglés.
- Jeton signé 24 h et journal de dix actions transmis seulement à l’inscription.
- Sauvegarde SQLite cohérente et retrait protégé ; anti-triche non compétitive.
- Commits et push autorisés explicitement par la demande de publication preview.
- Aucun déploiement sur le serveur YunoHost client effectué.

## Prochaine action

- Candidate disponible : ARCenal Store → Prévisualisation → Actualiser le catalogue
  → « Oscar, mission HSE ». Réception sur l’instance client selon accès disponible.

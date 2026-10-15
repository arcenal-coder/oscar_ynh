# Recette V1 — 14 octobre 2026

Statut : V1 réalisée, vérifiée localement puis qualifiée sur une instance YunoHost
Incus GitHub et publiée en preview ARCenal Store. Preuves et révisions exactes :
`TEST_REPORT.md`. Le serveur personnel du client n’a pas été modifié.

## Environnement et mandat

- macOS, Python 3.14.5, Node 22.23.1, Playwright 1.61.1.
- Navigateurs Playwright : Chromium 149, Firefox 151, WebKit 26.5.
- Émulations iPhone 13/WebKit et Pixel 7/Chromium ; pas de téléphone physique.
- Carte blanche client pour atteindre la V1 ; pas de réception humaine ni de
  certification pédagogique externe déclarée par le fournisseur.
- Aucun accès serveur YunoHost fourni ; Docker est présent mais sans daemon actif.

## Contrôles exécutés

| Contrôle | Résultat |
|---|---|
| `npm run format:check` | Réussi. |
| `npm run check` | Syntaxe des quatre modules JavaScript valide. |
| Ruff, Python `compileall` | Réussis sur serveur, outils et tests concernés. |
| Tests API `unittest` | **10 tests réussis**, dont refus, concurrence, persistance et sauvegarde. |
| Suite complète `npm test` | **17 réussis**, 13 combinaisons volontairement non applicables ignorées. |
| Après optimisation du rendu en pause | **16 tests navigateur réussis**, 9 combinaisons non applicables ignorées ; inscription réelle exclue de cette relance ciblée. |
| Après clarification pédagogique des sauts | Parcours complet Chromium et commandes mobiles iPhone/Android : **3 réussis**, 3 combinaisons non applicables ignorées. |
| Inscription de bout en bout sur API réelle | Réussie dans la suite complète : dix sécurisations, inscription TST et lecture depuis un second contexte navigateur. |
| ShellCheck | Réussi ; SC1091 exclu pour les helpers YunoHost absents sur macOS. |
| Syntaxe Bash | Réussie sur les six scripts du paquet. |
| Manifeste | Conforme au schéma officiel YunoHost v2, téléchargé au moment du contrôle. |
| Audit npm | Aucune vulnérabilité connue signalée. |
| `pip-audit -r requirements.txt` | Aucune vulnérabilité connue signalée pour les dépendances de production. |
| Revue visuelle | Captures accueil ordinateur/mobile, sites et bilan examinées. |
| Archives livrées | SHA-256 et intégrité ZIP vérifiés ; archive extraite dans un dossier isolé, accueil/API/base vide/jeton testés. |

Poids du client statique : **71 232 octets non compressés**, **21 785 octets en ZIP**.
Le budget retenu de 100 Kio hors données de tableau est respecté. Aucun asset externe
n’est nécessaire à l’affichage ou au gameplay.

Les tests navigateur utilisent de vraies commandes avec une horloge accélérée.
Pour l’inscription réelle, le test attend aussi le temps serveur nécessaire : le
contrôle de durée n’est pas désactivé. Le correctif final de rendu ne modifie ni
la progression ni le protocole API ; la relance ciblée vérifie notamment l’absence
de redessin continu pendant la pause.

## Couverture des critères

| Critères | Preuve et portée |
|---|---|
| AC-01 à AC-06 | Parcours des dix dangers au clavier sur trois moteurs, messages, deux bilans, dix sur dix au final ; chute sans perte. |
| AC-07 | Clavier, pause, horloge arrêtée, rendu arrêté ; commandes tactiles et interactions en émulation mobile. |
| AC-08 | Rechargement renvoyant à l’accueil ; résultats serveur persistants après redémarrage d’application. |
| AC-09 et AC-10 | Inscription réelle ; API vérifiant vingt dernières entrées, éviction et lecture commune ; trente écritures concurrentes. |
| AC-11 | Retrait local testé ; suppression publique refusée ; retrait d’ID inexistant en erreur. |
| AC-12 | Portrait bloquant, paysage, reprise volontaire et absence de débordement testés en émulation iPhone/Android. |
| AC-13 | **NON MESURÉ** : pas de panel de trois débutants. Objectif 3–5 minutes conservé ; les tests automatisés ne prouvent pas ce critère humain. |
| AC-14 | Dessins originaux et revue visuelle ; Oscar avec casque, tenue, gants et chaussures ; dangers avec pictogrammes/formes distincts. |
| AC-15 | Chromium, Firefox, WebKit testés ; API indisponible pendant tout le parcours sans blocage. Edge natif et appareils physiques non testés. |
| AC-16 | Jeton falsifié/expiré, temps incohérent, mauvais format, doublon, ordre erroné, origine malformée et limite d’envoi testés ; clé privée unique lors de démarrages simultanés. |
| AC-17 | Texte et URL LinkedIn vérifiés ; publication réelle sur LinkedIn non exécutée. |
| AC-18 | Dix fiches arrêtées avant intégration sous mandat délégué, dans `docs/contenus-hse.md`. |
| AC-19 | README, commandes de gestion, procédure statique et paquet fournis ; déploiement distant non exécuté. |

## Défauts rencontrés et corrigés

1. Saut trop exigeant au-dessus de la passerelle : impulsion ajustée, parcours
   des deux niveaux vérifié sur trois moteurs ; récupération après chute testée.
2. Rotation portrait/paysage pouvant laisser une partie bloquée en pause : reprise
   volontaire proposée ; test mobile exécuté sur les deux émulations.
3. Connexions SQLite non fermées par le seul context manager natif : fermeture
   explicite, tests sans avertissements de ressources et écritures concurrentes réussies.
4. Initialisation simultanée de clé : verrou de fichier, secret stable et permissions 0600 testés.
5. Rendu inutile en pause et sur le bilan : un seul dernier dessin, puis suspension du
   rendu lourd ; test de pause et parcours rejoués après correction.
6. En-tête Origin malformé : refus explicite plutôt qu’exception serveur.

## Complément de qualification GitHub

Le cycle de vie a depuis été exécuté sur YunoHost 12.1.41.2 amd64 : racine,
sous-chemin, multi-instance, retrait/réinstallation, mise à jour, sauvegarde/
restauration et changement d’URL réussis. Preuve :
https://github.com/arcenal-coder/oscar_ynh/actions/runs/38622654245

Les contrôles applicatifs et la livraison extraite sont également réussis sur GitHub :
https://github.com/arcenal-coder/oscar_ynh/actions/runs/38622654281

## Vérifications restant dépendantes de l’instance du client

- Installation et configuration HTTPS sur son domaine final.
- Conservation réelle et rotation des sauvegardes et journaux serveur.
- Domaine public, aperçu LinkedIn réel et publication du lien.

Le cycle complet du paquet est maintenant vérifié en CI ; sa transposition sur
l’instance personnelle du client reste à réceptionner.

## Livrables

- Code de la V1 dans `web/` et `server/`.
- Contenus HSE, README, architecture et décisions.
- Paquet YunoHost v2 avec tests de cycle de vie déclarés.
- Générateur d’archives `tools/build_release.py` : ZIP statique et archive YunoHost,
  avec SHA-256, sans données ni secrets locaux.
- Captures et traces locales dans `test-results/`, non versionnées ; les résultats
  de test sont séparés des données de la prévisualisation.

Conclusion : V1 publiée en preview, installable depuis ARCenal Store, qualification
YunoHost isolée réussie. Ne pas qualifier cette livraison d’installée chez le client
ni de recette humaine acceptée.

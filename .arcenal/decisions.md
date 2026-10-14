# Décisions

Statut : ACTUEL

Les décisions structurantes validées sont ajoutées ci-dessous. Ne pas enregistrer de secret.

## 14 octobre 2026 — Cadrage validé bloc par bloc

- ACTUEL — Public professionnel non spécialiste ; courte sensibilisation HSE
  accessible sans connaissances préalables ni compte joueur.
- ACTUEL — V1 : Raffinerie et Usine, cinq dangers chacune ; BTP hors V1.
- ACTUEL — Approche pour identifier, interaction simple pour sécuriser ; balisage
  et alerte d’une personne habilitée quand nécessaire, sans réparation spécialisée.
- ACTUEL — Aucun combat, blessure représentée, vie ou compte à rebours ; chute avec
  retour en zone sûre et progression conservée. Sortie après cinq sécurisations.
- ACTUEL — Bilans : compteurs, temps actif et conseil ; aucun point, étoile ou
  avantage de vitesse. Durée de découverte cible : 3 à 5 minutes.
- ACTUEL — Clavier : flèches, espace, E ; commandes tactiles équivalentes. Pause
  manuelle et automatique en arrière-plan, reprise volontaire ; téléphone paysage.
- ACTUEL — Progression courante en mémoire, remise à zéro au rechargement.
- HISTORIQUE — Proposition de tableau local et absence totale de transmission de
  résultats remplacées par le choix explicite d’un tableau commun en ligne.
- ACTUEL — Inscription facultative après mission complète sous trois lettres ;
  tableau d’honneur des vingt dernières inscriptions, sans classement compétitif.
- ACTUEL — Le tableau nécessite un stockage en ligne, exception validée à la
  demande initiale sans service obligatoire. Solution précisée ci-dessous.
- ACTUEL — Joueurs sans droits de modification/suppression ; retrait possible par
  le gestionnaire via accès protégé, sans administration complète en V1.
- ACTUEL — Contrôles de format, cohérence, duplication et envois répétés ; aucun
  secret public. Panne du tableau sans blocage du jeu. Anti-triche non compétitive.
- ACTUEL — LinkedIn : lien à partager et texte à copier, sans publication automatique.
- ACTUEL — Illustration 2D simplifiée selon la référence ; EPI permanents et indices
  visuels ne reposant pas seulement sur la couleur. Usage précis du logo à confirmer.
- ACTUEL — Le client approuve les dix fiches pédagogiques avant intégration.
- ACTUEL — Hors V1 : comptes, sauvegarde entre visites, compétition, multijoueur,
  quiz, multilingue, administration complète, suivi des visiteurs, sons et musique.
- ACTUEL — Six lots validés : contenus/identité, scène jouable, deux niveaux,
  parcours/partage, tableau commun, recette/livraison. Voir le cahier des charges.
- ACTUEL — Création du cahier des charges et mise à jour des trois fichiers de suivi
  autorisées. Document consolidé ensuite validé par le client ; pas de développement
  autorisé à cette étape.

## 14 octobre 2026 — Architecture validée

- ACTUEL — Cahier des charges consolidé approuvé ; passage à l’architecture accepté.
- ACTUEL — Hébergement sur le serveur YunoHost du client, sans plateforme tierce.
- ACTUEL — Jeu HTML/CSS/JavaScript et Canvas 2D sans framework côté navigateur.
- ACTUEL — Python/Flask et SQLite sur le même domaine ; service interne accessible
  via le serveur web, sans base exposée au navigateur.
- ACTUEL — Gestion par commande réservée à l’administrateur serveur.
- ACTUEL — Paquet dédié avec installation, mise à jour, suppression, sauvegarde
  et restauration ; jeu et tableau publics sans connexion YunoHost.
- ACTUEL — Vingt inscriptions maximum en base active, ancienne évincée lors de
  l’ajout de la suivante. Rétention des sauvegardes à préciser séparément.
- ACTUEL — Architecture dans `.arcenal/architecture.md`. Les détails de mise en
  œuvre sont complétés sous le mandat d’autonomie ci-dessous.

## 14 octobre 2026 — Mandat d’autonomie jusqu’à la V1

- ACTUEL — Le client donne carte blanche pour atteindre la V1 sans intervention
  intermédiaire. Développement et dépendances locales de réalisation autorisés.
- HISTORIQUE — Les attentes d’accord pour démarrer le lot 1 et de validation
  pédagogique préalable par le client sont remplacées par ce mandat explicite.
- ACTUEL — Dix fiches HSE arrêtées par le fournisseur ; mises en sécurité et alerte
  pour les interventions spécialisées. Contenus dans `docs/contenus-hse.md`.
- ACTUEL — Illustrations Canvas originales, sans assets, polices ou CDN externes.
  Signature ONYX en texte : aucun fichier source du logo n’est disponible dans le dépôt.
- ACTUEL — Flask 3.1.3, Gunicorn 23.0.0 et dépendances directes/transitives épinglées ;
  Python >= 3.11. Outils de recette isolés dans `.venv/` et `node_modules/`.
- ACTUEL — Jeton signé de départ valable 24 h ; journal des dix sécurisations
  transmis seulement à l’inscription, cohérence et temps écoulé contrôlés côté serveur.
- ACTUEL — 30 départs et 12 tentatives d’inscription par heure et empreinte réseau ;
  pas d’IP brute en base. Compteurs expirés et jetons consommés purgés aux POST suivants.
- ACTUEL — Deux workers Gunicorn sur loopback, serveur web proxyant les seules routes
  API, utilisateur système dédié, suppression par commande Flask locale.
- ACTUEL — Paquet privé à sources embarquées, sans URL upstream inventée. Aucune
  licence open source choisie au nom du client ; redistribution à décider séparément.
- ACTUEL — Sauvegarde cohérente via API SQLite, clé incluse ; rétention des archives
  gérée par le serveur YunoHost, explicitée dans la notice et le README.
- ACTUEL — Livraison locale et archives versionnées ; installation distante non
  réalisée, faute d’accès serveur. Aucun commit ni publication Git effectué.
- ACTUEL — Budget client de 100 Kio non compressés, hors réponses du tableau ;
  mesuré à 71 232 octets. Rendu lourd suspendu pendant les pauses et les bilans.
- ACTUEL — Sauts explicitement présentés comme convention du jeu, sans geste à
  reproduire sur un site réel ; cheminements sécurisés rappelés à la prise en main.

## 14 octobre 2026 — Publication preview demandée

- ACTUEL — Le client demande explicitement le push GitHub pour installation via
  ARCenal Store en preview : création du dépôt public `arcenal-coder/oscar_ynh`,
  branche `preview`, commits et intégration au catalogue preview autorisés.
- ACTUEL — Catalogue cible : `arcenal-systeme-catalogue`, canaux development/preview,
  révision de paquet figée ; pas de promotion stable demandée.
- ACTUEL — La copie locale du catalogue contient des travaux préexistants pour
  Matos ; publication Oscar préparée depuis une copie isolée du dépôt distant.
- ACTUEL — Libellé YunoHost raccourci en « Oscar, mission HSE » pour la limite
  amont de 22 caractères ; le titre complet du jeu reste identique.
- ACTUEL — Licence réservée conservée, texte et URL de licence explicites pour
  la diffusion preview ; aucune conversion silencieuse en licence libre.
- ACTUEL — Contrôles applicatifs et cycle de vie YunoHost exécutables dans GitHub
  Actions, environnement Incus isolé ; aucune installation sur serveur client.

## À REVALIDER — Éléments d’exploitation restants

- Domaine, chemin final et version effective du serveur YunoHost ; environnement
  de test et accès nécessaires à la vérification réelle du paquet.
- Rétention effective des sauvegardes et journaux selon la politique du serveur.
- Recette humaine sur trois débutants (durée cible) et téléphones physiques.

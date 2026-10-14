# Projet ARCenal

Statut : ACTUEL

## Identité

- Nom provisoire : Oscar, mission zéro accident (dossier Onyx Game).
- Objectif produit : sensibiliser un public professionnel non spécialiste aux
  bons réflexes HSE lors d’une courte mission de plateforme 2D diffusée via LinkedIn.
- Références : `cahier-des-charges.md`, version 1.2 du 14 octobre 2026,
  et `.arcenal/architecture.md` ; cahier des charges et architecture validés.
- Périmètre V1 : Raffinerie et Usine, dix dangers, clavier/tactile, messages HSE,
  bilans, tableau d’honneur commun facultatif à trois lettres, partage LinkedIn.
- Hors périmètre : BTP, comptes joueurs, sauvegarde entre visites, compétition,
  multijoueur, quiz, autres langues, administration complète, suivi des visiteurs,
  sons et musique.

## Contraintes stables

- Français, sans compte joueur, sans combat ni violence ; Oscar porte ses EPI.
- Session cible de 3 à 5 minutes, sans limite imposée, vies ou bonus de vitesse.
- Deux niveaux de cinq dangers ; contenus arrêtés par le fournisseur sous mandat
  d’autonomie client, dans `docs/contenus-hse.md`.
- Client HTML/CSS/JavaScript avec Canvas 2D, sans framework, servi en statique.
- Tableau Python/Flask et SQLite sur le serveur YunoHost du client, même domaine.
- Tableau : vingt inscriptions conservées en base active, sans classement par
  temps ; retrait par commande réservée à l’administrateur serveur.
- Le jeu reste jouable si le tableau est indisponible.
- Stack validée ; carte blanche client pour réaliser la V1 et les vérifications
  locales sans sollicitation. Aucun accès au serveur YunoHost n’a été fourni.

## Environnement cible

- Ordinateur et mobile ; téléphone en paysage, pause en portrait ou arrière-plan.
- Cibles : versions courantes Chrome, Firefox, Edge, Safari, Chrome Android et
  Safari iPhone ; appareils et versions de recette à préciser.
- Paquet YunoHost dédié, jeu public sans connexion, cycle de vie et sauvegardes.
- Domaine, chemin, version YunoHost et détails d’exploitation à préciser.
- Illustrations originales ; logo fourni dans la conversation mais source absente
  du dépôt, signature ONYX textuelle. Budget client : 100 Kio non compressés.

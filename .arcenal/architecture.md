# Architecture

Statut : ACTUEL

Architecture de principe validée par le client le 14 octobre 2026, après validation
du cahier des charges consolidé. Aucun déploiement ni installation n’est autorisé
par cette seule décision. Les détails restant à préciser sont indiqués ci-dessous.

## Organisation retenue

```text
Navigateur ordinateur/mobile
  ├── Jeu HTML/CSS/JavaScript avec Canvas 2D
  └── Tableau commun : lecture et inscription volontaire
                    │ HTTPS, même domaine
YunoHost — serveur web Nginx
  ├── Fichiers statiques du jeu
  └── Routes de résultats → service Python/Flask local → SQLite

Administrateur serveur → commande protégée de retrait d’une inscription
```

Pas de framework côté jeu, pas de base tierce et pas de compte joueur. Le service
Flask est interne au serveur ; seules ses routes nécessaires sont exposées par
le serveur web. Une panne du tableau ne doit pas bloquer le jeu ou ses bilans.

## Responsabilités

| Composant | Responsabilité |
|---|---|
| HTML/CSS | Accueil, consignes, commandes tactiles, pause, bilans et tableau. |
| JavaScript/Canvas | Rendu, déplacements, collisions, dangers et animations. |
| État de partie | Progression en mémoire, temps actif, pauses et reprise. |
| Contenus séparés | Descriptions de niveaux et messages HSE modifiables sans réécrire le moteur. |
| Ressources graphiques | Illustrations et animations servies depuis le même hébergement. |
| Flask | Contrôle, enregistrement et lecture des résultats ; limitation des envois. |
| SQLite | Persistance des vingt dernières inscriptions admissibles. |
| Commande de gestion | Retrait réservé à l’administrateur du serveur. |

Les commandes, le moteur, les niveaux, les dangers et les écrans restent séparés.

## Interfaces et contrôles réalisés

- Lecture publique des vingt derniers résultats, de la plus récente inscription
  à la plus ancienne, sans classement par vitesse.
- Inscription volontaire des trois lettres et du résultat d’une mission complète.
- Contrôles côté serveur : format, cohérence, admissibilité, unicité de la partie
  inscrite et limitation des envois. Aucun secret dans le navigateur.
- Retrait par commande locale ; aucune route publique de suppression nécessaire.

- `POST /api/runs` : jeton signé de départ, valable 24 heures, sans résultat envoyé.
- `GET /api/scores` : vingt inscriptions maximum, identifiant, lettres, dangers,
  durée active et date ; aucune donnée technique de contrôle publiée.
- `POST /api/scores` : jeton, trois lettres ASCII majuscules, durée en millisecondes
  et dix événements danger/temps. Contrôles de niveau, unicité des dangers, temps
  cohérents et durée compatible avec le temps serveur ; partie consommée une seule fois.
- Limites : trente départs et douze tentatives d’inscription par heure et empreinte
  réseau temporaire ; corps limité à 8 Kio ; contrôle d’origine.
- `GET /api/health` : contrôle service et base ; commandes Flask locales
  `scores-list`, `scores-delete ID` et `backup-db DESTINATION`.

Les contrôles dépassent une simple déclaration « terminé », mais un navigateur
modifié peut fabriquer un journal plausible. Ils restent adaptés à un tableau
ludique, sans garantie anti-triche de compétition.

## Données et conservation validées

- Progression de jeu uniquement en mémoire, remise à zéro au rechargement.
- Inscription : trois lettres, dangers sécurisés, temps actif ; identifiant et
  ordre d’inscription nécessaires à la lecture et au retrait fiables.
- Vingt inscriptions maximum en base active : chaque nouvelle entrée évince
  la plus ancienne au-delà de cette limite.
- Insertion et éviction atomiques, y compris lors d’envois simultanés.
- Base hors des fichiers statiques, jamais téléchargeable publiquement.

Les empreintes réseau sont renouvelées par fenêtre horaire ; le registre des jetons
consommés expire après 24 heures. Les entrées expirées sont purgées aux POST suivants.
Aucun journal de progression n’est conservé en base. Les journaux système suivent
la politique du serveur. Les sauvegardes peuvent conserver des
inscriptions évincées de la base active : leur rétention doit être documentée
séparément, sans promettre une suppression immédiate de toutes les copies.

## Droits et exploitation YunoHost

- Jeu et tableau publics, sans connexion au portail YunoHost.
- Gestion réservée à l’administrateur serveur, sans interface complète en V1.
- Utilisateur système dédié au service et droits adaptés pour configuration/données.
- Paquet dédié : `manifest.toml`, format 2, ressources déclaratives, helpers v2.1.
- Nginx sert les fichiers statiques et relaie les seules routes nécessaires.
- Cycle de vie : installation, mise à jour, suppression, sauvegarde et restauration.
- Python >= 3.11, Flask 3.1.3 et Gunicorn 23.0.0 ; dépendances épinglées dans
  `requirements.txt`, environnement isolé. Deux workers Gunicorn sur loopback,
  préchargement, umask 0077 et restrictions systemd. Le serveur Flask de
  développement est utilisé uniquement pour la recette locale.
- Aucun secret dans les fichiers publics ou dans `.arcenal/`.

## Sauvegarde et retour arrière

Inclure configuration utile et base SQLite cohérente dans les sauvegardes YunoHost.
La méthode doit tenir compte des écritures en cours et être vérifiée par restauration.
Avant une mise à jour, prévoir une sauvegarde restaurable du code, de la
configuration et des données. Un retour arrière doit restaurer cet ensemble
cohérent ; les inscriptions postérieures peuvent être perdues et d’anciennes
inscriptions peuvent réapparaître. Documenter ce comportement et la rétention.

## Vérifications et preuves

Les contrôles applicatifs sont exécutés localement et sur GitHub. Le cycle de vie
est vérifié sur YunoHost 12.1.41.2 amd64 dans Incus ; les preuves et limites exactes
sont dans `TEST_REPORT.md` et `docs/recette.md`. Instance client non installée.

- Navigateurs cibles, clavier, tactile, pause et orientation.
- Tableau identique sur deux appareils ; vingt-et-unième inscription évincant
  la plus ancienne ; vingt entrées maximum malgré des écritures concurrentes.
- Refus d’envois mal formés, incohérents, répétés et déjà enregistrés.
- Base et gestion inaccessibles aux visiteurs ; retrait administratif opérationnel.
- Service de tableau arrêté sans bloquer le jeu.
- Installation, mise à jour, suppression, sauvegarde et restauration testées dans
  un environnement dédié avant toute opération réelle.

## Points ouverts

- Domaine, chemin, version YunoHost et environnement de test disponible.
- Configuration effective et réception de l’instance personnelle du client.
- Rétention des sauvegardes et information associée aux inscriptions.
- Recette sur téléphones physiques et mesure humaine de durée de découverte.

Mandat courant : autonomie jusqu’à la V1. Les contenus sont arrêtés par le fournisseur
dans `docs/contenus-hse.md` ; les résultats sont consignés dans `docs/recette.md`.

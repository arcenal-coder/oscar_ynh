# Oscar, mission zéro accident

[![Verify preview](https://github.com/arcenal-coder/oscar_ynh/actions/workflows/verify.yml/badge.svg?branch=preview)](https://github.com/arcenal-coder/oscar_ynh/actions/workflows/verify.yml)

Canal GitHub : **preview** · paquet YunoHost : **1.0.0~ynh1**.
Dans ARCenal Store, choisir **Prévisualisation**, actualiser le catalogue puis
rechercher **Oscar, mission HSE**. L’entrée du catalogue est figée sur un commit,
indépendamment des évolutions ultérieures de la branche.

Jeu web HSE en français : deux sites industriels, dix dangers à repérer et à
sécuriser. Canvas 2D original, aucune image, police ou bibliothèque chargée depuis
un service externe. Sans combat, compte joueur, publicité ou outil de suivi.

## Lancer la V1 localement

Prérequis : Python 3.11 ou supérieur. Node n’est utile que pour les tests navigateur.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m flask --app server.app:create_app run --host 127.0.0.1 --port 8080
```

Ouvrir **http://127.0.0.1:8080**. Cette commande lance le jeu et son tableau commun
local. Le serveur de développement ne doit pas être utilisé pour une publication.
Le choix de 8080 évite le port 5000 parfois utilisé par macOS.

Pour voir uniquement le jeu statique :

```sh
python3 -m http.server 8080 --directory web
```

Le tableau affiche alors son état indisponible ; les deux niveaux restent jouables.
Servir les fichiers en HTTP, plutôt qu’en ouvrant `index.html` en `file://`.

## Jouer

- Flèches gauche/droite : avancer ; espace : sauter ; **E** : agir à proximité.
- Téléphone paysage : boutons tactiles équivalents ; déplacement et saut simultanés.
- Bouton pause, **P** ou Échap : pause. L’arrière-plan et le portrait suspendent le jeu.
- Approcher chaque danger pour l’identifier, puis agir. Lire le message avant de continuer.
- Sécuriser les cinq dangers et rejoindre la sortie ; poursuivre à l’usine.
- En cas de chute, retour dans une zone sûre, sans perte des actions déjà réalisées.
- À la fin : bilan, inscription facultative sous trois lettres, partage et rejouer.

Le temps exclut les pauses et les messages pédagogiques. Il ne donne aucun bonus.
« Sécurisé » signifie une mise en sécurité adaptée : une fuite reste visible derrière
son balisage en attendant l’équipe habilitée. Le jeu ne constitue pas une formation
habilitante ni une instruction d’intervention réelle.

## Structure

```text
web/                 Site statique autonome
  js/content.js      Niveaux et textes pédagogiques
  js/art.js          Dessins originaux Canvas
  js/game.js         Simulation, déplacements et progression
  js/app.js          Écrans, commandes, tableau et partage
server/              API Flask et commandes de gestion
tests/               Tests API et parcours navigateur
manifest.toml        Paquet YunoHost v2
scripts/ et conf/    Cycle de vie YunoHost, Nginx et systemd
docs/                Contenus HSE et recette
tools/               Fabrication des archives de livraison
.arcenal/            État et décisions du projet
```

## Publier sur YunoHost

Architecture retenue : Nginx sert `web/` ; seules les routes `/api/` sont relayées
vers Gunicorn/Flask sur `127.0.0.1`. SQLite est hors du répertoire public. Aucune clé
API et aucun compte externe ne sont requis. Un domaine déjà configuré sur YunoHost
est nécessaire ; le chemin proposé est `/oscar`, la racine `/` est aussi prévue.

Le paquet cible **YunoHost 12.1.17 ou supérieur**, helpers 2.1. Il installe Python,
un environnement isolé et les dépendances épinglées. L’accès à Debian/PyPI est
nécessaire pendant l’installation ; aucun téléchargement externe pendant une partie.

Créer les archives localement :

```sh
python3 tools/build_release.py
.venv/bin/python tools/check_release.py
```

Livrables : `dist/oscar-static-1.0.0.zip`, `dist/oscar-yunohost-1.0.0.tar.gz`,
`dist/SHA256SUMS`. Les environnements locaux, données et secrets sont exclus.

Après transfert de l’archive sur le serveur, extraire dans un dossier de travail :

```sh
tar -xzf oscar-yunohost-1.0.0.tar.gz
sudo yunohost app install ./oscar
```

Le domaine et le chemin sont demandés par l’installeur YunoHost. Le jeu est public,
y compris pour les personnes sans compte YunoHost. Vérifier avant diffusion :

1. Page du jeu accessible en navigation privée et HTTPS.
2. `<adresse-du-jeu>/api/health` retourne `status: ok`.
3. Partie complète, inscription, lecture sur un second appareil et retrait.
4. Sauvegarde, mise à jour et restauration sur une instance de test.

**État de preuve :** le paquet et ses scripts sont fournis ; les vérifications
réellement exécutées sont consignées dans `docs/recette.md`. Un contrôle de syntaxe
ne remplace pas une installation YunoHost. Aucun serveur client n’a été modifié.

### Mise à jour, sauvegarde et retour arrière

Après transfert et extraction de la nouvelle archive :

```sh
sudo yunohost backup create --apps oscar
sudo yunohost app upgrade oscar -u ./oscar
```

Adapter `oscar` si plusieurs instances sont installées (`oscar__2`, etc.). Conserver
le nom de sauvegarde retourné par YunoHost. Le script utilise l’API SQLite de backup
pour produire une base cohérente, même si le service a des pages en WAL.

La restauration est une opération d’exploitation à tester sur une instance dédiée :

```sh
sudo yunohost backup restore NOM_DE_SAUVEGARDE --apps oscar
```

Une instance déjà installée peut devoir être retirée avant la restauration, selon
la procédure YunoHost. Les résultats postérieurs à la sauvegarde sont alors perdus ;
d’anciennes inscriptions peuvent réapparaître. Le paquet ne supprime pas les anciennes
sauvegardes YunoHost : leur rotation relève de la politique du serveur.

`yunohost app remove oscar` retire le service et le code ; les données sont conservées
par YunoHost sauf demande explicite de purge. La suppression avec purge doit être
réservée à un retrait définitif après sauvegarde adaptée.

## Gestion du tableau

Localement :

```sh
.venv/bin/flask --app server.app:create_app scores-list
.venv/bin/flask --app server.app:create_app scores-delete 12
```

Sur YunoHost, pour l’instance `oscar` :

```sh
sudo -u oscar env PYTHONPATH=/var/www/oscar OSCAR_DATA_DIR=/home/yunohost.app/oscar /var/www/oscar/venv/bin/flask --app server.app:create_app scores-list
sudo -u oscar env PYTHONPATH=/var/www/oscar OSCAR_DATA_DIR=/home/yunohost.app/oscar /var/www/oscar/venv/bin/flask --app server.app:create_app scores-delete 12
```

Remplacer `12` par l’identifiant affiché. Aucun endpoint public ne permet le retrait.
L’administrateur peut diagnostiquer le service avec `journalctl -u oscar`.

### Stockage et confidentialité

- `OSCAR_DATA_DIR` : dossier des données (défaut local : `data/`, ignoré par Git).
- `scores.sqlite3` : vingt dernières inscriptions, éviction atomique de la plus ancienne.
- `.secret` : clé locale de signature générée automatiquement ; ne jamais publier ce fichier.
- Jeton de partie signé : valide 24 heures ; aucune progression intermédiaire envoyée.
- Au moment de l’inscription seulement : trois lettres, temps actif et journal des dix
  sécurisations pour contrôle. Le journal n’est pas conservé dans les résultats publiés.
- Registre de jetons consommés : empêche une réinscription après éviction du résultat ;
  les entrées expirées sont purgées lors des requêtes POST suivantes.
- Limites par empreinte réseau temporaire : 30 départs et 12 tentatives d’inscription
  par heure. Les IP brutes ne sont pas enregistrées dans la base. Ces limites sont
  partagées par les personnes derrière une même connexion.
- Les journaux standards Nginx/YunoHost peuvent contenir des IP selon la configuration
  du serveur ; leur rotation relève de cette configuration.
- Les données anciennes peuvent rester dans les sauvegardes jusqu’à leur suppression.

Les contrôles vérifient le jeton, le temps écoulé et les dix événements cohérents.
Ils ne prouvent pas qu’un navigateur modifié a réellement joué : aucun classement
compétitif ou garantie anti-triche forte n’est proposé.

`OSCAR_TRUST_PROXY=1` est réservé au proxy Nginx fourni, qui écrase les en-têtes de
provenance ; ne pas activer cette option sur un serveur directement exposé.

## Partage LinkedIn

Le bouton ouvre le partage du lien public, et « Copier le texte » fournit le message
prêt à coller. LinkedIn ne garantit pas le préremplissage du commentaire personnel.
Le joueur publie volontairement. Le lien utilisé est automatiquement l’adresse du jeu.
Pour une diffusion réelle, utiliser l’URL publique HTTPS, pas l’adresse locale.

## Vérifications de développement

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
.venv/bin/python -m compileall -q server
.venv/bin/python -m unittest discover -s tests -p 'test_*.py' -v
npm test
```

Les tests navigateur utilisent un temps accéléré pour parcourir les deux niveaux
avec de vraies commandes clavier. Le mode dégradé y est simulé ; les tests API
vérifient séparément le service réel, la concurrence, la rétention et les refus.
Les artefacts sont dans `test-results/` (ignoré par Git).

Contrôles de qualité et du paquet :

```sh
.venv/bin/python -m pip install -r requirements-dev.txt
npm run format:check
.venv/bin/ruff check server tests/test_api.py tools
.venv/bin/shellcheck -e SC1091 scripts/_common.sh scripts/install scripts/upgrade scripts/remove scripts/backup scripts/restore
.venv/bin/python tools/check_package.py
.venv/bin/pip-audit -r requirements.txt
```

SC1091 est exclu car les helpers `/usr/share/yunohost/helpers` n’existent pas sur
le poste de développement ; les variables injectées par YunoHost restent vérifiées.
Le contrôle de schéma consulte le schéma officiel en ligne.

## Contenus et identité

Les dix fiches pédagogiques sont dans `docs/contenus-hse.md`. Les dessins et Oscar
sont originaux. Le logo graphique Onyx transmis dans la conversation n’existe pas
comme fichier source dans le dépôt : la V1 emploie donc une signature ONYX en texte,
sans reproduction approximative du logo. Le mandat client autorise les choix de
réalisation nécessaires à la V1, consignés dans `.arcenal/decisions.md`.

Le manifeste indique une distribution privée (`LicenseRef-Proprietary`) ; aucune
licence de redistribution open source n’a été décidée. Les dépendances conservent
leurs licences respectives. Ne pas publier sur un catalogue public sous une licence
inventée au nom du client.

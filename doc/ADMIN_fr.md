# Administration

Le jeu est public et ne nécessite pas de connexion YunoHost. Le tableau est stocké
dans `__DATA_DIR__/scores.sqlite3`, hors de l’espace web. Aucun mot de passe joueur.

Lister les inscriptions :

```sh
sudo -u __APP__ env PYTHONPATH=__INSTALL_DIR__ OSCAR_DATA_DIR=__DATA_DIR__ __INSTALL_DIR__/venv/bin/flask --app server.app:create_app scores-list
```

Retirer une inscription : même commande, en remplaçant `scores-list` par
`scores-delete IDENTIFIANT`. Diagnostic : `journalctl -u __APP__`.

Les sauvegardes contiennent une copie cohérente de la base et la clé locale.
Définir leur rétention sur le serveur : une inscription retirée du tableau peut
subsister dans une ancienne sauvegarde. Une restauration peut la faire réapparaître.

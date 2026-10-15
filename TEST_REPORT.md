# Rapport de qualification — preview V1

Publication : 15 octobre 2026. Rapport fournisseur, sans simulation de réception client.

## Chaîne de livraison vérifiée

| Élément | Référence |
|---|---|
| Dépôt / branche | https://github.com/arcenal-coder/oscar_ynh / `preview` |
| Commit applicatif et paquet testé | `ac3c74ab2bdb8d8904062e7a268e8d08e33a9067` |
| Tag source | `v1.0.0-preview.1`, pointant sur ce même commit |
| Version YunoHost | `1.0.0~ynh1` |
| Catalogue | PR https://github.com/arcenal-coder/arcenal-systeme-catalogue/pull/10, fusion `6c6e70f111b28dac94080928f69eef35e6972288` |
| Promotion sélective | https://github.com/arcenal-coder/arcenal-systeme-catalogue/actions/runs/38628739041 |
| Prérelease et archives | https://github.com/arcenal-coder/oscar_ynh/releases/tag/v1.0.0-preview.1 |

Le flux effectivement consommé par ARCenal Store a été relu après publication :
https://raw.githubusercontent.com/arcenal-coder/arcenal-systeme-catalogue/main/preview/v3/apps.json
Il référence Oscar avec cette version et ce SHA, sans entrée Oscar en stable.
Les commits ultérieurs de documentation ne changent pas la révision installable.

## Contrôles applicatifs

Preuve GitHub : https://github.com/arcenal-coder/oscar_ynh/actions/runs/38622654281

| Contrôle | État |
|---|---|
| Formatage, syntaxe JS, Ruff, compilation Python, ShellCheck | RÉUSSI |
| Schéma officiel du manifeste et syntaxe des scripts | RÉUSSI |
| Dix tests API, dont concurrence, refus, conservation et backup SQLite non vide | RÉUSSI |
| Parcours Chromium, pause, chute, bilans, mode dégradé et inscription réelle | RÉUSSI |
| Archives : empreintes, intégrité, démarrage de la livraison extraite | RÉUSSI |
| Catalogue ARCenal : seize tests et contrôles GitHub | RÉUSSI |

Firefox, WebKit et émulations iPhone/Android ont également été vérifiés localement ;
voir `docs/recette.md`. Les archives de la prérelease proviennent du contrôle GitHub
réussi, sans données locales ni secret.

## Cycle de vie YunoHost réellement exécuté

Preuve : https://github.com/arcenal-coder/oscar_ynh/actions/runs/38622654245
Rapport brut : artefact `yunohost-report`, fichier `package_check/results_0.json`.
Environnement : Incus isolé sur GitHub, YunoHost **12.1.41.2**, Debian Bookworm,
architecture **amd64**, branche YunoHost stable.

| Scénario amont | État |
|---|---|
| `TEST_PACKAGE_LINTER` | RÉUSSI au sens du scénario amont ; deux avertissements et trois pistes d’amélioration signalés |
| `TEST_INSTALL root` : installation, accès web, retrait et réinstallation | RÉUSSI |
| `TEST_INSTALL subdir` : installation sous-chemin, accès web, retrait/réinstallation | RÉUSSI |
| `TEST_INSTALL multi` : plusieurs instances | RÉUSSI |
| `TEST_BACKUP_RESTORE` : cycle de sauvegarde/restauration et accès restauré | RÉUSSI |
| `TEST_UPGRADE` : mise à jour du paquet | RÉUSSI |
| `TEST_CHANGE_URL` : changement de domaine/chemin | RÉUSSI |

Le rapport brut amont indique un **niveau 0** ; le catalogue ARCenal conserve
exactement ce niveau. Le succès des scénarios ne doit pas être présenté comme
une qualification officielle de niveau 5 ou 8.

Le scénario système utilise la base créée lors de l’installation. La conservation
d’une inscription dans un snapshot SQLite non vide est vérifiée séparément par
les tests API locaux ; aucun test système de restauration d’un tableau rempli
par une partie jouée n’est revendiqué.

## Limites explicites

| Élément | État |
|---|---|
| Installation sur le serveur personnel du client | NON_EXÉCUTÉ — aucun accès serveur fourni |
| Installation native ARM et téléphones physiques | NON_EXÉCUTÉ |
| Panel humain de trois débutants et durée de découverte | NON_EXÉCUTÉ |
| Publication LinkedIn réelle | NON_EXÉCUTÉ — aucune publication automatique |
| Portail SSO, routage ARC Frugal et fournisseurs IA | NON_APPLICABLE_JUSTIFIÉ — jeu public sans IA ni compte joueur |
| Inscription au catalogue communautaire officiel YunoHost | NON_APPLICABLE_JUSTIFIÉ — diffusion demandée dans ARCenal Store preview |

Cette publication rend la candidate installable depuis ARCenal Store, canal
**Prévisualisation**. Elle ne modifie aucun serveur client et ne constitue pas
une promotion stable.

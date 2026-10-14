# Revue de livraison

Statut : passe séparée de relecture par le fournisseur, après réalisation et tests.
Il ne s’agit pas d’une revue par un intervenant indépendant.

## Points examinés

- Cohérence des dix situations avec les contenus HSE : interventions spécialisées
  remplacées par balisage/alerte, sans réparation magique.
- Décompte des dangers et temps actif, transitions, pause, reprise et rechargement.
- Données publiques construites avec `textContent`, sans injection de pseudos HTML.
- API : requêtes paramétrées SQLite, verrou d’écriture, éviction atomique, registre
  de jetons consommés distinct du tableau ; absence de suppression HTTP publique.
- Clé générée sous verrou, hors des fichiers publics ; variables et données locales
  exclues de Git et de la construction des archives.
- Origine et corps des requêtes, format, chronologie, limites et signature vérifiés.
- Proxy loopback avec remplacement de l’en-tête réseau, compte système dédié et
  droits restrictifs ; pas de secret dans les modèles de paquet.
- Sauvegarde SQLite cohérente par l’API native, clé sauvegardée, distinction explicite
  entre vingt résultats actifs et anciennes copies d’archives.
- Sources embarquées et liste explicite de livrables : aucun téléchargement upstream
  fictif ni remplacement de l’architecture retenue.
- Documentation séparant tests locaux, émulation et vérifications YunoHost non faites.

## Constats traités

L’absence de fermeture automatique SQLite, la rotation mobile, l’initialisation
concurrente de clé, les requêtes Origin malformées et le rendu continu en pause ont
été corrigés et vérifiés ; voir `docs/recette.md`.

## Limites conservées explicitement

- Tableau ludique : des événements plausibles peuvent être fabriqués par un navigateur
  modifié ; aucune garantie de compétition n’est annoncée.
- La durée 3–5 minutes est une cible de découverte, pas un résultat de panel humain.
- Le paquet n’a pas été installé sur un serveur YunoHost depuis ce poste.
- Le logo graphique source n’est pas présent ; la signature ONYX reste textuelle.

Ces limites sont tracées et ne sont pas masquées par les résultats de tests.

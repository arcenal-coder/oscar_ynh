# Cahier des charges — Oscar, mission zéro accident

Version : 1.2 — 14 octobre 2026

Statut : cahier des charges consolidé validé par le client. Architecture YunoHost
et conservation des vingt dernières inscriptions également validées.
Référence technique : `.arcenal/architecture.md`.

Mandat complémentaire : le client a donné carte blanche pour atteindre la V1
sans sollicitation intermédiaire. Le fournisseur arrête les contenus et détails
de réalisation, trace ses choix et distingue les contrôles locaux de la recette
sur le serveur réel. Ce mandat remplace les attentes d’accord bloc par bloc restantes.

## 1. Objectif et utilisateurs

Permettre à une personne découvrant le jeu depuis LinkedIn de vivre une courte
mission de prévention avec Oscar, de comprendre les bons réflexes associés aux
dangers rencontrés et de partager son résultat.

Le public principal est professionnel et non spécialiste : salariés, managers et
visiteurs intéressés par la prévention. Aucune connaissance HSE ni expérience des
jeux de plateforme n’est requise. Les professionnels HSE peuvent utiliser le jeu
comme support de sensibilisation.

Le client est le réceptionnaire du produit et des contenus pédagogiques. Le
fournisseur logiciel réalise le jeu et apporte les preuves de vérification.

## 2. Périmètre V1

- Jeu de plateforme 2D en français, sans combat ni violence.
- Oscar, agent HSE sympathique et expressif, toujours équipé de ses EPI.
- Deux niveaux de cinq dangers chacun : Raffinerie, puis Usine.
- Déplacement gauche/droite, saut et interaction, au clavier ou sur écran tactile.
- Identification et sécurisation des dangers, micro-animations et messages HSE.
- Accueil, prise en main, pause, bilans de niveau, bilan final et bouton Rejouer.
- Tableau d’honneur commun aux joueurs, sans compte, avec inscription facultative.
- Partage LinkedIn volontaire et texte de publication prêt à copier.
- Application cliente publiable sur un hébergement statique et service de stockage
  nécessaire au tableau commun.
- Code structuré et documenté ; README de lancement local, publication et gestion
  du tableau.

Durée indicative d’une première partie complète : 3 à 5 minutes. Aucun délai
maximum n’est imposé au joueur.

## 3. Parcours principal

1. Accueil : titre, Oscar, objectif et bouton « Jouer ».
2. Consignes courtes adaptées au clavier ou aux commandes tactiles.
3. Exploration du niveau ; approche d’un danger pour l’identifier.
4. Interaction volontaire pour le sécuriser ; animation et message pédagogique.
5. Sortie accessible comme fin de niveau après sécurisation des cinq dangers.
6. Bilan : dangers identifiés, dangers sécurisés, temps actif et conseil HSE ;
   accès au niveau suivant.
7. Fin : bilan global et message « Site sécurisé : bravo, vous contribuez à la
   prévention des accidents. »
8. Inscription facultative au tableau commun sous trois lettres ; possibilité de
   passer cette étape.
9. Consultation du tableau, partage LinkedIn ou nouvelle partie avec « Rejouer ».

## 4. Exigences et critères d’acceptation

### EX-01 — Messages pédagogiques

Pour chaque danger sécurisé, le jeu doit expliquer au joueur le risque évité et
le bon réflexe HSE dans une phrase courte en français.

**AC-01 :** chaque sécurisation affiche le message correspondant ; aucune des dix
situations ne reste sans explication.

### EX-02 — Parcours sans compte

Le joueur doit pouvoir parcourir le jeu de l’accueil au bilan final sur ordinateur
et mobile sans créer de compte.

**AC-02 :** une partie complète peut être terminée sur les deux types d’appareils
sans authentification ni saisie d’informations personnelles.

### EX-03 — Deux niveaux et dix dangers

Chaque niveau doit comporter cinq dangers distincts :

| Raffinerie | Usine |
|---|---|
| Sol glissant | Machine non protégée |
| Fuite | Charge mal rangée |
| Zone mal balisée | Passage encombré |
| Obstacle au sol | Signalisation absente |
| EPI manquant | Bruit nécessitant une protection auditive |

**AC-03 :** chacun des dix dangers possède un visuel identifiable, une action de
sécurisation, une micro-animation et un message expliquant le risque évité et le
bon réflexe. Les situations voisines, notamment fuite et sol glissant, restent
distinctes dans leur représentation et leur action.

### EX-04 — Identification puis sécurisation

À l’approche d’un danger, le jeu doit le compter comme identifié et afficher une
indication du risque et de l’action adaptée. Une interaction doit ensuite le
sécuriser, sans quiz ni manipulation complexe.

Oscar doit sécuriser l’accès et alerter une personne habilitée si la situation
nécessite une intervention spécialisée ; il ne répare pas lui-même une machine
ou une fuite industrielle.

**AC-04 :** les compteurs distinguent identification et sécurisation ; chaque
danger ne peut incrémenter chaque compteur qu’une seule fois.

### EX-05 — Progression sans punition

Le jeu doit permettre de progresser sans vies ni compte à rebours. Une chute
ramène Oscar dans une zone sûre proche, en conservant les dangers déjà sécurisés.
Un danger non traité reste à traiter et ne provoque aucune blessure représentée.

**AC-05 :** le bilan apparaît uniquement après sécurisation des cinq dangers et
arrivée à la sortie ; une chute n’annule aucune sécurisation.

### EX-06 — Bilans de prévention

Chaque bilan de niveau doit afficher les dangers identifiés sur cinq, les dangers
sécurisés sur cinq, le temps actif et un conseil HSE. Le bilan global cumule les
deux niveaux, avec dix dangers sécurisés sur dix pour une mission terminée.

**AC-06 :** les compteurs correspondent aux actions réelles ; le temps exclut les
pauses. Aucun point, étoile, bonus de vitesse ou classement compétitif n’est affiché.

### EX-07 — Commandes et pause

Sur ordinateur : flèches gauche/droite, espace pour sauter, E pour interagir.
Sur mobile : boutons tactiles équivalents, permettant notamment d’avancer et de
sauter simultanément. Une pause manuelle doit rester accessible pendant la partie.
Le passage en arrière-plan doit mettre le jeu en pause, avec reprise volontaire.

**AC-07 :** toutes les actions sont réalisables au clavier et au tactile ; en
pause, les mouvements, la simulation de jeu et le chronomètre sont arrêtés.

### EX-08 — Données de partie

La progression courante doit rester en mémoire pendant la visite, sans sauvegarde
entre visites. Les résultats ne sont transmis au tableau que sur action volontaire.

**AC-08 :** recharger la page réinitialise le niveau, la progression et le bilan
courant, mais ne supprime pas les inscriptions déjà enregistrées dans le tableau
commun. Aucun nom ni e-mail n’est demandé.

### EX-09 — Inscription arcade facultative

Après une mission complète, le joueur doit pouvoir choisir trois lettres et
enregistrer son résultat dans le tableau commun, ou ignorer cette étape.

**AC-09 :** l’inscription publiée affiche les trois lettres, le nombre de dangers
sécurisés et le temps réalisé ; aucun compte ni adresse e-mail n’est demandé.

### EX-10 — Tableau d’honneur commun

Le tableau doit présenter les vingt dernières missions enregistrées, de la plus
récente à la plus ancienne, sans départager les joueurs par vitesse.

**AC-10 :** une nouvelle inscription apparaît en tête ; au plus vingt inscriptions
sont affichées et conservées dans la base active. Une nouvelle inscription évince
la plus ancienne au-delà de vingt. Deux appareils consultant le service après
actualisation voient les mêmes inscriptions.

### EX-11 — Droits et gestion

Un joueur peut consulter le tableau et inscrire son propre résultat admissible.
Il ne peut ni modifier ni supprimer les inscriptions publiées. Le gestionnaire
doit disposer d’un moyen protégé pour retirer une inscription inappropriée.

**AC-11 :** un visiteur ne peut pas effectuer une opération de gestion ; le
gestionnaire peut retirer une inscription. L’interface d’administration complète
est hors V1 ; le retrait passe par une commande réservée à l’administrateur serveur.

### EX-12 — Téléphone en paysage

Le jeu doit être jouable en paysage sur téléphone, sans installation ni plein
écran obligatoires. En portrait, il doit mettre la partie en pause et inviter à
tourner l’appareil, sans perte de progression.

**AC-12 :** en paysage, la scène et les commandes sont visibles sans défilement de
page ; le passage en portrait suspend le jeu et affiche l’invitation.

### EX-13 — Durée de découverte

La taille des niveaux doit viser une première partie complète de 3 à 5 minutes,
sans imposer de limite de temps.

**AC-13 :** lors de la recette, au moins deux personnes sur trois découvrant le
jeu terminent les deux niveaux en cinq minutes maximum, sans aide extérieure.

### EX-14 — Direction visuelle et lisibilité

Le jeu doit adopter une illustration 2D simplifiée, chaleureuse et professionnelle,
inspirée de l’ambiance de la référence fournie : jaune sécurité, orange, bleu
acier et gris clair. Les éléments graphiques ne doivent pas reprendre d’éléments
protégés de jeux existants ni glorifier les comportements dangereux.

**AC-14 :** Oscar porte ses EPI dans toutes ses animations ; chaque danger possède
un indice visuel distinct ne reposant pas uniquement sur la couleur. Les points
et étoiles de l’image de référence ne sont pas repris comme mécanique de score.

Le logo Onyx a été fourni comme référence ; son emplacement et son usage exact
restent à confirmer au lot 1.

### EX-15 — Navigateurs et indépendance du jeu

Le jeu doit fonctionner sans extension dans les versions courantes de Chrome,
Firefox, Edge, Safari, Chrome Android et Safari iPhone. La disponibilité du tableau
ne doit pas conditionner le déroulement de la partie.

**AC-15 :** une panne du service de résultats pendant une partie n’empêche ni de
terminer les niveaux, ni d’afficher le bilan, ni de rejouer ; un message indique
que l’inscription est temporairement indisponible.

### EX-16 — Protection des inscriptions

Le service doit vérifier le format des trois lettres, la cohérence du résultat
et l’admissibilité d’une mission complète. Il doit refuser le second enregistrement
d’une même partie et limiter les envois répétés. Aucun secret ou accès de gestion
ne doit être intégré au code public du jeu.

**AC-16 :** des envois mal formés, incohérents ou dupliqués sont refusés ; la
limitation d’envois peut être vérifiée ; les fonctions de gestion sont inaccessibles
à un joueur. Les seuils et le protocole seront précisés à l’architecture.

Ces protections sont destinées à un tableau ludique, sans garantie anti-triche
de compétition.

### EX-17 — Partage LinkedIn

Le jeu doit permettre de copier un texte et d’ouvrir le partage LinkedIn du lien
public. Aucune connexion LinkedIn dans le jeu ni publication automatique n’est requise.

Texte prévu pour une mission terminée :

> J’ai terminé « Oscar, mission zéro accident » : 10 dangers sécurisés sur 10 !
> Une courte mission pour découvrir les bons réflexes de prévention. À vous de
> jouer : [lien du jeu]

**AC-17 :** depuis l’écran final, le joueur peut copier le texte correspondant à
son résultat et ouvrir le partage avec le lien public ; il décide de publier.
Le commentaire personnel n’est pas supposé prérempli par LinkedIn.

### EX-18 — Validation pédagogique préalable

Le fournisseur doit formaliser les dix situations avant leur réalisation graphique
et leur intégration : danger, action d’Oscar et phrase pédagogique. Le mandat
d’autonomie lui délègue la validation de ces contenus pour la V1.

**AC-18 :** les dix fiches sont arrêtées et vérifiées avant intégration ; aucune
ne demande au joueur de réaliser lui-même une intervention réservée à une personne
habilitée. Sous le mandat d’autonomie, cette vérification est assurée par le
fournisseur dans `docs/contenus-hse.md`, sans prétendre à une certification HSE externe.

### EX-19 — Livrables et documentation

Le fournisseur doit livrer une application complète, un code structuré et documenté
et un README expliquant comment lancer localement, publier le jeu, configurer le
service de résultats et retirer une inscription avec l’accès prévu.

**AC-19 :** les instructions permettent de lancer et publier la version livrée ;
les prérequis retenus et la configuration du tableau sont documentés sans secret.
Ce critère formalise le livrable README demandé initialement.

## 5. Données, rôles et intégrations

| Élément | Usage et portée |
|---|---|
| Niveau, dangers, temps actif | Mémoire de la partie courante ; réinitialisés au rechargement. |
| Trois lettres et résultat volontaire | Stockage partagé pour le tableau d’honneur. |
| Ordre d’inscription | Associé aux vingt dernières inscriptions conservées en base active. |
| Données temporaires de contrôle | Détails et conservation à préciser avant le lot 5. |
| Joueur sans compte | Jouer, consulter, inscrire facultativement une mission complète. |
| Gestionnaire | Retirer une inscription au moyen d’un accès protégé. |
| LinkedIn | Partage volontaire d’un lien et texte à copier ; aucun SDK requis par le besoin. |

La demande initiale « aucun service externe obligatoire » est révisée pour le seul
tableau commun, explicitement choisi par le client. Le service sera hébergé sur
son serveur YunoHost avec Python/Flask et SQLite, sur le même domaine que le jeu.
Aucune plateforme de stockage tierce ni compte joueur n’est nécessaire ; aucun
secret ne doit être exposé dans le navigateur. Le cœur du jeu reste indépendant
de ce service. Un paquet dédié prévoit cycle de vie, sauvegarde et restauration.

## 6. Hors V1 et évolutions

Hors V1 : chantier BTP, comptes joueurs, sauvegarde entre visites, compétition,
points, vies, bonus de vitesse, multijoueur, quiz, langues autres que le français,
administration complète, statistiques de fréquentation, suivi des visiteurs,
sons et musique.

Évolutions possibles : troisième niveau BTP, nouveaux scénarios HSE et effets
sonores facultatifs. Elles ne sont pas autorisées par la présente V1.

## 7. Faits, décisions et questions ouvertes

### Faits confirmés

- Dépôt initial sans code applicatif ni manifeste lors du bootstrap.
- Suivi `.arcenal/` initialisé avec accord explicite.
- Description détaillée, image de référence du jeu et logo Onyx fournis dans
  la conversation ; présence de fichiers graphiques exploitables à vérifier.
- Le client a validé chaque bloc de cadrage et les six lots, puis autorisé la rédaction.

### Décisions prises

Les exigences ci-dessus reprennent le cadrage validé. Le tableau commun remplace
la proposition initiale de tableau local ; la publication volontaire d’un résultat
est l’exception à l’absence de transmission de données de partie.

### Hypothèses et limites non validées

Les choix validés sont HTML/CSS/JavaScript avec Canvas 2D sans framework côté jeu,
Python/Flask et SQLite côté tableau, sur le serveur YunoHost du client. Les versions
de dépendances et dimensions de scène restent à déterminer. Aucun coût
supplémentaire ni délai de livraison n’a été approuvé.

### Questions ouvertes

- Nom définitif, placement du logo Onyx et disponibilité des ressources sources.
- Réception humaine éventuelle des contenus pédagogiques arrêtés sous mandat.
- Domaine, chemin, version YunoHost, URL publique et image d’aperçu LinkedIn éventuelle.
- Vérification de la commande de gestion et du cycle de vie sur le serveur réel.
- Rétention des journaux et sauvegardes du serveur : seules vingt inscriptions sont
  conservées en base active, mais des copies anciennes peuvent subsister en archive.
- Recette sur téléphones physiques et panel de débutants ; budget client retenu
  sous mandat : 100 Kio non compressés, hors données du tableau.

Ces points doivent être résolus au stade approprié, sans transformer une
hypothèse technique en décision client.

## 8. Lots proposés et validés

### Lot 1 — Contenus HSE et identité

- **Objectif :** valider la pédagogie et la direction visuelle.
- **Périmètre :** dix fiches danger/action/message, conseils, Oscar et usage Onyx.
- **Acceptation :** AC-18 ; direction visuelle et usage de marque approuvés.
- **Dépendance :** cahier des charges validé.
- **Fin :** contenus et direction visuelle arrêtés dans le mandat d’autonomie,
  avec traçabilité des choix du fournisseur.

### Lot 2 — Première scène jouable

- **Objectif :** vérifier la prise en main avant de produire tous les niveaux.
- **Périmètre :** scène courte, un danger, déplacement, saut, interaction, tactile,
  pause et orientation.
- **Acceptation :** AC-04, AC-07 et AC-12 sur la scène ; animation et message visibles.
- **Dépendances :** lot 1 et architecture validée.
- **Fin :** démonstration jouable et vérifiée sur ordinateur et téléphone paysage.

### Lot 3 — Deux niveaux complets

- **Objectif :** réaliser les dix situations et la progression sans punition.
- **Périmètre :** Raffinerie, Usine, sorties et retours en zone sûre.
- **Acceptation :** AC-01, AC-03, AC-05 et AC-14.
- **Dépendance :** lot 2.
- **Fin :** les deux niveaux sont terminables avec conservation de la progression
  après chute et messages corrects pour chaque danger.

### Lot 4 — Parcours complet et partage

- **Objectif :** relier les niveaux en une expérience complète partageable.
- **Périmètre :** accueil, consignes, bilans, fin positive, rejouer et LinkedIn.
- **Acceptation :** AC-02, AC-06, AC-08 et AC-17 ; vérification du message final.
- **Dépendance :** lot 3.
- **Fin :** parcours complet vérifié, compteurs exacts et partage opérationnel.

### Lot 5 — Tableau d’honneur commun

- **Objectif :** publier les résultats volontaires sans compte joueur.
- **Périmètre :** inscription à trois lettres, vingt derniers résultats, contrôles,
  mode dégradé et retrait protégé.
- **Acceptation :** AC-09, AC-10, AC-11, AC-16 et mode dégradé d’AC-15.
- **Dépendances :** lot 4 et solution de stockage/gestion validée.
- **Fin :** résultats communs vérifiés sur deux appareils ; contrôles et retrait
  fonctionnels ; panne du tableau sans blocage du jeu.

### Lot 6 — Recette et livraison

- **Objectif :** réceptionner le jeu et fournir les moyens de le publier.
- **Périmètre :** recette navigateurs, mobile, lisibilité, durée, documentation.
- **Acceptation :** AC-13, compatibilité d’AC-15, AC-19 et consolidation des preuves
  de tous les autres critères.
- **Dépendances :** lots précédents terminés.
- **Fin :** critères vérifiés, écarts traités ou explicitement acceptés par le
  client, README fourni et réception client enregistrée.

## 9. Suite du projet

Le mandat d’autonomie autorise la réalisation des lots et les dépendances locales
nécessaires à la V1. Les preuves, écarts et limites de livraison sont dans
`docs/recette.md`. La publication sur le serveur YunoHost dépend de son accès
effectif ; aucune installation distante ne doit être déclarée sans preuve.

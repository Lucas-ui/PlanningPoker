# Planning Poker

## Description du Projet

PlanningPoker est une application web simple et sans backend, conçue pour faciliter l'estimation Agile des User Stories en équipe. Ce projet utilise HTML, CSS et JavaScript pur.

Ce projet implémente un système de persistance locale permettant de sauvegarder et de reprendre une session interrompue.

##  Fonctionnalités Clés

Ce projet implémente les fonctionnalités standard du Planning Poker, ainsi que des logiques de règles et de session avancées :


## Installation et Démarrage

Ce projet ne nécessite aucune installation de serveur.

1.  **Clonage du Dépôt** :
    ```bash
    git clone https://github.com/Lucas-ui/PlanningPoker.git

    cd PlanningPoker
    ```
2.  **Démarrage** : Ouvrez simplement le fichier `index.html` dans votre navigateur web ou avec l'extension `Live Server`.

## Utilisation

### 1. Démarrer une Nouvelle Partie

1.  Cliquez sur **"Commencer la partie"**.
2.  Renseignez le nom de la session, le nombre de participants, la règle de consensus, et **importez votre fichier JSON** de backlog (doit contenir un tableau `"backlog"`).
3.  Entrez le nom de chaque participant.
4.  La partie commence avec la première User Story.

### 2. Reprendre une Partie Interrompue

Si une partie a été interrompue par un vote `cafe` ou un export, un fichier JSON de sauvegarde a été téléchargé.

1.  Sur la page d'accueil, cliquez sur **"Reprendre une partie"**.
2.  Importez le fichier JSON de sauvegarde (`planning-poker-break-results-DATE.json`).
3.  Le jeu reprendra automatiquement sur l'User Story qui était en cours au moment de l'interruption (pour re-voter dessus).


## 🧪 Tests et Documentation Automatisés

Le projet utilise GitHub Actions pour garantir la qualité et la documentation :

* **Tests Unitaires (Jest)** : Les tests sont exécutés automatiquement sur chaque *push* ou *pull request* pour valider la fiabilité des fonctions critiques.
* **Documentation (JSDoc)** : Un workflow dédié génère la documentation technique (basée sur les commentaires JSDoc ajoutés à tout le code source) et la déploie sur la branche `gh-pages`.
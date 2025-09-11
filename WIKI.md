# Guide d'Utilisation de l'Espace Administrateur CVMaster

Bienvenue dans le guide d'utilisation de CVMaster ! Ce document vous explique comment gérer le contenu de votre CV en ligne via l'espace administrateur sécurisé.

## Table des matières
1.  [Accès à l'Espace Administrateur](#1-accès-à-lespace-administrateur)
2.  [Tableau de Bord](#2-tableau-de-bord)
3.  [Gestion du Profil](#3-gestion-du-profil)
4.  [Gestion des Expériences](#4-gestion-des-expériences)
5.  [Gestion des Formations](#5-gestion-des-formations)
6.  [Gestion des Compétences](#6-gestion-des-compétences)
7.  [Gestion des Projets](#7-gestion-des-projets)
8.  [Boîte de Réception (Contacts)](#8-boîte-de-réception-contacts)

---

### 1. Accès à l'Espace Administrateur

Pour commencer à modifier votre CV, vous devez vous connecter à votre tableau de bord.

-   **URL de connexion** : Rendez-vous sur `[votre-domaine]/admin/login`.
-   **Identifiants** : Utilisez l'adresse e-mail et le mot de passe que vous avez créés dans la console Firebase (service *Authentication*) lors de l'installation.

Une fois connecté, vous serez redirigé vers le tableau de bord principal.

### 2. Tableau de Bord

La page d'accueil de l'espace admin vous donne un aperçu rapide des statistiques de votre CV :
-   **Vues du CV** : Nombre total de fois où votre CV public a été chargé.
-   **Leads / Contacts** : Nombre total de messages reçus via le formulaire de contact.
-   **Téléchargements du CV** : Nombre de fois où le bouton "Télécharger le CV" a été cliqué.

*Note : Les statistiques de vues et de téléchargements ne sont pas incrémentées lorsque vous visitez le site en environnement de développement local (`npm run dev`).*

### 3. Gestion du Profil

Cette section vous permet de modifier les informations générales qui apparaissent en haut de votre CV.

-   **Avatar** : Vous pouvez coller une URL d'image ou utiliser le bouton **"Uploader"** pour téléverser une photo depuis votre ordinateur. L'image est automatiquement sauvegardée sur Firebase Storage.
-   **Champs Bilingues (Français / Anglais)** :
    -   Utilisez les onglets "Français" et "Anglais" pour saisir votre nom, titre et résumé dans les deux langues.
    -   Le site public affichera la version correspondante à la langue sélectionnée par le visiteur.
-   **Informations de Contact et Réseaux Sociaux** : Remplissez les champs pour votre e-mail, téléphone, localisation et liens vers GitHub, LinkedIn, etc. Laissez un champ vide s'il ne s'applique pas.

N'oubliez pas de cliquer sur **"Sauvegarder les changements"** après chaque modification.

### 4. Gestion des Expériences

Ici, vous pouvez lister vos expériences professionnelles.

-   **Ajouter une expérience** : Cliquez sur le bouton "Ajouter une expérience".
-   **Modifier une expérience** : Cliquez sur le titre d'une expérience existante pour ouvrir l'accordéon et voir les champs.
-   **Champs Bilingues** : Comme pour le profil, utilisez le bouton **FR/EN** en haut à droite pour basculer et remplir le nom du poste et la description dans les deux langues.
-   **Technologies** : Saisissez le nom d'une technologie et appuyez sur **Entrée** ou cliquez sur **"Ajouter"** pour l'associer à l'expérience.
-   **Réorganiser** : Maintenez le clic sur l'icône avec les six points (`⋮⋮`) et glissez-déposez l'expérience pour changer son ordre d'apparition sur le CV.
-   **Supprimer** : Cliquez sur l'icône poubelle pour supprimer une expérience.

Cliquez sur **"Sauvegarder les expériences"** pour enregistrer toutes les modifications.

### 5. Gestion des Formations

Cette section fonctionne de manière très similaire à celle des expériences. Vous pouvez y ajouter, modifier, réorganiser et supprimer vos diplômes et formations.

### 6. Gestion des Compétences

Organisez vos compétences par catégories (ex: "Langages de programmation", "Outils", "Langues").

-   **Ajouter une catégorie** : Cliquez sur "Ajouter une catégorie".
-   **Ajouter une compétence dans une catégorie** :
    1.  Ouvrez l'accordéon de la catégorie souhaitée.
    2.  Dans le champ "Nouvelle compétence...", tapez le nom de la compétence (ex: "React").
    3.  Cliquez sur "Ajouter".
    4.  Ajustez le niveau de maîtrise (en pourcentage) à l'aide du curseur.
-   **Réorganiser et supprimer** : La gestion des catégories se fait par glisser-déposer et avec l'icône poubelle, comme pour les expériences.

Cliquez sur **"Sauvegarder les compétences"** pour enregistrer.

### 7. Gestion des Projets

Mettez en avant vos réalisations personnelles ou professionnelles.

-   **Gestion similaire** : L'ajout, la modification, la réorganisation et la suppression de projets suivent la même logique que pour les expériences et les formations.
-   **Image du projet** : Uploadez une image représentative pour chaque projet. Une image par défaut sera utilisée si aucune n'est fournie.
-   **Liens** : Ajoutez des liens vers la démo en ligne et/ou le dépôt GitHub du projet. Les boutons correspondants n'apparaîtront sur le CV que si les liens sont renseignés.

### 8. Boîte de Réception (Contacts)

Cette page affiche tous les messages qui vous ont été envoyés via le formulaire de contact de votre CV public. Les messages sont affichés par ordre chronologique, du plus récent au plus ancien.

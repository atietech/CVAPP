
# CVMaster - Votre CV en Ligne, Élégant et Multilingue

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

CVMaster est une application web open-source construite avec **Next.js** et **Firebase** qui vous permet de créer, gérer et présenter un CV en ligne professionnel et interactif. Conçu pour être facilement personnalisable et déployable.

 <!-- Vous pouvez ajouter une capture d'écran ici -->

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Installation et Configuration](#installation-et-configuration)
  - [1. Cloner le projet](#1-cloner-le-projet)
  - [2. Installer les dépendances](#2-installer-les-dépendances)
  - [3. Configurer Firebase](#3-configurer-firebase)
  - [4. Lancer l'application](#4-lancer-lapplication)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Fonctionnalités

-   **CV Multilingue (FR/EN)** : Gérez facilement le contenu de votre CV en deux langues.
-   **Espace Administrateur Sécurisé** : Un tableau de bord complet pour mettre à jour toutes les sections de votre CV (profil, expériences, formations, etc.).
-   **Mise à jour en Temps Réel** : Les modifications sont sauvegardées sur Firestore et visibles instantanément.
-   **Génération de PDF** : Permettez aux recruteurs de télécharger une version PDF propre de votre CV, générée à la volée.
-   **Suivi des Statistiques** : Visualisez le nombre de vues, de téléchargements et de contacts directement depuis votre tableau de bord.
-   **Design Moderne et Responsive** : Construit avec **shadcn/ui** et **Tailwind CSS** pour une expérience utilisateur impeccable sur tous les appareils.

## Stack Technique

-   **Framework** : [Next.js](https://nextjs.org/) (App Router)
-   **Base de Données** : [Firebase Firestore](https://firebase.google.com/products/firestore) (pour les données du CV et les contacts)
-   **Authentification** : [Firebase Authentication](https://firebase.google.com/products/auth) (pour l'espace admin)
-   **Stockage** : [Firebase Storage](https://firebase.google.com/products/storage) (pour l'avatar et les images des projets)
-   **UI** : [shadcn/ui](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
-   **Génération PDF** : [jsPDF](https://github.com/parallax/jsPDF)
-   **Animations** : [Framer Motion](https://www.framer.com/motion/)

---

## Installation et Configuration

Suivez ces étapes pour lancer le projet sur votre machine locale.

### 1. Cloner le projet

```bash
git clone https://github.com/boom-digital/CVAPP.git
cd CVAPP
```

### 2. Installer les dépendances

Installez tous les packages nécessaires avec `npm` :

```bash
npm install
```

### 3. Configurer Firebase

C'est l'étape la plus importante. Vous devez connecter l'application à votre propre projet Firebase.

**a. Créer un projet Firebase**

-   Allez sur la [console Firebase](https://console.firebase.google.com/).
-   Cliquez sur **"Ajouter un projet"** et suivez les instructions.

**b. Activer les services requis**

Dans votre nouveau projet Firebase, activez les trois services suivants :

1.  **Authentication** :
    -   Allez dans l'onglet `Authentication`, cliquez sur "Commencer".
    -   Activez le fournisseur **"E-mail/Mot de passe"**.
    -   Créez un utilisateur dans l'onglet "Utilisateurs" pour pouvoir vous connecter à l'espace admin.

2.  **Firestore Database** :
    -   Allez dans l'onglet `Firestore Database`, cliquez sur "Créer une base de données".
    -   Démarrez en **mode production** et choisissez votre région.

3.  **Storage** :
    -   Allez dans l'onglet `Storage`, cliquez sur "Commencer" et suivez les instructions.

**c. Obtenir la configuration de votre application web**

-   Dans les paramètres de votre projet (`Project Settings` ⚙️), trouvez la section "Vos applications" (`Your apps`).
-   Cliquez sur l'icône Web `</>` pour enregistrer une nouvelle application web.
-   Donnez-lui un nom (ex: "Mon CV") et copiez l'objet `firebaseConfig` qui vous sera fourni.

**d. Créer le fichier d'environnement**

À la racine de votre projet, **copiez le fichier `.env.local.template`** et renommez la copie en `.env.local`.

```bash
cp .env.local.template .env.local
```

Ouvrez ce nouveau fichier `.env.local` et collez-y les clés de votre objet `firebaseConfig` comme ceci :

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

Le fichier `src/lib/firebase.ts` est déjà configuré pour lire ces variables. Vous n'avez plus rien à modifier dans le code !

### 4. Lancer l'application

Une fois la configuration terminée, lancez le serveur de développement :

```bash
npm run dev
```

-   Votre CV public est visible sur [http://localhost:9002](http://localhost:9002).
-   L'espace administrateur est sur [http://localhost:9002/admin/login](http://localhost:9002/admin/login). Utilisez l'email et le mot de passe que vous avez créés à l'étape 3.b.

---

## Déploiement

Vous pouvez déployer cette application sur n'importe quelle plateforme supportant Next.js.

### Déploiement sur Vercel (Recommandé)

1.  Poussez votre projet sur un dépôt GitHub.
2.  Créez un compte sur [Vercel](https://vercel.com/) et connectez votre compte GitHub.
3.  Importez votre projet depuis GitHub.
4.  Dans les paramètres du projet Vercel, ajoutez les variables d'environnement de votre fichier `.env.local`.
5.  Cliquez sur "Deploy". Vercel s'occupera de tout !

---

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet, n'hésitez pas à ouvrir une Pull Request ou une Issue.

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

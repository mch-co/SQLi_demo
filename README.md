# SQLi Demo Project

Ce projet est une application de démonstration pour illustrer les vulnérabilités d'injection SQL (SQLi) et les bonnes pratiques pour les éviter. Il est construit avec Next.js, Prisma et MySQL.

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- MySQL Server
- npm ou yarn

## Installation

1.  **Cloner le dépôt :**

    ```bash
    git clone <votre-url-de-repo>
    cd SQLI_DEMO
    ```

2.  **Installer les dépendances :**

    ```bash
    npm install
    ```

## Configuration

1.  Créez un fichier `.env` à la racine du projet.
2.  Ajoutez les variables d'environnement suivantes (ajustez selon votre configuration MySQL) :

    ```env
    # Configuration pour la connexion directe (utilisée pour les démos vulnérables)
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=root
    DB_NAME=sqli_demo
    DB_PORT=3306

    # Configuration pour Prisma
    DATABASE_URL="mysql://root:root@localhost:3306/sqli_demo"
    ```

    _Note : Assurez-vous que les identifiants correspondent à votre installation MySQL locale._

## Base de données

Vous avez deux options pour initialiser la base de données :

### Option 1 : Via Prisma (Recommandé)

Cette méthode créera la base de données et les tables, et insérera les données de test via le script de seed.

```bash
# Créer la base de données et appliquer les migrations
npx prisma migrate dev --name init
```

### Option 2 : Manuellement (SQL)

Vous pouvez exécuter le script SQL fourni dans votre client MySQL :

```bash
mysql -u root -p < setup-db.sql
```

## Lancer l'application

Une fois l'installation et la configuration terminées, lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour accéder à l'application.

## Structure du projet

- `app/` : Code source de l'application Next.js (Pages et API).
  - `api/` : Endpoints API, incluant les routes vulnérables (`sqli-*`) et sécurisées.
  - `Bande/`, `Blind/`, `HBand/` : Pages de démonstration des différents types d'injections SQL.
- `lib/db.ts` : Configuration de la connexion base de données (utilisant `mysql2` pour les démos).
- `prisma/` : Schéma et migrations Prisma.
- `setup-db.sql` : Script SQL d'initialisation manuelle.

## Avertissement

⚠️ **ATTENTION** ⚠️

Ce projet contient intentionnellement du code vulnérable aux injections SQL.
**NE PAS DÉPLOYER CE PROJET EN PRODUCTION.**
Il est destiné uniquement à des fins éducatives et de démonstration dans un environnement local et isolé.

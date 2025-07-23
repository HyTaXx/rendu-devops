# Backend API - Version Nettoyée

Une API backend simple utilisant Fastify, prête à accueillir de nouveaux besoins.

## Architecture

### Technologies utilisées
- **Fastify** - Framework web rapide et léger
- **Prisma** - ORM pour la base de données
- **PostgreSQL** - Base de données
- **TypeScript** - Langage typé
- **Zod** - Validation des schémas
- **JWT** - Authentification

### Structure du projet
```
backend/
├── prisma/
│   └── schema.prisma           # Schéma de base de données
├── src/
│   ├── modules/
│   │   └── user/               # Module utilisateur
│   │       ├── user.controller.ts
│   │       ├── user.route.ts
│   │       ├── user.schema.ts
│   │       └── user.service.ts
│   ├── utils/
│   │   └── prisma.ts          # Configuration Prisma
│   └── app.ts                 # Point d'entrée de l'application
├── global.d.ts                # Types globaux
├── package.json
└── tsconfig.json
```

## Fonctionnalités actuelles

### API Utilisateur (`/api/users`)
- `POST /register` - Inscription d'un nouvel utilisateur
- `POST /login` - Connexion utilisateur
- `GET /me` - Profil utilisateur connecté
- `POST /logout` - Déconnexion

### Middleware
- **CORS** - Configuré pour le développement local
- **JWT** - Authentification par token
- **Cookies** - Stockage sécurisé des tokens

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données PostgreSQL

3. Créer un fichier `.env` :
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database"
JWT_SECRET="your-jwt-secret"
COOKIE_SECRET="your-cookie-secret"
NODE_ENV="development"
```

4. Générer le client Prisma :
```bash
npx prisma generate
```

5. Appliquer les migrations :
```bash
npx prisma db push
```

## Développement

```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`

## Scripts disponibles
- `npm run dev` - Développement avec rechargement automatique
- `npm run build` - Construction pour la production
- `npm start` - Démarrage en production
- `npm run lint` - Vérification du code

## Ajout de nouveaux modules

Pour ajouter un nouveau module, créez la structure suivante :
```
src/modules/mon-module/
├── mon-module.controller.ts
├── mon-module.route.ts
├── mon-module.schema.ts
└── mon-module.service.ts
```

N'oubliez pas d'ajouter les routes dans `app.ts` :
```typescript
import monModuleRoutes from './modules/mon-module/mon-module.route';
import { monModuleSchemas } from './modules/mon-module/mon-module.schema';

// Dans la fonction main()
for (const schema of Object.values(monModuleSchemas)) {
  fastify.addSchema(schema);
}

fastify.register(monModuleRoutes, { prefix: '/api/mon-module' });
```

## TODO
- [ ] Ajouter le hachage des mots de passe
- [ ] Améliorer la validation des données
- [ ] Ajouter des tests
- [ ] Configurer les logs
- [ ] Ajouter la gestion d'erreurs globale

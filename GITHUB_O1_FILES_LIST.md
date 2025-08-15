# GitHub O1 Deployment - Bestandenlijst

## Essentiële bestanden voor o1 GitHub repository

### 📁 Root configuratie bestanden
```
package.json
package-lock.json
vercel.json
build-vercel.js
vite.config.production.ts
drizzle.config.ts
tailwind.config.ts
postcss.config.js
tsconfig.json
components.json
README.md
DEPLOYMENT_VERCEL.md
```

### 📁 Code directories (volledige folders)
```
client/
server/
shared/
api/
```

### 📁 Specifieke client bestanden (hele structuur)
```
client/index.html
client/public/
client/src/
client/src/App.tsx
client/src/main.tsx
client/src/index.css
client/src/components/
client/src/pages/
client/src/hooks/
client/src/lib/
```

### 📁 Server bestanden
```
server/index.ts
server/routes.ts
server/storage.ts
server/db.ts
server/cloudinary.ts
server/vite.ts
server/migrate-data.ts
```

### 📁 Shared bestanden
```
shared/schema.ts
```

### 📁 API bestanden (Vercel serverless)
```
api/index.js
api/health.js
```

## ❌ NIET toevoegen aan GitHub
```
node_modules/
dist/
.env
backup/
backup-radko/
attached_assets/
cookies.txt
.replit
```

## 🔧 Voor deployment
1. Kopieer alle bovenstaande bestanden naar je o1 GitHub repository
2. Voeg .gitignore toe met:
   ```
   node_modules/
   dist/
   .env
   ```
3. Push naar GitHub
4. Verbind met Vercel voor automatische deployment

## Environment Variables voor Vercel
```
DATABASE_URL=je_neon_postgresql_url
NODE_ENV=production
SESSION_SECRET=willekeurige_lange_string
```
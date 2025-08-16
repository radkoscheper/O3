# 🚀 QUICK START TEMPLATE - NIEUWE PROJECTEN

*Gebaseerd op Ontdek Polen learning curve - gebruik dit als startpunt voor nieuwe travel sites*

## ⚡ **30-MINUTEN SETUP**

### **Stap 1: Project Initialisatie**
```bash
# Project maken
mkdir nieuwe-travel-site
cd nieuwe-travel-site
npm init -y

# Git setup
git init
echo "node_modules/\n.env\ndist/" > .gitignore
```

### **Stap 2: Core Dependencies (BEWEZEN STACK)**
```bash
# Frontend (React Ecosystem)
npm install react react-dom wouter @tanstack/react-query
npm install @radix-ui/react-slot lucide-react framer-motion

# Backend (Express + Database)
npm install express drizzle-orm @neondatabase/serverless
npm install bcrypt express-session connect-pg-simple

# Styling (Tailwind + shadcn/ui)
npm install tailwindcss @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge

# Development
npm install -D typescript @types/react @types/node @types/express
npm install -D vite @vitejs/plugin-react tsx drizzle-kit
```

### **Stap 3: Essential Configuration Files**

#### **package.json scripts toevoegen:**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "node build.js",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push"
  }
}
```

#### **tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["client/src/*"],
      "@shared/*": ["shared/*"]
    }
  },
  "include": ["client/**/*", "server/**/*", "shared/**/*"]
}
```

## 📁 **DIRECTORY STRUCTUUR (BEWEZEN PATROON)**

```
project/
├── client/
│   ├── src/
│   │   ├── components/ui/        # shadcn/ui components
│   │   ├── pages/               # Route components
│   │   ├── lib/                 # Utilities
│   │   └── App.tsx             # Main app component
│   ├── index.html
│   └── public/
├── server/
│   ├── index.ts                # Express server
│   ├── routes.ts               # API routes
│   └── storage.ts              # Database layer
├── shared/
│   └── schema.ts               # Database schema + types
├── api/                        # Vercel serverless functions
│   └── index.js               # Vercel handler
├── build.js                    # Build script
├── drizzle.config.ts          # Database config
├── tailwind.config.ts         # Styling config
├── vite.config.ts             # Frontend build config
└── vercel.json                # Deployment config
```

## 🗄️ **DATABASE TEMPLATE (NEON POSTGRESQL)**

### **Basic Schema (shared/schema.ts):**
```typescript
import { pgTable, serial, text, timestamp, boolean, json } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Content table (destinations/articles/etc)
export const content = pgTable('content', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content'),
  image: text('image'),
  published: boolean('published').default(false),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Site settings
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: text('site_name').notNull(),
  siteDescription: text('site_description'),
  settings: json('settings'),
});
```

### **Database Connection (server/storage.ts):**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export { db };
```

## 🎨 **STYLING SETUP**

### **tailwind.config.ts:**
```typescript
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fef7ee',
          500: '#f97316',
          900: '#9a3412',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

## 🚀 **DEPLOYMENT TEMPLATE**

### **vercel.json (BEWEZEN CONFIGURATIE):**
```json
{
  "version": 2,
  "buildCommand": "node build.js",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Environment Variables (.env.example):**
```
DATABASE_URL=postgresql://user:pass@host/db
SESSION_SECRET=your-session-secret
NODE_ENV=development
```

## ✅ **IMPLEMENTATION CHECKLIST**

### **Week 1 - Foundation:**
- [ ] Setup project structure
- [ ] Configure database schema
- [ ] Implement basic authentication
- [ ] Create admin panel shell
- [ ] Setup responsive layout

### **Week 2 - Core Features:**
- [ ] Content management system
- [ ] Public pages (homepage, content pages)
- [ ] Search functionality
- [ ] Image upload system
- [ ] SEO meta tags

### **Week 3 - Polish & Deploy:**
- [ ] Performance optimization
- [ ] Error handling
- [ ] Loading states
- [ ] Vercel deployment
- [ ] Domain configuration

### **Week 4 - Enhancement:**
- [ ] Analytics integration
- [ ] Advanced features
- [ ] User feedback implementation
- [ ] Documentation update

## 🔧 **COMMON ISSUES & SOLUTIONS**

### **Database Connection Issues:**
```typescript
// Add to server/index.ts for debugging
console.log('Database URL configured:', !!process.env.DATABASE_URL);
```

### **Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Vercel Deployment Failures:**
1. Check Node.js version in package.json
2. Verify all environment variables
3. Test build locally first

## 📚 **RESOURCES & DOCUMENTATION**

- **Original Project**: Ontdek Polen learning curve
- **Comprehensive Guide**: PROJECT_LEARNING_CURVE_COMPREHENSIVE.md
- **Deployment Strategies**: DEPLOYMENT_VERCEL.md
- **Problem Solutions**: Documented in learning curve file

---

*Deze template is gebaseerd op bewezen oplossingen uit het Ontdek Polen project. Pas aan naar jouw specifieke needs, maar behoud de core structuur voor beste resultaten.*
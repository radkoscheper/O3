# Site & CMS Component Mapping - Ontdek Polen

**Doel:** Complete mapping van alle site-onderdelen en CMS-functionaliteit voor uniforme ontwikkeling en consistentie.

## 📊 DATABASE SCHEMA OVERZICHT

### 🔐 **Users Table (Gebruikersbeheer)**
- **Functionaliteit:** Multi-user authentication met role-based permissions
- **Rollen:** admin (volledig), editor (content), viewer (alleen lezen)
- **Permissies:** `canCreateContent`, `canEditContent`, `canDeleteContent`, `canManageUsers`
- **Soft Delete:** ❌ (Users worden niet soft-deleted)

### 🏔️ **Destinations Table (Bestemmingen)**
- **Core Fields:** name, slug, description, image, alt, content, location
- **Visibility Control:** `published`, `featured`, `showOnHomepage`
- **AI Enhancement:** `aiImage`, `aiProcessed`, `aiSettings` (upscale, aspectRatio, autoTags, generativeFill)
- **Ranking:** Integer voor sorteervolgorde
- **Soft Delete:** ✅ `is_deleted`, `deleted_at`

### 📖 **Guides Table (Reisgidsen)**
- **Identieke Structuur als Destinations:** Zelfde velden en AI-ondersteuning
- **Functionaliteit:** Dezelfde visibility controls en soft delete
- **Verschil:** Focus op reisinhoud vs bestemmingen

### 📄 **Pages Table (Dynamische Pagina's)**
- **Core Fields:** title, slug, content, metaTitle, metaDescription, metaKeywords
- **Template System:** Herbruikbare templates (default, destination-specific)
- **Header Images:** `headerImage`, `headerImageAlt`
- **Highlight Sections:** JSON array voor locatie-specifieke secties
- **SEO:** Volledige meta tag ondersteuning
- **Soft Delete:** ✅

### ⚙️ **Site Settings Table (Globale Instellingen)**
- **Site Identity:** siteName, siteDescription, metaKeywords, favicon
- **Media Management:** backgroundImage, logoImage, socialMediaImage
- **Visibility Controls:** `showDestinations`, `showMotivation`, `showHighlights`, `showOntdekMeer`, `showGuides`
- **Customization:** customCSS, customJS, headerOverlay settings
- **Analytics:** googleAnalyticsId
- **Single Record:** ✅ (één actieve configuratie)

### 🎯 **Activities Table (Activiteiten)**
- **Locatie-Based:** name, location, description, image, content
- **Homepage Controls:** `featured`, `published`, `showOnHomepage`
- **Categorization:** Georganiseerd per locatie/bestemming
- **Soft Delete:** ✅

### ✨ **Highlights Table (Hoogtepunten)**
- **Dynamic Content:** title, description, image, content
- **Flexible Usage:** Voor speciale aanbiedingen, seizoensgebonden content
- **Homepage Integration:** Via site settings visibility

### 🔍 **Search Configs Table (Zoek Configuratie)**
- **Context-Based:** homepage, destination, global scopes
- **Customizable:** Size (small, medium, large), placeholder text
- **Enable/Disable:** Per context schakelbaar

### 💪 **Motivation Table (CTA Sectie)**
- **Homepage Element:** title, description, image, locationName
- **Call-to-Action:** Motiverende content voor bezoekers

## 🎨 FRONTEND COMPONENT STRUCTUUR

### 🏠 **Homepage Components (home.tsx)**

#### **Hero Section**
- **Type:** Full-screen background met overlay
- **Elements:** Grote titel, zoekbalk, CTA buttons
- **Performance:** HeroImageOptimized component
- **AI Enhancement:** Ondersteunt AI upscaling

#### **Search Functionality**
- **Component:** Input met live zoekresultaten
- **Configuration:** Via SearchConfig database
- **Results Display:** Type-specific styling en icons
- **Scopes:** homepage, destination, global, highlights, guides

#### **Destinations Carousel**
- **Component:** TravelSlider met DestinationCard
- **AI Integration:** AIEnhancedImage voor Cloudinary transformaties
- **Visibility:** Controlled via `showDestinations` in site settings
- **Responsive:** 1-4 items per scherm

#### **Guides Section**
- **Structure:** Identiek aan destinations
- **Component:** Hergebruik van TravelSlider
- **Visibility:** `showGuides` toggle

#### **Motivation/CTA Section**
- **Database:** Motivation table
- **Visibility:** `showMotivation` toggle
- **Content:** Dynamic title, description, background image

#### **Activities/Highlights**
- **Source:** Activities table (featured=true)
- **Display:** Card layout met locatie filtering
- **Visibility:** `showHighlights` toggle

#### **Ontdek Meer Section**
- **Purpose:** Additional content discovery
- **Visibility:** `showOntdekMeer` toggle
- **Integration:** Links naar pages/templates

### 📱 **Admin CMS Interface (admin.tsx)**

#### **Authentication System**
- **Login:** Username/password met session management
- **Permissions:** Role-based UI rendering
- **Simple Mode:** Toggle voor basic/advanced view

#### **Content Management Tabs**

##### **Bestemmingen Tab**
- **CRUD Operations:** Create, Read, Update, Delete
- **Image Management:** Upload met automatic renaming
- **AI Processing:** Batch processing interface
- **Homepage Toggle:** Real-time visibility control
- **Soft Delete Recovery:** Recycle bin functionality

##### **Gidsen Tab**
- **Identical Structure:** Zelfde functionaliteit als Bestemmingen
- **Consistent Interface:** Hergebruik van component patterns

##### **Pagina's Tab**
- **Template Selection:** Dropdown met beschikbare templates
- **Meta Management:** SEO fields per pagina
- **Header Images:** Upload en crop functionaliteit
- **Highlight Sections:** JSON editor voor dynamische content

##### **Activiteiten Tab**
- **Location-Based:** Organisatie per bestemming
- **Folder Structure:** Automatic image organization
- **Featured Toggle:** Homepage visibility control

##### **Site Instellingen Tab**
- **Visibility Controls:** Homepage section toggles
- **Media Management:** Favicon, logo, background uploads
- **SEO Settings:** Global meta defaults
- **Custom Code:** CSS/JS injection

#### **Advanced Features**

##### **Database Monitoring**
- **Real-time Status:** Connection monitoring, table statistics
- **Admin Only:** Permission-gated access
- **Auto Refresh:** 30-60 second intervals

##### **User Management**
- **Permission Assignment:** Granular role controls
- **Password Management:** Reset functionality
- **Activity Tracking:** User creation/modification logs

##### **Recycle Bin System**
- **Soft Delete Recovery:** Voor destinations, guides, pages
- **Image Trash:** Orphaned file management
- **Permanent Delete:** Final removal options

## 🔄 CONSISTENT PATTERNS & REUSABLE COMPONENTS

### ✅ **Uniform Implementations (GEBRUIK DEZE)**

#### **Database Pattern**
```typescript
// Consistent schema structure
{
  id: serial("id").primaryKey(),
  title/name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  alt: text("alt").notNull(),
  content: text("content").notNull(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  showOnHomepage: boolean("show_on_homepage").default(true),
  ranking: integer("ranking").default(0),
  // AI Enhancement fields
  aiImage: text("ai_image"),
  aiProcessed: boolean("ai_processed").default(false),
  aiSettings: jsonb("ai_settings"),
  // Timestamps & soft delete
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  is_deleted: boolean("is_deleted").default(false),
  deleted_at: timestamp("deleted_at"),
}
```

#### **API Endpoint Pattern**
```typescript
// Consistent CRUD endpoints
GET    /api/[entity]           // Public homepage data
GET    /api/admin/[entity]     // Admin all data
GET    /api/admin/[entity]/deleted // Soft deleted items
POST   /api/admin/[entity]     // Create new
PATCH  /api/admin/[entity]/:id // Update existing
DELETE /api/admin/[entity]/:id // Soft delete
POST   /api/admin/[entity]/:id/restore // Restore deleted
```

#### **React Query Pattern**
```typescript
// Consistent query structure
const entityQuery = useQuery({
  queryKey: ['/api/admin/[entity]'],
  enabled: isAuthenticated && hasPermission,
});

// Consistent mutation with cache invalidation
const updateMutation = useMutation({
  mutationFn: (data) => apiRequest(`/api/admin/[entity]/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/admin/[entity]'] });
    toast({ title: "Successfully updated" });
  }
});
```

#### **Image Upload Pattern**
```typescript
// Consistent upload met automatic organization
const uploadConfig = {
  destination: entityType, // 'destinations', 'guides', 'activities'
  entityId: item.id,
  entityName: item.name,
  autoRename: true, // location-based naming
  aspectRatio: "4:3", // consistent ratios
};
```

#### **TravelSlider Pattern**
```typescript
// Herbruikbare carousel voor alle content types
<TravelSlider
  visibleItems={{ mobile: 1, tablet: 2, desktop: 4 }}
  showNavigation={items.length > 4}
  className="gap-4"
>
  {items.map(item => (
    <ContentCard key={item.id} item={item} />
  ))}
</TravelSlider>
```

#### **AI Enhancement Pattern**
```typescript
// Consistent AI processing voor alle image types
const aiSettings = {
  upscale: true,
  aspectRatio: "4:3",
  autoTags: ["Polen", "reizen", entityType],
  generativeFill: true
};

// Database updates
UPDATE [table] SET 
  ai_image = cloudinaryUrl,
  ai_processed = true,
  ai_settings = aiSettings
WHERE id = entityId;
```

### ❌ **Inconsistent Patterns (VERMIJD/FIX DEZE)**

#### **Mixed Naming Conventions**
- **Probleem:** Sommige velden gebruiken camelCase, andere snake_case
- **Oplossing:** Gebruik consistent camelCase in TypeScript, snake_case in database

#### **Different Visibility Controls**
- **Probleem:** Verschillende implementaties van show/hide functionaliteit
- **Oplossing:** Gebruik altijd `published`, `featured`, `showOnHomepage` boolean pattern

#### **Inconsistent Image Handling**
- **Probleem:** Verschillende upload paths en naming conventions
- **Oplossing:** Gebruik uploadImageToFolder utility met consistent folder structure

#### **Mixed Component Patterns**
- **Probleem:** Verschillende card designs en layouts
- **Oplossing:** Standardize op Card component met consistent padding/spacing

## 🚀 PERFORMANCE & SEO PATTERNS

### **Optimized Image Loading**
- **Component:** OptimizedImage met lazy loading
- **AI Enhancement:** AIEnhancedImage voor Cloudinary
- **Responsive:** srcSet voor verschillende schermgroottes
- **Preloading:** Critical above-fold images

### **SEO Implementation**
- **Triple Layer:** Static HTML + Dynamic API + Client-side updates
- **Structured Data:** JSON-LD voor Google Rich Results
- **Open Graph:** Social media optimization
- **Meta Management:** Per-page customization

### **Analytics Integration**
- **Google Analytics 4:** Event tracking voor travel interactions
- **Performance Monitoring:** Core Web Vitals tracking
- **Custom Events:** Search, destination views, guide interactions

## 📋 DEVELOPMENT GUIDELINES

### **Nieuwe Features Toevoegen**
1. **Database Schema:** Volg consistent pattern uit destinations/guides
2. **API Endpoints:** Implement volledige CRUD met soft delete
3. **Admin Interface:** Hergebruik bestaande tab/form patterns
4. **Frontend Display:** Gebruik TravelSlider voor carousel content
5. **Image Management:** Implement upload met AI enhancement support

### **Existing Features Updaten**
1. **Check Consistency:** Vergelijk met established patterns
2. **Database Migrations:** Gebruik `npm run db:push`
3. **Cache Invalidation:** Update alle relevante queryKeys
4. **UI Consistency:** Gebruik bestaande Card/Button/Form components

### **Quality Assurance**
1. **Permission Checks:** Test met verschillende user roles
2. **Responsive Design:** Verify op mobile/tablet/desktop
3. **Performance:** Check image loading en Core Web Vitals
4. **SEO Validation:** Test meta tags en structured data

---

**Laatste Update:** Augustus 2025 - Phase 4 AI Pre-Processing Implementation
**Documentatie Eigenaar:** Ontdek Polen Development Team
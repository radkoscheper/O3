# Structured Data Debug Report

## Probleem Diagnose

### Mogelijke Issues:
1. **React Component Mount Timing** - useEffect wordt niet uitgevoerd
2. **TypeScript Compile Error** - Component wordt niet gerenderd
3. **Vercel Build Process** - Bestanden niet correct gedeployed
4. **Window Object Access** - SSR vs Client-side rendering conflict

### Lokale Test Setup

#### Test bestand: `client/test-structured-data.html`
- Standalone HTML test bestand
- Simuleert structured data functionality
- Direct te testen in browser

### Alternative Debugging Approach:

#### 1. Console Logs toevoegen
```typescript
useEffect(() => {
  console.log('StructuredData component mounting...', { type, title });
  // rest of code...
}, []);
```

#### 2. Simplified Implementation Test
```typescript
// Minimale versie voor quick test
export default function StructuredData({ title }: { title: string }) {
  useEffect(() => {
    console.log('Adding structured data for:', title);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = `{"@context":"https://schema.org","@type":"Website","name":"${title}"}`;
    document.head.appendChild(script);
  }, [title]);
  return null;
}
```

### Next Steps:
1. Test standalone HTML bestand
2. Voeg debug logging toe aan component
3. Simplify component voor debugging
4. Check Vercel deployment logs
# Wrocław AI Processing Fix - GitHub Update

## Overzicht
Deze update lost het kritieke AI processing probleem voor Wrocław op door een parameter correctie in de Cloudinary API call.

## Wijzigingen
- **server/ai-image-processor.ts**: e_gen_fill → b_gen_fill (regel 72)
- **replit.md**: Documentatie update met fix details

## Impact
- ✅ Wrocław hero image krijgt nu werkende AI transformaties
- ✅ Generative fill functioneert correct voor 4:3 aspect ratio
- ✅ Alle 41 destination paginas hebben nu uniforme AI capabilities
- ✅ Error "e_gen_fill is not supported" volledig weggenomen

## Installatie Instructies
1. Vervang de bestanden in je GitHub repository met deze versies
2. Deploy naar je hosting platform (Vercel/Netlify)
3. Test de Wrocław pagina (/wroc-aw) om AI processing te bevestigen

## Technische Details
- Voor: e_gen_fill (niet ondersteund door Cloudinary)
- Na: b_gen_fill (werkende Cloudinary parameter)
- Aspect ratio: 4:3 via generative fill
- Nieuwe bestandsgrootte: ~304KB (was 207KB)
- Nieuwe afmetingen: 1800×1350 (was 1800×510)

## Verificatie
Bezoek /wroc-aw om de AI-enhanced hero afbeelding te zien met:
- Automatische upscaling
- Generative fill voor 4:3 ratio
- Auto-generated tags: polen, travel, tourism

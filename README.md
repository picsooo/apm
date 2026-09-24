# APM — Africaine Paper Mills · Deux maquettes de site web

Deux propositions de refonte pour **SARL Africaine Paper Mills** (Rouïba, Alger),
construites à partir du contenu réel du site [apm.dz](https://apm.dz) — textes, photos
d'usine, visuels produits, logo, chiffres clés et coordonnées.

Site 100 % statique : HTML, CSS et JavaScript vanilla. Aucune dépendance, aucun build.

---

## Les deux propositions

| | Proposition | URL | Ton |
|---|---|---|---|
| **1** | **Corporate Pro** | `/` (racine) | Institutionnel, rassurant, dense en information. Bleu nuit + vert de marque, typographie Archivo / Inter. Pensé pour les acheteurs, les transformateurs et les donneurs d'ordre. |
| **2** | **Modern** | `/moderne/` | Éditorial sombre, animé, « effet whaou ». Noir + vert électrique, typographie Space Grotesk / Instrument Serif. Pensé pour l'image de marque, les salons et l'export. |

Les deux versions partagent le même contenu et les mêmes médias — seule la direction
artistique change. Chaque page contient un lien croisé vers l'autre proposition, en bas
de page, pour passer de l'une à l'autre pendant la présentation.

---

## Arborescence

```
apm-website/
├── index.html                      ← V1 · Accueil
├── produits.html                   ← V1 · Catalogue des 8 grades (filtres + comparatif + FAQ)
├── produit-papier-toilette.html    ← V1 · FICHE TECHNIQUE PRODUIT (page modèle)
├── entreprise.html                 ← V1 · Vision, mission, qualité, objectifs, galerie
├── procede.html                    ← V1 · Le procédé industriel ANDRITZ, 6 étapes
├── durabilite.html                 ← V1 · Les 9 engagements de développement durable
├── actualites.html                 ← V1 · Article complet (démarrage ANDRITZ)
├── carrieres.html                  ← V1 · Carrières + formulaire de candidature
├── contact.html                    ← V1 · Coordonnées, carte, formulaire
├── devis.html                      ← V1 · DEMANDE DE DEVIS en 4 étapes (page modèle)
│
├── moderne/
│   ├── index.html                  ← V2 · Accueil (scroller horizontal, bento, timeline)
│   ├── produits.html               ← V2 · Catalogue
│   ├── produit.html                ← V2 · Fiche technique
│   ├── entreprise.html             ← V2 · Entreprise + procédé + galerie + durabilité
│   └── contact.html                ← V2 · Contact & devis
│
├── assets/
│   ├── css/corporate.css           ← Design system V1
│   ├── css/moderne.css              ← Design system V2
│   ├── js/corporate.js             ← Compteurs, accordéons, filtres, wizard, menu
│   ├── js/moderne.js                ← Loader, curseur, scroller horizontal, reveals
│   └── img/
│       ├── brand/                  ← Logo (clair + variante fond sombre) et favicon
│       ├── plant/                  ← Photos d'usine issues de apm.dz
│       └── products/               ← Visuels produits normalisés en 4:3
│
├── vercel.json
└── README.md
```

---

## Les pages « modèles » à montrer en réunion

Ce sont les pages qui n'existent pas aujourd'hui sur apm.dz et qui apportent
le plus de valeur commerciale :

1. **Fiche technique produit** — `produit-papier-toilette.html` (et `moderne/produit.html`)
   Tableau de caractéristiques complet (composition, grammage, humidité, bulk, résistances
   SM/ST, absorption), profil de performance en jauges, format de la bobine mère
   (laize, diamètre, mandrin, poids, sens d'enroulement), conditionnement et logistique
   (emballage, étiquetage, incoterms, délais), applications de transformation.

2. **Demande de devis en 4 étapes** — `devis.html`
   Un formulaire qui qualifie la demande à la place du service commercial : société et pays,
   grades souhaités, spécifications de bobine (laize, diamètre, mandrin, sens d'enroulement),
   volumes, incoterm et échéance. La demande arrive structurée, pas en texte libre.

3. **Procédé industriel** — `procede.html`
   Les six étapes de la ligne ANDRITZ, avec les équipements nommés (FibreSolve FSV,
   TwinFlo, ModuScreen HBE, PrimeLineCOMPACT, PrimePress XT Evo, PrimeDry 16 ft).
   C'est l'argument technique qui différencie APM de ses concurrents régionaux.

4. **Catalogue filtrable** — `produits.html`
   Les 8 grades filtrables par marché, plus un tableau de correspondance des grammages.

---

## Lire les maquettes en réunion

### Marqueurs de statut dans les menus

Chaque entrée de menu porte une pastille qui indique son état :

| Pastille | Signification |
|---|---|
| 🟢 vert | **Page maquettée** — la page existe, elle est cliquable et présentable |
| 🟠 orange | **En attente de validation du devis** — la page est prévue au plan de site mais pas encore réalisée ; l'entrée est grisée et non cliquable |

Au survol d'une entrée, une bulle rappelle le statut. Une légende figure en bas
de chaque page et dans le menu mobile.

- **Corporate** : les 7 entrées du menu sont maquettées, plus Carrières, Devis et la fiche technique produit — soit 10 pages.
- **Moderne** : Accueil, Produits, Fiche technique, Entreprise et Contact sont maquettées ; Procédé, Durabilité, Actualités et Carrières sont marquées en attente.

### Bascule entre les deux propositions

Un bouton animé (dégradé, reflet mobile, pulsation, flèche) permet de passer
d'une version à l'autre pendant la démonstration :

- Version **Corporate** → bouton **« Voir la version Moderne »** dans la barre supérieure, dans le menu mobile et en pied de page.
- Version **Moderne** → bouton **« Version Corporate »** dans la barre de navigation flottante et en pied de page.

L'animation est désactivée si le visiteur a activé « réduire les animations » dans son système.

---

## Mise en ligne

### GitHub

```bash
cd apm-website
git init
git add .
git commit -m "APM — deux maquettes de site web"
git branch -M main
git remote add origin https://github.com/picsooo/apm.git
git push -u origin main
```

### Vercel

1. [vercel.com/new](https://vercel.com/new) → importer le dépôt.
2. **Framework Preset : Other.** Laisser Build Command et Output Directory vides —
   le site est statique, il n'y a rien à compiler.
3. Déployer.

Les deux propositions seront alors accessibles :

- Corporate Pro → `https://<projet>.vercel.app/`
- Modern → `https://<projet>.vercel.app/moderne/`

### Aperçu en local

```bash
cd apm-website
python -m http.server 8000
```
Puis ouvrir `http://localhost:8000`.

---

## Points à valider avec APM avant mise en production

Le contenu rédactionnel, les photos, le logo, les chiffres (2019, 210 collaborateurs,
50 000 m², 35 000 t/an), les certifications et les coordonnées proviennent tous du
site officiel apm.dz. Trois points demandent en revanche une validation :

- **Les valeurs des fiches techniques** (grammages détaillés, humidité, bulk, résistances,
  blancheur, crêpage, formats de bobine, poids, incoterms, délais) sont des **valeurs
  indicatives de maquette**, cohérentes avec le secteur et avec les informations publiques
  d'APM (13,5 à 40 g/m², laize 2 850 mm, 100 % pâte vierge). Elles doivent être remplacées
  par les données réelles du service Qualité. Une mention le rappelle sous chaque tableau.
- **Les formulaires** (contact, devis, candidature) sont fonctionnels côté interface mais
  n'envoient rien : ils affichent un message de confirmation de démonstration. Le
  branchement sur une boîte e-mail ou un CRM se fait à la mise en production.
- **Les langues.** Les maquettes sont en français. Le site actuel étant en anglais et la
  clientèle visée couvrant tout le MENA, une déclinaison FR / EN / AR est recommandée —
  le sélecteur est déjà présent dans l'interface de la version Corporate.

---

## Notes techniques

- Aucune dépendance npm, aucun framework, aucun build.
- Polices chargées depuis Google Fonts.
- Carte : iframe OpenStreetMap (aucune clé API requise).
- Images optimisées et progressives, `loading="lazy"` hors premier écran.
- Responsive de 360 px à 1 920 px ; navigation mobile dédiée sur les deux versions.
- `prefers-reduced-motion` respecté : toutes les animations sont neutralisées.
- Poids total des médias : environ 2 Mo.

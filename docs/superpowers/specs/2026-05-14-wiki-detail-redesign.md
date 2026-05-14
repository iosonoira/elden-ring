# Wiki Detail Page Redesign

**Date:** 2026-05-14  
**Status:** Approved

## Goal

Redesign the wiki item detail page (`app/pages/wiki/[category]/[id].vue`) to:
1. Display all available API fields per category (currently only shows description, location, quote, weight)
2. Make the image larger and more visually prominent
3. Structure data into category-specific sections with progress bars for numeric stats

## Layout

```
┌─────────────────────────────────┐
│  HEADER (nome + categoria)      │  bg: $color-surface-low, padding esteso
├─────────────────────────────────┤
│  [Immagine centrata ~500px]     │  glow gold, aspect-ratio 1:1
│  [Lore text italic sotto]       │  $font-lora, italic
├─────────────────────────────────┤
│  SEZIONI SPECIFICHE PER TIPO    │  v-if per ogni sezione
└─────────────────────────────────┘
```

### Image treatment

- `max-width: 500px`, centrata con `margin: 0 auto`
- `aspect-ratio: 1`, `object-fit: contain`
- `filter: drop-shadow(0 0 30px rgba($color-primary, 0.3))`
- Radial gradient background scuro dietro l'immagine
- Lore text (`description`) direttamente sotto in `$font-lora` italic

## New Components

All in `app/components/wiki/`, auto-imported.

### `WikiStatBar.vue`
Props: `{ name: string, amount: number, max: number }`  
Single progress bar: label left, gold bar center, numeric value right.  
Bar fill: `Math.min((amount / max) * 100, 100)%`

### `WikiChip.vue`
Props: `{ label: string, value: string | number }`  
Compact inline label + value pair. Used for weight, fpCost, affinity, slots, etc.

### `WikiDropList.vue`
Props: `{ drops: string[] }`  
List of drop names with icon prefix. Used for bosses and creatures.

### `WikiScalingBadge.vue`
Props: `{ name: string, scaling: string }`  
Badge showing scaling tier letter (S/A/B/C/D/E) with tier-based color.  
Colors: S=gold, A=orange, B=yellow, C=green, D=grey, E=dark grey.

## TypeScript — Extended `WikiEntity`

Add to `app/shared/types/EldenRingApi.ts`:

```ts
// Already typed — verify present:
attack?: Array<{ name: string; amount: number }>
defence?: Array<{ name: string; amount: number }>
scalesWith?: Array<{ name: string; scaling: string }>

// New fields:
drops?: string[]
region?: string
healthPoints?: string
requiredAttributes?: Array<{ name: string; amount: number }>
dmgNegation?: Array<{ name: string; amount: number }>
resistance?: Array<{ name: string; amount: number }>
cost?: number
slots?: number
effects?: string
effect?: string
requires?: Array<{ name: string; amount: number }>
fpCost?: string
hpCost?: string
affinity?: string
skill?: string
role?: string
type?: string
```

## Category-Specific Sections

Each section uses `v-if` — renders only when data exists. Section header: `$font-label`, uppercase, `$color-primary`, letter-spacing 0.5em.

### Universal (all categories)
| Field | Display |
|---|---|
| `location` | `WikiChip` |
| `quote` | Italic quote block |
| `weight` | `WikiChip` |

### Bosses (`bosses`)
| Field | Display |
|---|---|
| `healthPoints` | `WikiChip` |
| `region` | `WikiChip` |
| `drops[]` | `WikiDropList` |

### Weapons & Shields (`armament`, `shields`, `ammunition`)
| Field | Display |
|---|---|
| `attack[]` | `WikiStatBar` list, max=300 |
| `defence[]` | `WikiStatBar` list, max=100 |
| `scalesWith[]` | `WikiScalingBadge` per entry |
| `requiredAttributes[]` | `WikiChip` per entry |
| `category` | `WikiChip` |

### Armor (`armor`)
| Field | Display |
|---|---|
| `dmgNegation[]` | `WikiStatBar` list, max=100 |
| `resistance[]` | `WikiStatBar` list, max=100 |
| `category` | `WikiChip` |

### Sorceries & Incantations (`magic`, `sorceries`, `incantations`)
| Field | Display |
|---|---|
| `cost` | `WikiChip` (label: "FP Cost") |
| `slots` | `WikiChip` |
| `effects` | Plain text block |
| `requires[]` | `WikiChip` per entry |
| `type` | `WikiChip` |

### Spirit Ashes & Spirits (`spiritAshes`, `spirits`)
| Field | Display |
|---|---|
| `fpCost` | `WikiChip` (label: "FP Cost") |
| `hpCost` | `WikiChip` (label: "HP Cost") |
| `effect` | Plain text block |

### Talismans (`talisman`, `talismans`)
| Field | Display |
|---|---|
| `effect` | Plain text block |

### Ashes of War (`ashesOfWar`, `ashes`)
| Field | Display |
|---|---|
| `affinity` | `WikiChip` |
| `skill` | `WikiChip` |

### NPCs (`npcs`)
| Field | Display |
|---|---|
| `role` | `WikiChip` |

### Locations (`locations`)
No extra fields beyond universal.

### Classes (`classes`)
No extra fields beyond universal (API only returns base stats not typed in WikiEntity).

### Creatures (`creatures`)
| Field | Display |
|---|---|
| `drops[]` | `WikiDropList` |
| `location` | `WikiChip` (universal) |

## Progress Bar Max Values

```ts
const STAT_MAX = {
  attack: 300,
  defence: 100,
  dmgNegation: 100,
  resistance: 100,
}
```

Values clamped: `Math.min(amount / max * 100, 100)`. Exact numeric value always shown.

## SCSS

All new styles added to existing `app/assets/scss/pages/_wiki-detail.scss`. No new SCSS files.  
New BEM blocks: `.wiki-stat-bar`, `.wiki-chip`, `.wiki-drop-list`, `.wiki-scaling-badge`.

## i18n

Add keys to `locales/en.json` and `locales/it.json`:
- Section labels: `wiki.label.stats`, `wiki.label.defence`, `wiki.label.scaling`, `wiki.label.requirements`, `wiki.label.drops`, `wiki.label.effect`, `wiki.label.affinity`, `wiki.label.skill`, `wiki.label.fpCost`, `wiki.label.hpCost`, `wiki.label.healthPoints`, `wiki.label.region`, `wiki.label.role`, `wiki.label.slots`, `wiki.label.type`, `wiki.label.dmgNegation`, `wiki.label.resistance`

## Files Changed

| File | Action |
|---|---|
| `app/shared/types/EldenRingApi.ts` | Extend `WikiEntity` with new fields |
| `app/pages/wiki/[category]/[id].vue` | Full redesign — new layout, image treatment, section rendering |
| `app/assets/scss/pages/_wiki-detail.scss` | Add styles for image hero, stat bars, chips, sections |
| `app/components/wiki/WikiStatBar.vue` | New component |
| `app/components/wiki/WikiChip.vue` | New component |
| `app/components/wiki/WikiDropList.vue` | New component |
| `app/components/wiki/WikiScalingBadge.vue` | New component |
| `locales/en.json` | Add wiki label keys |
| `locales/it.json` | Add wiki label keys |

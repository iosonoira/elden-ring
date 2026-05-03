# Gilded Reliquary Design System

### 1. Overview & Creative North Star

**Creative North Star: The Sovereign Archive**

Gilded Reliquary is a high-end editorial design system inspired by dark fantasy aesthetics and classical manuscripts. It rejects the clinical flatness of modern SaaS in favor of "Sacred Information Design"—where data is treated as a collection of artifacts. The system uses intentional asymmetry, deep tonal layering, and "Grace-touched" highlights to guide the user through complex information. It is designed to feel heavy, ancient, and prestigious, utilizing wide tracking and serif typography to establish a rhythm of quiet authority.

### 2. Colors

The palette is built on a foundation of obsidian and stone, punctuated by "Rune Gold" accents.

- **Primary (Rune Gold):** `#f1c97d` – Used for moments of "Grace" (CTAs, active states, and critical progress indicators).
- **Surface Hierarchy:**
  - **Surface Lowest (`#0e0e10`):** Used for background depth and inset sections.
  - **Surface (`#131315`):** The primary canvas color.
  - **Surface Container Highest (`#353434`):** Used for elevated glass panels.
- **The "No-Line" Rule:** Sectioning is achieved through background color shifts (e.g., transitioning from `surface` to `surface-container-low`) rather than explicit 1px borders.
- **The Glass & Gradient Rule:** Interactive panels utilize `glass-panel` effects (60% opacity with 20px backdrop blur). Use the **Rune Gradient** (`#f1c97d` to `#d4ad65`) for primary actions to simulate metallic depth.

### 3. Typography

The system employs a **penta-font strategy** to balance elegance, fantasy gravitas, and technical precision.

- **Hero Display (Cinzel):** Used exclusively for top-level hero headlines, page titles, and primary CTAs. Its engraved, lapidary quality evokes stone inscriptions and ancient authority.
- **Editorial Headlines (Noto Serif):** Used for section headers, card titles, and key brand moments. It conveys a sense of manuscript history and gravitas. Use `italic` variant for brand-specific terminology.
- **Lore Body (Lora):** An italic-first serif used for descriptive, atmospheric, and lore text — item descriptions, flavor copy, in-world writing. Always in `italic`.
- **UI Body (Manrope):** A clean, modern sans-serif for legible UI descriptions, stat blocks, and long-form data.
- **Labels (Space Grotesk):** A monospaced-adjacent sans-serif for metadata, status tags, technical specs, and all uppercase utility labels.

**Typographic Scale (Ground Truth):**

- **Hero Headline (Cinzel):** 3.75rem (60px) – Extreme scale for editorial impact. Uppercase.
- **Section Header (Noto Serif):** 2.25rem (36px). Italic for lore contexts.
- **Sub-header (Noto Serif):** 1.5rem (24px).
- **Lore Text (Lora italic):** 1rem–1.125rem – Reserved for in-world flavor copy and item descriptions.
- **Standard Body (Manrope):** 0.875rem (14px).
- **Utility Label (Space Grotesk):** 10px (0.625rem) – Uppercase with 0.5em letter spacing.

### 4. Elevation & Depth

Elevation is communicated through light and transparency rather than literal shadow casting.

- **The Layering Principle:** Depth is created by "stacking" semi-transparent glass layers. A nested element should be visually "closer" to the light source by increasing its opacity or surface tier.
- **Ambient Shadows (Gold Glow):** Use `0 0 20px rgba(241, 201, 125, 0.15)` for active elements or "Holy" artifacts. This "glow" replaces traditional drop shadows to create an emanation effect.
- **Glassmorphism:** High-priority cards use `backdrop-filter: blur(20px)` combined with a subtle 10% opacity primary border (`rgba(241, 201, 125, 0.1)`) to define boundaries within the dark void.

### 5. Components

- **Buttons:** Primary buttons are sharp-edged (`rounded-sm`), using the Rune Gradient. Secondary buttons use a hollow "Ghost" style with an amber-900/20 tint and 30% primary border.
- **Accordions:** Designed as "Reliquary Slots." When collapsed, they show a subtle progress bar (1px height) using the Rune Gradient.
- **Status Chips:** Use Space Grotesk at 10px. "Missing" states use a sharp `error` red, while "Owned" states use `primary` gold.
- **Progress Bars:** Ultra-thin (4px) with a glowing leading edge to signify momentum.

### 6. Do's and Don'ts

**Do:**

- Use **Cinzel** for hero-level page titles and primary CTAs — never for body or metadata.
- Use `italic` **Noto Serif** for brand-specific section headers and key editorial moments.
- Use `italic` **Lora** for all in-world lore, item descriptions, and atmospheric flavor text.
- Use **Manrope** for all UI-facing body copy and stats.
- Maintain generous whitespace (`spacing: 3`) to allow elements to "breathe" like artifacts in a museum.
- Use uppercase labels for all metadata to create a "technical blueprint" feel.

**Don't:**

- **No Rounded Corners:** Avoid pill-shaped buttons or high-radius cards. Keep `roundedness` at 1 (max 2-4px) to preserve a sharp, architectural feel.
- **No Flat Grays:** Every neutral should have a slight warmth or "stone" undertone to avoid a "generic dark mode" look.
- **No Standard Grids:** Break the horizontal flow with asymmetrical headers or overlapping image elements.

### 7. Architectural Integrity & Separation of Concerns

**1. SCSS Architecture (7-1 Pattern):**
- The project strictly adheres to the SASS 7-1 pattern (https://sass-guidelin.es/#architecture).
- **NEVER** write `<style>` or `<style scoped>` directly inside Vue components or pages.
- All styles must be written in separate files inside `app/assets/scss/` (e.g., `components/`, `pages/`) and imported globally in `main.scss` or explicitly injected via build tools. Component/page files must remain devoid of embedded stylistic logic.

**2. Data Flow & API Integrity (Nuxt 4 Directory Structure):**
- We strictly follow the **Nuxt 4 Directory Structure** (https://nuxt.com/docs/4.x/directory-structure/): the Vue application lives entirely inside the `app/` directory, while server endpoints live in `server/`, and shared logic in `shared/`.
- **NEVER** perform raw data fetching (e.g., `useFetch`, `$fetch`, `useAsyncData`) directly inside the `<script>` section of a `.vue` component.
- All external API calls, complex state management, and side effects must be sequestered in dedicated composables (e.g., `app/composables/useEldenRingApi.ts`), utilities (`app/utils/`), or Pinia stores.
- A Vue component's script section is reserved *only* for wiring up the view layer — reading from composables, invoking actions, and reacting to computed state.

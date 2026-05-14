# Gilded Reliquary — Elden Ring Save Analyser

> *May Grace Guide Thee.*

A web application that reads your Elden Ring `.sl2` save file locally and shows you exactly what you own — and what you're still missing — across weapons, armour, talismans, magic, ashes of war and spirit ashes.

Built as a personal testbed for **Nuxt** and **AI-assisted development workflows** in 2026.

---

## Features

- **Save file upload** — drag-and-drop or file picker; the `.sl2` is parsed entirely in the browser, no data ever leaves your machine.
- **Multi-character support** — select any character slot from your save file.
- **Inventory cross-reference** — instantly see owned vs. missing items across six categories: Weapons, Armour, Talismans, Magic, Ashes of War, Spirit Ashes.
- **Global completion stats** — overall progress percentage and per-category counters at a glance.
- **DLC coverage** — Shadow of the Erdtree items are fully included in the database.
- **Integrated wiki** — browse 17 in-game categories (bosses, NPCs, locations, creatures, sorceries, incantations and more) powered by the Elden Ring Fan API.
- **Multilingual UI** — English and Italian, switchable at runtime.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) + Vue 3.5 |
| State | Pinia 3 |
| Styling | SCSS (scoped, BEM) |
| Internationalisation | @nuxtjs/i18n |
| Icons | @nuxt/icon (Iconify) |
| Images | @nuxt/image (WebP) |
| Package manager | pnpm |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Build for production
pnpm build

# Static site generation
pnpm generate
```

Open [http://localhost:3000](http://localhost:3000), upload your `.sl2` file and select a character.

---

## AI-First Development

This project was developed with an **AI-first workflow** as an explicit goal — using [Google Antigravity](https://antigravity.dev), [Opencode](https://opencode.ai) and [Claude](https://claude.ai) as primary development partners for code generation, review and architecture decisions.  
It serves as a practical benchmark for what modern AI-assisted frontend development looks like in 2026.

---

## Credits & Acknowledgements

| Who | What |
|---|---|
| [**CyberGiant7 (Leonardo Dessì)**](https://github.com/CyberGiant7) | Original save-file parsing logic and item database. The core engine powering inventory detection is his work, released under the MIT License (© 2022 Leonardo Dessì). |
| [**Elden Ring Fan APIs**](https://docs.eldenring.fanapis.com/docs) | The wiki section is entirely built on this community-maintained public API. Thank you to all contributors who keep it running. |

---

## License

The save-parser core and item database are derived from CyberGiant7's project, which is licensed under the **MIT License**. See [`Elden-Ring-Automatic-Checklist/LICENSE`](./Elden-Ring-Automatic-Checklist/LICENSE) for the full text.

The Gilded Reliquary application layer is also released under the **MIT License**.

---

*Elden Ring is a trademark of Bandai Namco Entertainment and FromSoftware. This project is an unofficial fan tool, not affiliated with or endorsed by either company.*

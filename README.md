# TarikApp

A calm learning app with English and Turkish question banks. Rebuilt from the activity structure of the original TarikApp, with an editable bank and browser-local progress.

## Run

Requires Node.js 20 or newer. No packages or API keys are needed.

```sh
npm run dev
npm test
npm run build
```

Open the local address printed by the server (default: http://127.0.0.1:4173).

## Activities

- Number World / Sayı Dünyası: counting, addition, subtraction, comparing, number sequences, and picture patterns.
- Word Garden / Kelime Bahçesi: picture words, definitions, and opposites.
- Story Time / Hikâye Zamanı: eight short bilingual stories with literal comprehension questions.
- Everyday Adventures / Günlük Maceralar: asking for help, taking breaks, personal boundaries, daily routines, and safe choices.

Each language starts with 741 bank entries. Number questions use bounded templates rather than a remote AI service. Sessions randomize answer order, mix skills, avoid repeats within the session, and prefer questions not recently practiced. A child can listen, get a hint, retry, skip, or take a break. No timers or automatic advancement.

Parent space includes a starting level, optional gentle adaptation, 3/5/10 questions per session, two or three answers, larger text, letter spacing, optional automatic narration, and counting picture themes. Adaptation is off by default; enabled adaptation raises a level after three independent answers at that level and lowers it after two supported or skipped answers at that level. If a level has no available questions, the nearest included level is used.

Question bank supports search, filters, editing, turning individual questions off, adding up to 500 custom questions, and backup import/export. Editing a generated question replaces its generated illustration with the edited text, avoiding mismatched visual hints. Changing an existing built-in question's language or activity creates a custom question and preserves the original.

## Storage and voices

Progress, settings, and custom questions are kept in localStorage on the current browser/device. They are not sent to a server or synchronized. Parent space can export a JSON backup and validate/restore it on another device. Restore replaces the current browser's app data. Practice logs are bounded to 5,000 questions, 300 sessions, and 100 recent question IDs. Existing data from the original Vercel domain is not automatically migrated.

Read-aloud uses the browser's Speech Synthesis API and requests the selected language's voice. Voice availability and pronunciation depend on the device. Turkish narration works best with a Turkish voice installed in the operating system. The app does not record speech or request microphone permission. System-provided speech services may have their own network behavior.

A service worker caches the app for offline access after a successful first visit. Serve over HTTPS or localhost. GitHub Pages uses relative asset URLs and hash routes, so the app works under `/tarikapp/`.

## Publish

The GitHub Actions workflow runs tests, builds `dist/`, and deploys it to GitHub Pages on pushes to `main`. Set the repository's Pages source to GitHub Actions. The same static build can be deployed to Vercel using `vercel.json`.

The current code is a standalone rebuild; publishing to GitHub Pages does not replace the original Vercel deployment.

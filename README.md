# Folio

An experimental, separately installable Android chess-analysis workspace. It opens on the current board. Tap **Folio ⌄** to open Contents.

[Contents](docs/previews/folio-contents-390.png) · [Analysis board](docs/previews/folio-board-390.png) · [Editing a repertoire](docs/previews/folio-repertoire-390.png) · [Games](docs/previews/folio-games-390.png)

- **Position** — notation, engine lines, opening explorer, position editor and study tools.
- **Collection** — repertoire catalogue, repertoire board, completed games and PC backups.
- **Setup** — board/input, Leela, Stockfish, explorer filters, PC pairing and display privacy.

The six board tabs share one position and one visible result panel. **Adjust** opens settings for the current tool. **Study** manages the move tree. Preferences use a full page and Done returns to the same board. Previous, next, flip and return to intersection stay under the board. A chart shows actual evaluations on the current branch for up to 48 recent positions; inherited evaluations are excluded, missing measurements remain gaps, and the chart is session-local.

## Data and connections

Folio uses `com.instinctazero.folio`, an Android app sandbox of its own. It does not read or migrate the stable app's credentials, games, studies, privacy choices, engine packs or repertoire databases. Debug and release builds of Folio use the same application ID and cannot be installed over one another with different signatures; either can coexist with stable.

Pair Folio explicitly through **Setup → PC connection**. Its pairing label begins with “Folio”; direct Lichess lookup uses an independent public PKCE client (`instinctazero-folio`) and callback (`com.instinctazero.folio://oauth/lichess`). Use the same selected PC account when connecting the optional direct explorer. Real authorization and server availability depend on the user's PC and browser; no credentials are included. Display privacy changes presentation only, not real account ownership, public games or PGNs.

**PC repertoire backup is initially off.** Editing or pairing cannot enroll Folio automatically. In Collection → PC backups, “Start PC backups” enables automatic backup for the current account, as does explicitly restoring a version. “Pause automatic backup” stops it. An untouched first install does not publish an empty backup. Once enrolled, this is the paired PC account's real history; restore and download are deliberate actions, not a migration of stable's local data.

Phone Stockfish Lite and Full are opt-in downloads; Lite is about 1.9 MB and Full about 99 MB. PC Stockfish uses the PC stream without a phone depth limit. Leela CPU and iGPU, its node budget and line count remain independent of Stockfish. Offline editing, local studies and repertoire authoring need no login.

## Build

Use JDK 17, Android SDK 35 and the Gradle wrapper. Source packs and board assets are checked in: Node is not required to build the APK.

```sh
./gradlew :app:assembleDebug
```

The APK is `app/build/outputs/apk/debug/app-debug.apk`. For a release use `:app:assembleRelease` and the separate `FOLIO_STORE_FILE`, `FOLIO_STORE_PASSWORD`, `FOLIO_KEY_ALIAS`, `FOLIO_KEY_PASSWORD` Gradle properties; without them the release is unsigned. Never place keys in the repository.

To reproduce the web checks and capture the phone layout, run in `web/` with Node 20:

```sh
npm ci
npm run check
npx playwright install chromium
node test/folio-ui.mjs
```

Alternatively pass `PHONE_PREVIEW_CHROMIUM` as an absolute browser executable. The two-size smoke test uses only loopback assets and synthetic legal moves. Native layout tests use Robolectric; `NATIVE_MENU_PREVIEW` is an optional output directory for rendered images. See [previews](docs/previews/).

## Provenance and verification boundary

Folio retains the audited chess interactions and service/storage modules from [InstinctaZero Android v0.8.23, b718601](https://github.com/Raffa2005/InstinctaZero-Android/tree/b718601): Chessground board/pieces/coordinates and arrows, smart input and drag-back correction, study/variation persistence, bounded gateway requests and streams, indexed repertoire authoring and read paths, markers, candidate previews, comments and Undo. It does not retain stable's Home or drawer. The local index is in `folio.js`; native routes and pairing remain behind the packaged WebView's allowlisted bridge. No server change is needed for local chess analysis.

The checks exercise packaged board interactions in Chromium and Android native views, backup edge cases, and durable edits/Undo in Robolectric. They are not physical-phone or live account acceptance tests. Pairing, direct OAuth, device-specific WebView memory/performance, Full pack installation and end-to-end PC backups still require device/service validation. No native service, private account, installed app or paired phone was changed while building this experiment.

GPL-3.0-or-later. See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md) for the retained source, artwork, fonts, rules, origin-ranking model and on-demand engine credits.

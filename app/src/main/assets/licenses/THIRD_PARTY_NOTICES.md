# Third-party notices

## Folio and optional engines

Folio is a GPL-3.0-or-later derivative of [InstinctaZero Android v0.8.23](https://github.com/Raffa2005/InstinctaZero-Android/tree/b718601).
Folio's Contents, native route hierarchy, presentation and session score chart are new. The
baseline's rules, interaction, engine transport and storage credits are retained below.

The optional phone engine is [Stockfish.js v19.0.1](https://github.com/nmrugg/stockfish.js/tree/v19.0.1)
by the Stockfish developers and Stockfish.js contributors (GPL v3). The APK does not contain
either NNUE/WASM pack. When requested it retrieves the single-thread Lite or Full release from
that upstream tag; sizes and SHA-256 values are pinned in StockfishDownloads.kt. The linked
tag is the corresponding source location. The PC engines are remote services, not APK contents.


The complete third-party notice for the offline analysis assets is
[`THIRD_PARTY_ANALYSIS.md`](THIRD_PARTY_ANALYSIS.md) in this same directory.

It covers the legacy lichobile Chessground source snapshot, Cburnett SVG pieces
and brown board, the local `chess.js` rules bundle, and the bundled typefaces.
The native completed-game list uses AndroidSVG 1.4 (Apache-2.0) to render the
same bundled Cburnett SVG pieces instead of a separate Unicode piece set.
The app does not ship the former native Compose board renderer, Chessground
10.1.1, or the non-free legacy Lichess icon font.

For the complete corresponding source and reproducible browser-asset build,
see the repository-level `THIRD_PARTY_NOTICES.md`,
`web-src/legacy-chessground/PROVENANCE.md`, and
`web-src/chess-rules-PROVENANCE.md`.

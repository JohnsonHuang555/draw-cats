# All animation rendered with Three.js (WebGL)

The core of the game is a "really flashy" pull animation: tearing open the pack, light bursting out of the opening, particles, the SSR glow, and a foil finish that reacts to the viewing angle. We chose to render the whole thing with Three.js plus a bloom post-processing pass. Light effects and lighting would look clearly weaker with pure CSS 3D, and a "WebGL scene + DOM cards" mix would leave two rendering systems with mismatched lighting styles and hard-to-sync timing.

## Considered Options

- **Pure CSS 3D + GSAP**: light and easy to work with, but tearing the pack, particles, and glow are limited
- **Mixed (WebGL scenes + DOM cards)**: the foil is easy to do in CSS, but the two layers have inconsistent lighting and handing cards between them is complicated

## Consequences

- The foil has to be written as a custom shader rather than with CSS blend modes
- Performance on low-end mobile is a real risk and needs a quality setting to fall back on

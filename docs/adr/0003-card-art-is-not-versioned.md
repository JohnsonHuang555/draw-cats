# Card Art is not part of the Generator Version

Players said the Card Art looked flat and didn't capture each cat's features, so we're restyling how cats are drawn: varied line weight, shading, fur edges, and per-cat silhouettes. ADR 0002 froze "how a Cat Number looks" as Generator Version 1, which taken literally would mean every restyle needs a new version. We decided the Generator Version covers only the identity, Cat Number → Rarity + Traits; how those Traits are drawn is Card Art, which can change freely. An owned #0042 keeps its fur, eyes and crown, but gets drawn in the new style.

## Considered Options

- **Bump to Generator Version 2 and redraw everything**: this misuses the version for something players don't treat as identity, and every later art tweak would need yet another version
- **Old Album Entries keep v1 art, new pulls get v2**: two renderers to maintain forever, and the Album would show two art styles side by side

## Consequences

- Changes to the Trait tables, weights, or random-number logic still require a new Generator Version (ADR 0002 still holds for those)
- Players may notice their old cats look different after an art update; that's intended

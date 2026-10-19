# Generated Cats are numbered, and their Rarity comes before their Traits

Besides the hand-made Meme Cats, most Cards are Generated Cats in the NFT style. We decided that a Generated Cat is identified by a fixed Cat Number (#0001–#9999), and its look is generated from that number when it's rendered, so no images are stored. The same number is always the same cat, which gives collecting a target (the phase B album) and gives the player a cat they can "own" and talk about.

Unlike typical NFTs, Rarity is **not** computed from how rare the Traits are. Each Cat Number has its Rarity fixed first, in proportion to the Rates, and its Traits are then drawn from the value pool for that Rarity (crowns, halos and galaxy fur only appear on SR/SSR). The Rates (SSR 1.5%) and the Ten-Pull Guarantee are therefore exact. Deriving rarity from traits would make the Rates a hard-to-tune byproduct.

## Considered Options

- **Generate a brand-new cat on every pull**: there would be no duplicates, but collecting would have no target, and a Copy couldn't be re-rendered from an identity
- **NFT-style rarity score computed from Traits**: closer to NFTs, but the Rates would no longer be controllable

## Consequences

- Changing the generator (adding Traits, reweighting them) changes what existing Cat Numbers look like. Once phase B stores players' collections, the generator needs versioning, or new Traits can only be appended at the end

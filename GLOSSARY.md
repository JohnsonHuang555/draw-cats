# Draw Card Game

A web pull simulator built around physical card packs, where every Card is a meme cat. The core experience is the pull animation: tearing open a **Pack** and flipping the **Cards** one by one to reveal their **Rarity**.

## Language

### Pulls

**Pull**:
One draw action by the player, which produces one **Pull Result**. Comes in two kinds: **Single Pull** and **Ten-Pull**.
_Avoid_: draw, gacha, roll, summon

**Single Pull**:
A **Pull** that produces 1 **Copy**.

**Ten-Pull**:
A **Pull** that produces 10 **Copies** at once.
_Avoid_: multi, 10x

**Pull Result**:
The ordered list of **Copies** one **Pull** produces. It is decided before the animation starts; the animation only presents it.

**Rates**:
The probability that each **Rarity** appears in a single card draw.
_Avoid_: odds, drop rate

**Ten-Pull Guarantee**:
The rule that a **Ten-Pull** includes at least one card of **SR** or higher.
_Avoid_: pity (pity is a separate concept that spans multiple **Pulls**; it is not in scope yet)

### Cards & rarity

**Card**:
An entry in the **Card Pool**: one meme cat, with a unique name, catchphrase, art, and exactly one **Rarity**.
_Avoid_: character, unit, cat (as a game term)

**Copy**:
One instance of a **Card** that the player gets from a **Pull**. The same **Card** can have multiple **Copies**.
_Avoid_: duplicate, instance

**Card Pool**:
The set of all **Cards** that can be pulled. Within each **Rarity**, every **Card** has an equal chance.
_Avoid_: banner, pool

**Rarity**:
A card's tier, from lowest to highest: **N**, **R**, **SR**, **SSR**.
_Avoid_: stars, grade, level

**Pack**:
The physical card pack the player tears open during the animation; it holds the **Copies** from one **Pull**.
_Avoid_: booster, box

**Foil**:
The holographic glare finish on a card's face, which reacts to the viewing angle. Only **SR** (light) and **SSR** (strong) cards have it.
_Avoid_: holo, shiny

### Animation

**Tear**:
The player swipes to rip the **Pack** open; this is the transition from the pack stage to the card stage.
_Avoid_: open pack, unbox

**Reveal Order**:
The order in which **Cards** are revealed after the **Tear**: lowest **Rarity** first, highest last.

**Reveal All**:
The player skips the remaining **Reveals** and goes straight to the **Summary**. **SSR** cards still get their full **Reveal** on their own.
_Avoid_: skip

**Summary**:
The screen that shows all the **Cards** from one **Pull** after all **Reveals** are done.
_Avoid_: result screen

**Reveal**:
The moment a single **Card** is flipped over and its face is shown.
_Avoid_: flip, open

**Rarity Hint**:
A visual cue before the **Reveal** that leaks the **Rarity** in advance. Comes in two layers: **Pack Hint** and **Card Hint**.

**Pack Hint**:
The color and glow of the **Pack**, which hint at the highest **Rarity** in this **Pull**.

**Card Hint**:
The shake and gathering light before a single **Card** is revealed, which hint at that card's **Rarity**. Only **SR** and above have one.

**Fake-out**:
A **Pack Hint** that first shows a lower **Rarity**, then suddenly turns into **SSR** at the moment of the **Tear**. Only happens when the **Pull** contains an SSR; **Card Hints** never fake out.
_Avoid_: bait, upgrade

**SSR Showcase**:
The full-screen moment after an **SSR** is revealed: the card enlarges to the center and the player can look at its **Foil**, then continues.
_Avoid_: SSR animation, cut-in

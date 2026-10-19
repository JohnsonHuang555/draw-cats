# Custom card art

Drop an image named after a card's id (see `src/domain/cards.ts`) to replace its cartoon art,
e.g. `ssr-grumpy.png` or `n-banana.webp`. Supported: png, jpg, jpeg, webp, gif.
The image is cropped to fill the art area (about 444 x 430).

Images here are git-ignored, so they stay local and the public deploy keeps the cartoon art.

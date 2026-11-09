# Five-minute demo

1. Run `npm run demo`. The terminal prints the temporary admin password. Open `http://localhost:5173`.
2. On the home page, watch the live second hand and scroll through the collections. Switch collections manually on mobile.
3. Open Collections. Filter by Vintage, search for Regent, open its details, use Escape to close, and verify focus returns to the card.
4. Open Technology and scroll the movement diagram. Open Gallery, use the arrow keys, and drag the lightbox down on touch.
5. Open Stockists. Select each city and note that map markers indicate city centres, not private viewing addresses.
6. Register a customer, then visit `/admin` to verify the account is redirected. Sign out, then use the temporary admin credentials printed by `npm run demo`.
7. In the admin desk, create a watch with a PNG or WebP image. Confirm it appears in Collections. Edit its price, remove the image, then delete the watch.
8. Send a contact note and subscribe to atelier notes. The admin statistics reflect these saved records.

The demo database and locally uploaded images are disposable. Production uses MongoDB and Cloudinary credentials.

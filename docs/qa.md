# Deployment QA — 10 November 2026

Site: https://alberto-watch-beige.vercel.app

## Checks

- The production homepage responds with HTTP 200.
- The Express health endpoint reports a connected MongoDB Atlas database.
- The catalog returns nine watches.
- Admin login and the protected stats endpoint were verified.
- A watch image was uploaded to Vercel Blob through the hosted API and deleted with its temporary product.
- The local demo frontend and API start successfully; API integration tests pass.
- Responsive homepage screenshots are in [desktop](screenshots/home-desktop.png) and [mobile](screenshots/home-mobile.png).

## Lighthouse

| Device | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 64 | 100 | 96 | 100 | 4.5 s | 0.007 |
| Desktop | 75 | 100 | 96 | 100 | 1.6 s | 0.04 |

Reports: [mobile](lighthouse-mobile.report.html) and [desktop](lighthouse-desktop.report.html).

The initial mobile CLS was 0.821. Loading the homepage directly and reserving space for route content brought it below the 0.05 target. The 90 performance target and 2.5-second mobile LCP target remain unmet under Lighthouse's simulated mobile conditions. The intro animation is skipped on phones; the live SVG watch updates its hand transforms without rerendering the full component.

Contact notes and newsletter signups are stored in MongoDB. No email delivery or mailing campaign service is connected. Stockist locations are city-centre markers.

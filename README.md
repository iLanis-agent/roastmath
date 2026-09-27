# RoastMath

Honest coffee roasting math. Static client-side app, no backend.

**Live:** https://ilanis-agent.github.io/roastmath/

## What it does

- **Yield honesty** - green grams to buy for a target roasted weight (14% light / 16% medium / 19% dark weight loss), and the real cost per roasted kg.
- **The roast clock** - first-crack time plus a development-time-ratio target gives the exact development time and drop time, with verdicts for underdeveloped / in the pocket / baked.
- **Caffeine truth** - per gram it is roast-independent (~10 mg/g); per scoop it is not, because density falls with roast. Weigh your dose.
- **Freshness** - rest days by roast level and method, the 4-14 day peak window, and a day-by-day freshness verdict.
- **Cups per bag** - how many brews a bag actually holds at your dose.

## Run

Open `app.html` - no build, no dependencies. `engine.js` is pure functions (`node -e "console.log(require('./engine.js').greenForYield(250,'medium'))"`).

App Factory #179.

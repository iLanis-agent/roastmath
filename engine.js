/* RoastMath engine - honest coffee roasting math. Pure functions, no DOM. */
var RoastEngine = (function () {
  /* weight loss % by roast level (moisture + chaff) */
  var LOSS = { light: 14, medium: 16, dark: 19 };
  /* bean density g/ml falls as roast expands the bean */
  var DENSITY = { light: 0.56, medium: 0.50, dark: 0.45 };
  var MG_PER_GRAM = 10; /* caffeine per gram of grounds, arabica - nearly roast-independent */
  var SCOOP_ML = 15; /* one level tablespoon */
  var LEVELS = ['light', 'medium', 'dark'];

  function checkLevel(level) {
    if (LEVELS.indexOf(level) < 0) throw new Error('unknown roast level ' + level);
  }

  /* green grams needed to land a target roasted weight */
  function greenForYield(roastedG, level) {
    checkLevel(level);
    return Math.round(roastedG / (1 - LOSS[level] / 100));
  }

  /* roasted grams you actually get from green */
  function roastedYield(greenG, level) {
    checkLevel(level);
    return Math.round(greenG * (1 - LOSS[level] / 100));
  }

  function lossPct(level) { checkLevel(level); return LOSS[level]; }

  /* given first-crack time and a target development-time ratio, when to drop */
  function devTiming(firstCrackSec, dtr) {
    if (dtr <= 0 || dtr >= 1) throw new Error('ratio must be between 0 and 1');
    var dev = Math.round(firstCrackSec * dtr / (1 - dtr));
    return { devSec: dev, dropSec: firstCrackSec + dev };
  }

  function devVerdict(ratioPct) {
    if (ratioPct < 15) return 'underdeveloped - grassy, sour, hollow; give it more time after the crack';
    if (ratioPct <= 25) return 'in the pocket - 18-25% is where sweetness lives';
    if (ratioPct <= 30) return 'pushing it - watch for the sugars tipping into bitter';
    return 'baked - flat and cardboard; you roasted the life out of it';
  }

  function cupsFromBag(bagG, doseG) {
    if (doseG <= 0) throw new Error('dose must be positive');
    return Math.floor(bagG / doseG);
  }

  /* honest caffeine math: per gram it barely changes with roast; per scoop it does */
  function gramCaffeine(level) { checkLevel(level); return MG_PER_GRAM; }
  function scoopGrams(level) {
    checkLevel(level);
    return Math.round(DENSITY[level] * SCOOP_ML * 10) / 10;
  }
  function scoopCaffeine(level) {
    return Math.round(scoopGrams(level) * MG_PER_GRAM * 10) / 10;
  }

  /* degassing rest before the coffee tastes right, in days */
  function restDays(level, method) {
    checkLevel(level);
    if (method === 'espresso') {
      return level === 'light' ? { min: 10, max: 14 } : level === 'medium' ? { min: 8, max: 12 } : { min: 7, max: 10 };
    }
    return level === 'light' ? { min: 5, max: 10 } : level === 'medium' ? { min: 4, max: 8 } : { min: 3, max: 5 };
  }

  /* the honest peak window and the stale cliff, in days after roast */
  function peakWindow() { return { start: 4, end: 14 }; }
  function freshnessVerdict(days) {
    if (days < 1) return 'too fresh - still gassing, flavors muted';
    if (days < 4) return 'almost there - degassing, cup it but wait for the peak';
    if (days <= 14) return 'peak window - brew it like you mean it';
    if (days <= 30) return 'fading - fine, but the sparkle is going';
    return 'stale - flat and papery; compost or cold brew';
  }

  /* what a kg of roasted coffee really costs from green price */
  function costPerRoastedKg(greenPerKg, level) {
    checkLevel(level);
    return Math.round(greenPerKg / (1 - LOSS[level] / 100) * 100) / 100;
  }

  return {
    LOSS: LOSS, DENSITY: DENSITY, LEVELS: LEVELS, MG_PER_GRAM: MG_PER_GRAM, SCOOP_ML: SCOOP_ML,
    greenForYield: greenForYield, roastedYield: roastedYield, lossPct: lossPct,
    devTiming: devTiming, devVerdict: devVerdict, cupsFromBag: cupsFromBag,
    gramCaffeine: gramCaffeine, scoopGrams: scoopGrams, scoopCaffeine: scoopCaffeine,
    restDays: restDays, peakWindow: peakWindow, freshnessVerdict: freshnessVerdict,
    costPerRoastedKg: costPerRoastedKg
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = RoastEngine;

/* ========================================================================= */
/* ESPRESSO EXPRESS RECIPE SPECIFICATIONS & EVALUATOR                        */
/* ========================================================================= */

/**
 * Parses syrup strings like "Caramel (2x)", "2x Caramel", "Vanilla (2x)"
 * Returns { flavor: 'Caramel', count: 2 }
 */
export function parseSyrupRequirement(syrupString) {
  if (!syrupString || syrupString === 'None') {
    return { flavor: 'None', count: 0 };
  }
  let count = 1;
  const match = syrupString.match(/(\d+)\s*x/i) || syrupString.match(/\((\d+)x?\)/i) || syrupString.match(/x\s*(\d+)/i);
  if (match) {
    count = parseInt(match[1], 10);
  }
  let flavor = 'Caramel';
  const lower = syrupString.toLowerCase();
  if (lower.includes('caramel')) flavor = 'Caramel';
  else if (lower.includes('vanilla')) flavor = 'Vanilla';
  else if (lower.includes('mocha')) flavor = 'Mocha';

  return { flavor, count };
}

export const DRINK_RECIPES = {
  espresso: {
    id: 'espresso',
    name: 'Single Espresso',
    icon: '☕',
    size: 'Small',
    shots: 1,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: false,
    temp: 'Hot (190°F)',
    basePrice: 3.50,
    prepDescription: '1x Espresso shot in Small cup'
  },
  double_espresso: {
    id: 'double_espresso',
    name: 'Double Espresso',
    icon: '☕',
    size: 'Small',
    shots: 2,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: false,
    temp: 'Hot (195°F)',
    basePrice: 4.75,
    prepDescription: 'Double shot espresso in Small cup'
  },
  triple_espresso: {
    id: 'triple_espresso',
    name: 'Triple Espresso',
    icon: '⚡',
    size: 'Small',
    shots: 3,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: false,
    temp: 'Hot (195°F)',
    basePrice: 5.75,
    prepDescription: '3x Espresso shots in Small cup'
  },
  quad_shot: {
    id: 'quad_shot',
    name: 'Quad Overdrive',
    icon: '⚡',
    size: 'Medium',
    shots: 4,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: false,
    temp: 'Hot (195°F)',
    basePrice: 6.50,
    prepDescription: '4x Espresso shots in Medium cup'
  },
  americano: {
    id: 'americano',
    name: 'Americano',
    icon: '☕',
    size: 'Medium',
    shots: 2,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: false,
    hasWater: true,
    temp: 'Hot (185°F)',
    basePrice: 4.50,
    prepDescription: 'Double espresso + Hot Water in Medium cup'
  },
  large_americano: {
    id: 'large_americano',
    name: 'Large Americano',
    icon: '☕',
    size: 'Large',
    shots: 3,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: false,
    hasWater: true,
    temp: 'Hot (185°F)',
    basePrice: 5.50,
    prepDescription: '3x Espresso shots + Hot Water in Large cup'
  },
  iced_americano: {
    id: 'iced_americano',
    name: 'Iced Americano',
    icon: '🧊',
    size: 'Medium',
    shots: 2,
    milk: 'None',
    frothed: false,
    syrup: 'None',
    ice: true,
    hasWater: true,
    temp: 'Chilled (36°F)',
    basePrice: 4.75,
    prepDescription: 'Ice + Double espresso + Water in Medium cup'
  },
  latte: {
    id: 'latte',
    name: 'Whole Milk Latte',
    icon: '🥛',
    size: 'Large',
    shots: 2,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'None',
    ice: false,
    temp: 'Steamed (150°F)',
    basePrice: 5.75,
    prepDescription: 'Double espresso + Steamed Whole Milk'
  },
  small_latte: {
    id: 'small_latte',
    name: 'Small Latte',
    icon: '🥛',
    size: 'Small',
    shots: 1,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'None',
    ice: false,
    temp: 'Steamed (150°F)',
    basePrice: 4.75,
    prepDescription: 'Single espresso + Steamed Whole Milk'
  },
  iced_latte: {
    id: 'iced_latte',
    name: 'Iced Latte',
    icon: '🧊',
    size: 'Medium',
    shots: 2,
    milk: 'Whole Milk',
    frothed: false,
    syrup: 'None',
    ice: true,
    temp: 'Chilled (36°F)',
    basePrice: 5.50,
    prepDescription: 'Ice + Whole Milk + 2 Shots in Medium cup'
  },
  oat_latte: {
    id: 'oat_latte',
    name: 'Oat Milk Latte',
    icon: '🌾',
    size: 'Large',
    shots: 2,
    milk: 'Oat Milk',
    frothed: true,
    syrup: 'None',
    ice: false,
    temp: 'Steamed (145°F)',
    basePrice: 6.25,
    prepDescription: 'Double espresso + Steamed Oat Milk'
  },
  small_oat_latte: {
    id: 'small_oat_latte',
    name: 'Small Oat Latte',
    icon: '🌾',
    size: 'Small',
    shots: 1,
    milk: 'Oat Milk',
    frothed: true,
    syrup: 'None',
    ice: false,
    temp: 'Steamed (145°F)',
    basePrice: 5.25,
    prepDescription: '1 Shot + Steamed Oat Milk in Small cup'
  },
  iced_oat_latte: {
    id: 'iced_oat_latte',
    name: 'Iced Oat Latte',
    icon: '🧊',
    size: 'Medium',
    shots: 2,
    milk: 'Oat Milk',
    frothed: false,
    syrup: 'None',
    ice: true,
    temp: 'Chilled (36°F)',
    basePrice: 6.25,
    prepDescription: 'Ice + Oat Milk + 2 Shots in Medium cup'
  },
  caramel_latte: {
    id: 'caramel_latte',
    name: 'Caramel Latte',
    icon: '🍯',
    size: 'Medium',
    shots: 1,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'Caramel (1x)',
    ice: false,
    temp: 'Steamed (150°F)',
    basePrice: 6.00,
    prepDescription: '1x Caramel + 1 Shot + Steamed Whole Milk'
  },
  caramel_macchiato: {
    id: 'caramel_macchiato',
    name: 'Caramel Macchiato',
    icon: '🍯',
    size: 'Large',
    shots: 2,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'Caramel (2x)',
    ice: false,
    temp: 'Layered Hot',
    basePrice: 6.75,
    prepDescription: '2x Caramel pumps + Steamed Whole Milk + 2 Shots'
  },
  iced_caramel_macchiato: {
    id: 'iced_caramel_macchiato',
    name: 'Iced Caramel Macchiato',
    icon: '🧊',
    size: 'Large',
    shots: 2,
    milk: 'Whole Milk',
    frothed: false,
    syrup: 'Caramel (2x)',
    ice: true,
    temp: 'Chilled (38°F)',
    basePrice: 7.25,
    prepDescription: 'Ice + 2x Caramel + Whole Milk + 2 Shots'
  },
  vanilla_latte: {
    id: 'vanilla_latte',
    name: 'Vanilla Latte',
    icon: '🌼',
    size: 'Medium',
    shots: 2,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'Vanilla (1x)',
    ice: false,
    temp: 'Steamed (150°F)',
    basePrice: 6.25,
    prepDescription: '1x Vanilla + 2 Shots + Steamed Whole Milk'
  },
  iced_vanilla_oat: {
    id: 'iced_vanilla_oat',
    name: 'Iced Vanilla Oat Latte',
    icon: '🧊',
    size: 'Large',
    shots: 2,
    milk: 'Oat Milk',
    frothed: false,
    syrup: 'Vanilla (2x)',
    ice: true,
    temp: 'Chilled (38°F)',
    basePrice: 7.25,
    prepDescription: 'Ice + 2x Vanilla + Oat Milk + 2 Shots'
  },
  dark_mocha: {
    id: 'dark_mocha',
    name: 'Dark Mocha',
    icon: '🍫',
    size: 'Large',
    shots: 2,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'Mocha (2x)',
    ice: false,
    temp: 'Steamed (155°F)',
    basePrice: 6.50,
    prepDescription: '2x Mocha + 2 Shots + Steamed Whole Milk'
  },
  sweet_mocha: {
    id: 'sweet_mocha',
    name: 'Sweet Mocha',
    icon: '🍫',
    size: 'Medium',
    shots: 1,
    milk: 'Whole Milk',
    frothed: true,
    syrup: 'Mocha (1x)',
    ice: false,
    temp: 'Steamed (155°F)',
    basePrice: 6.00,
    prepDescription: '1x Mocha + 1 Shot + Steamed Whole Milk'
  },
  iced_mocha: {
    id: 'iced_mocha',
    name: 'Iced Mocha',
    icon: '🧊',
    size: 'Medium',
    shots: 2,
    milk: 'Whole Milk',
    frothed: false,
    syrup: 'Mocha (1x)',
    ice: true,
    temp: 'Chilled (38°F)',
    basePrice: 6.50,
    prepDescription: 'Ice + 1x Mocha + Whole Milk + 2 Shots'
  },
  triple_oat_mocha: {
    id: 'triple_oat_mocha',
    name: 'Triple Oat Mocha',
    icon: '🍫',
    size: 'Large',
    shots: 3,
    milk: 'Oat Milk',
    frothed: true,
    syrup: 'Mocha (2x)',
    ice: false,
    temp: 'Steamed (155°F)',
    basePrice: 7.50,
    prepDescription: '2x Mocha + 3 Shots + Steamed Oat Milk'
  },
  iced_vanilla_shot: {
    id: 'iced_vanilla_shot',
    name: 'Iced Vanilla Espresso',
    icon: '🧊',
    size: 'Small',
    shots: 2,
    milk: 'None',
    frothed: false,
    syrup: 'Vanilla (1x)',
    ice: true,
    temp: 'Chilled (36°F)',
    basePrice: 5.00,
    prepDescription: 'Ice + 1x Vanilla + 2 Shots in Small cup'
  },
  caramel_espresso: {
    id: 'caramel_espresso',
    name: 'Caramel Espresso',
    icon: '🍯',
    size: 'Small',
    shots: 1,
    milk: 'None',
    frothed: false,
    syrup: 'Caramel (1x)',
    ice: false,
    temp: 'Hot (190°F)',
    basePrice: 4.25,
    prepDescription: '1x Caramel + 1 Shot in Small cup'
  }
};

export const COMMUTER_ARCHETYPES = [
  {
    type: 'Wall St. Trader',
    name: 'Frank Vance',
    avatar: 'business',
    notes: 'Heading to trading desk. Train leaves right now!'
  },
  {
    type: 'Night Shift Nurse',
    name: 'Maya Lin',
    avatar: 'sleepy',
    notes: 'Heading home after a 12h hospital shift... need caffeine.'
  },
  {
    type: 'Subway Busker',
    name: 'Jax Rivera',
    avatar: 'student',
    notes: 'Keep it iced and sweet! Soundcheck at 8th Ave station.'
  },
  {
    type: 'Tech Lead',
    name: 'Siddharth R.',
    avatar: 'business',
    notes: 'Sprint review at 9:00 AM sharp. Need extra caffeine!'
  },
  {
    type: 'Art Student',
    name: 'Chloe V.',
    avatar: 'student',
    notes: 'Rich chocolate mocha please, got a portfolio review.'
  },
  {
    type: 'Subway Conductor',
    name: 'Officer Pete',
    avatar: 'sleepy',
    notes: 'Highballing on Track 3 in 2 minutes! Quick black coffee!'
  },
  {
    type: 'Lead Architect',
    name: 'Nadia Thorne',
    avatar: 'business',
    notes: 'Blueprints under my arm, client meeting in 15 minutes.'
  },
  {
    type: 'Biotech Researcher',
    name: 'Dr. Elena Rossi',
    avatar: 'sleepy',
    notes: 'Lab notes due this morning. Extra strong espresso!'
  },
  {
    type: 'Manga Illustrator',
    name: 'Kenji Sato',
    avatar: 'student',
    notes: 'Need sweet iced fuel for drawing all day.'
  },
  {
    type: 'Broadway Stagehand',
    name: 'Marcus Brody',
    avatar: 'business',
    notes: 'Hauling lighting rigs for the matinee show today.'
  },
  {
    type: 'History Teacher',
    name: 'Ms. Eleanor Gable',
    avatar: 'student',
    notes: 'Grading 80 essay tests on the train ride uptown.'
  },
  {
    type: 'Marathon Runner',
    name: 'Zara Patel',
    avatar: 'business',
    notes: 'Morning 10k completed in Central Park! Fast espresso.'
  },
  {
    type: 'Brooklyn Barista',
    name: 'Soren Dahl',
    avatar: 'student',
    notes: 'Heading to open my shop uptown. Testing your pull!'
  },
  {
    type: 'Bike Courier',
    name: 'Dash Martinez',
    avatar: 'business',
    notes: 'Rain or shine deliveries across Manhattan!'
  },
  {
    type: 'Radio Producer',
    name: 'Kelly O\'Connor',
    avatar: 'student',
    notes: 'Morning broadcast starts at 8:00 AM sharp!'
  },
  {
    type: 'Transit Dispatcher',
    name: 'Sal Terranova',
    avatar: 'sleepy',
    notes: 'Managing the whole underground signal switchboard.'
  },
  {
    type: 'Corporate Lawyer',
    name: 'Jessica Wu',
    avatar: 'business',
    notes: 'Deposition in federal court at 9:30 AM.'
  },
  {
    type: 'Archive Librarian',
    name: 'Arthur Pendelton',
    avatar: 'sleepy',
    notes: 'Rare manuscript restoration all morning.'
  },
  {
    type: 'Sound Designer',
    name: 'Tariq Al-Mansoor',
    avatar: 'student',
    notes: 'Mixing sound tracks in headphones on the commute.'
  },
  {
    type: 'Flight Attendant',
    name: 'Camila Reyes',
    avatar: 'business',
    notes: 'JFK airport express train arriving in 5 minutes!'
  }
];

let nextOrderId = 104;
const recentRecipeHistory = [];
const recentArchetypeHistory = [];

export function getIceRequirement(order) {
  if (!order) return 0;
  if (typeof order.iceCount === 'number') return order.iceCount;
  if (typeof order.ice === 'number') return order.ice;
  if (order.ice === true) return 2; // Default to 2 scoops if boolean
  return 0;
}

export function getIceLabel(count) {
  if (count === 1) return 'Light Ice (1x Scoop)';
  if (count === 2) return 'Regular Ice (2x Scoops)';
  if (count === 3) return 'Extra Ice (3x Scoops)';
  return 'Hot (No Ice)';
}

export function generateCustomerOrder(options = {}) {
  const existingOrders = options.existingOrders || [];
  const existingRecipeIds = new Set(existingOrders.map(o => o.drinkId));
  const existingCustomers = new Set(existingOrders.map(o => o.customer));

  // 1. Select Archetype with Anti-Repetition
  let availableArchetypes = COMMUTER_ARCHETYPES.filter(a => !existingCustomers.has(a.name));
  if (availableArchetypes.length === 0) availableArchetypes = COMMUTER_ARCHETYPES;

  let freshArchetypes = availableArchetypes.filter(a => !recentArchetypeHistory.includes(a.name));
  if (freshArchetypes.length === 0) freshArchetypes = availableArchetypes;

  const archetype = freshArchetypes[Math.floor(Math.random() * freshArchetypes.length)];
  
  recentArchetypeHistory.push(archetype.name);
  if (recentArchetypeHistory.length > 10) recentArchetypeHistory.shift();

  // 2. Select Drink Recipe with Anti-Repetition
  const recipeKeys = Object.keys(DRINK_RECIPES);
  let availableRecipes = recipeKeys.filter(k => !existingRecipeIds.has(k));
  if (availableRecipes.length === 0) availableRecipes = recipeKeys;

  let freshRecipes = availableRecipes.filter(k => !recentRecipeHistory.includes(k));
  if (freshRecipes.length === 0) freshRecipes = availableRecipes;

  const chosenKey = options.recipeId || freshRecipes[Math.floor(Math.random() * freshRecipes.length)];
  const recipe = DRINK_RECIPES[chosenKey] || DRINK_RECIPES.espresso;

  recentRecipeHistory.push(chosenKey);
  if (recentRecipeHistory.length > 10) recentRecipeHistory.shift();

  // Dynamic Customer Ice Preference (1, 2, or 3 scoops for iced drinks)
  let requestedIce = 0;
  let customerNote = archetype.notes;
  let prepDesc = recipe.prepDescription;

  if (recipe.ice) {
    const iceDistribution = [1, 2, 2, 3]; // 1x Light, 2x Regular (common), 3x Extra
    requestedIce = iceDistribution[Math.floor(Math.random() * iceDistribution.length)];
    const iceLabel = requestedIce === 1 ? 'Light Ice (1x Scoop)' : (requestedIce === 2 ? 'Regular Ice (2x Scoops)' : 'Extra Ice (3x Scoops)');
    const iceQuote = requestedIce === 1 ? 'Light ice please (1 scoop)!' : (requestedIce === 2 ? 'Regular ice (2 scoops) please.' : 'Extra ice (3 scoops) please, keep it freezing!');
    customerNote = `${archetype.notes} ${iceQuote}`;
    prepDesc = `${iceLabel} + ${recipe.prepDescription}`;
  }

  // Dynamic Customer Tipping: some customers tip and some do not (~50% give tip, ~50% no tip)
  const isTipper = Math.random() < 0.52;
  let customerTip = 0.00;
  if (isTipper) {
    const tipOptions = [1.00, 1.25, 1.50, 1.75, 2.00, 2.50];
    customerTip = tipOptions[Math.floor(Math.random() * tipOptions.length)];
  }

  const order = {
    id: nextOrderId++,
    customer: archetype.name,
    customerType: archetype.type,
    avatar: archetype.avatar,
    drinkId: recipe.id,
    drinkName: recipe.name,
    icon: recipe.icon,
    size: recipe.size,
    shots: recipe.shots,
    milk: recipe.milk,
    frothed: recipe.frothed,
    hasWater: !!recipe.hasWater,
    syrup: recipe.syrup,
    ice: requestedIce,
    iceCount: requestedIce,
    temp: recipe.temp,
    price: recipe.basePrice,
    tipBonus: customerTip,
    trainTime: 'Permanent (No Rush)',
    timerSec: null,
    maxTimerSec: null,
    prepDescription: prepDesc,
    notes: customerNote
  };

  return order;
}

/**
 * Evaluates the player's prepared beverage against target order
 */
export function evaluateDrink(preparation, order) {
  if (!preparation || !preparation.cup) {
    return {
      success: false,
      score: 0,
      grade: 'No Cup',
      accuracy: 0,
      feedback: 'No cup on tray! Grab a to-go cup first.',
      tips: 0
    };
  }

  let penalty = 0;
  const details = [];

  // Check cup size (supports both cupSize and size properties)
  const prepCupSize = preparation.cupSize || preparation.size || 'Large';
  if (order.size && order.size !== 'Any') {
    if (prepCupSize !== order.size) {
      penalty += 15;
      details.push(`Used ${prepCupSize} cup (${order.size} ordered)`);
    }
  }

  // Check shots (strict exact match)
  const prepShots = preparation.shots || 0;
  const orderedShots = order.shots || 1;
  const shotDiff = Math.abs(prepShots - orderedShots);
  if (prepShots === 0) {
    penalty += 45;
    details.push(`Missing espresso shots (${orderedShots} needed)`);
  } else if (shotDiff > 0) {
    penalty += shotDiff * 30;
    details.push(`${prepShots} shots vs ${orderedShots} ordered (${prepShots > orderedShots ? 'Too many shots / bitter' : 'Too weak'})`);
  }

  // Check milk
  const targetNeedsMilk = order.milk && order.milk !== 'None';
  const prepHasMilk = preparation.milk && preparation.milk !== 'None';
  if (targetNeedsMilk && !prepHasMilk) {
    penalty += 25;
    details.push(`Missing milk (${order.milk})`);
  } else if (!targetNeedsMilk && prepHasMilk) {
    penalty += 25;
    details.push('Added unrequested milk to black coffee');
  } else if (targetNeedsMilk && prepHasMilk && preparation.milk !== order.milk) {
    penalty += 15;
    details.push(`Used ${preparation.milk} instead of ${order.milk}`);
  }

  // Check froth / steaming (Strict: if not demanded, steaming is a penalty!)
  const isOrderIced = (typeof order.iceCount === 'number' && order.iceCount > 0) || (typeof order.ice === 'number' && order.ice > 0) || !!order.ice;
  const targetNeedsFroth = !!order.frothed;
  const prepHasFroth = !!preparation.frothed;

  if (targetNeedsFroth && !prepHasFroth) {
    penalty += 20;
    details.push('Milk not steamed/frothed (lukewarm)');
  } else if (!targetNeedsFroth && prepHasFroth) {
    if (isOrderIced) {
      penalty += 30;
      details.push('Steamed hot milk poured into iced drink (melted ice / ruined beverage)');
    } else if (targetNeedsMilk) {
      penalty += 20;
      details.push('Steamed milk when cold/unsteamed milk was requested');
    } else {
      penalty += 25;
      details.push('Added unwanted steamed froth');
    }
  }

  // Check water (Strict: Americanos require hot water, all other drinks must NOT have water!)
  const targetNeedsWater = !!order.hasWater;
  const prepHasWater = !!preparation.hasWater;
  if (targetNeedsWater && !prepHasWater) {
    penalty += 35;
    details.push('Missing hot water (Americano requires hot water)');
  } else if (!targetNeedsWater && prepHasWater) {
    penalty += 35;
    details.push('Added unwanted hot water (diluted coffee / ruined beverage)');
  }

  // Check ice (exact scoop requirement: 1, 2, or 3 scoops)
  const targetIce = getIceRequirement(order);
  const prepIce = typeof preparation.ice === 'number' ? preparation.ice : (preparation.ice ? 2 : 0);

  if (targetIce === 0 && prepIce > 0) {
    penalty += 25;
    details.push(`Added ice to hot drink (${prepIce}x scoop(s))`);
  } else if (targetIce > 0 && prepIce === 0) {
    penalty += 25;
    details.push(`Forgot ice on iced drink (${targetIce}x scoop(s) requested)`);
  } else if (targetIce > 0 && prepIce !== targetIce) {
    const diff = Math.abs(prepIce - targetIce);
    penalty += diff * 15;
    details.push(`${prepIce > targetIce ? 'Too much ice' : 'Not enough ice'} (${prepIce} vs ${targetIce}x scoops ordered)`);
  }

  // Check syrups
  const targetNeedsSyrup = order.syrup && order.syrup !== 'None';
  const prepHasSyrup = preparation.syrups && preparation.syrups.length > 0;
  if (targetNeedsSyrup && !prepHasSyrup) {
    penalty += 25;
    details.push(`Missing syrup flavor (${order.syrup})`);
  } else if (!targetNeedsSyrup && prepHasSyrup) {
    penalty += 30;
    details.push('Added unrequested syrup to non-sweetened drink');
  } else if (targetNeedsSyrup && prepHasSyrup) {
    const req = parseSyrupRequirement(order.syrup);
    const flavorPumps = preparation.syrups.filter(s => s.toLowerCase() === req.flavor.toLowerCase()).length;
    const wrongFlavorPumps = preparation.syrups.filter(s => s.toLowerCase() !== req.flavor.toLowerCase()).length;

    if (wrongFlavorPumps > 0) {
      penalty += wrongFlavorPumps * 25;
      details.push(`Contaminated with unrequested syrup (${wrongFlavorPumps}x wrong flavor pump(s))`);
    }

    if (flavorPumps === 0) {
      penalty += 25;
      details.push(`Wrong syrup flavor (${req.flavor} needed)`);
    } else if (flavorPumps < req.count) {
      penalty += (req.count - flavorPumps) * 15;
      details.push(`Missing syrup pumps (${flavorPumps}/${req.count}x ${req.flavor})`);
    } else if (flavorPumps > req.count) {
      penalty += (flavorPumps - req.count) * 20;
      details.push(`Too sweet (${flavorPumps} pumps vs ${req.count}x ordered)`);
    }
  }

  const accuracy = Math.max(0, 100 - penalty);
  const success = accuracy >= 50;

  let grade = 'PERFECT!';
  let tipMult = 1.0;
  let feedback = 'Masterpiece! Right on time!';

  const hasCustomerTip = typeof order.tipBonus === 'number' && order.tipBonus > 0;

  if (accuracy >= 95) {
    grade = 'PERFECT!';
    tipMult = 1.5;
    feedback = hasCustomerTip ? 'Perfect drink! Commuter tipped generously!' : 'Perfect drink! Commuter nodded in appreciation (no tip).';
  } else if (accuracy >= 80) {
    grade = 'GREAT';
    tipMult = 1.0;
    feedback = hasCustomerTip ? 'Great cup! Commuter left a tip and ran for the train.' : 'Great cup! Commuter hurried to the platform happy (no tip).';
  } else if (accuracy >= 55) {
    grade = 'ACCEPTABLE';
    tipMult = 0.4;
    feedback = hasCustomerTip ? `Passable coffee (${details.join(', ')}). Small tip left.` : `Passable coffee (${details.join(', ')}).`;
  } else {
    grade = 'WRONG DRINK';
    tipMult = 0.0;
    feedback = `Order rejected! (${details.join(', ')}).`;
  }

  const earnedTip = (success && hasCustomerTip) ? Number((order.tipBonus * tipMult).toFixed(2)) : 0;
  const totalEarned = success ? Number((order.price + earnedTip).toFixed(2)) : 0;

  return {
    success,
    score: accuracy,
    grade,
    accuracy,
    details,
    feedback,
    earnedTip,
    totalEarned
  };
}

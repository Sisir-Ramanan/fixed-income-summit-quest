/* ============================================================
   questions.js  –  Fixed Income Summit Quest
   Expanded: 7 concepts, 7 pre/post, 14 game questions
   Conceptual focus with fun explanations.
   Each question carries a conceptTag for per-concept analytics.
   ============================================================ */

const CONCEPTS = [
  { id: 'bond_pricing',            label: 'Bond Pricing & Yields' },
  { id: 'forward_rates',           label: 'Forward Rates' },
  { id: 'duration',                label: 'Duration & Risk' },
  { id: 'expectations_hypothesis', label: 'Expectations Hypothesis' },
  { id: 'eh_tests',                label: 'Campbell-Shiller & Fama-Bliss' },
  { id: 'cochrane_piazzesi',       label: 'Cochrane-Piazzesi' },
  { id: 'yield_curve_factors',     label: 'Level, Slope & Curvature' }
];

/* ----------------------------------------------------------
   PRE-QUIZ  (7 conceptual questions, one per concept)
   ---------------------------------------------------------- */
const PRE_QUIZ = [
  {
    id: 'pre_bp',
    conceptTag: 'bond_pricing',
    type: 'choice',
    prompt: 'A bond is trading <strong>above</strong> its face value (at a premium). What must be true about its yield to maturity (YTM) relative to its coupon rate?',
    options: [
      { value: 'A', text: 'YTM is greater than the coupon rate' },
      { value: 'B', text: 'YTM equals the coupon rate' },
      { value: 'C', text: 'YTM is less than the coupon rate' },
      { value: 'D', text: 'There is no systematic relationship between YTM and coupon rate' }
    ],
    answer: 'C',
    explanation: 'When you pay more than face value, you\'re "overpaying" for the coupon stream, so your effective return (YTM) must be lower than the coupon rate. Think of it as a seesaw: price goes up, yield comes down.'
  },
  {
    id: 'pre_fr',
    conceptTag: 'forward_rates',
    type: 'choice',
    prompt: 'The 1-year spot rate is <strong>2%</strong> and the 2-year spot rate is <strong>4%</strong>. What can you conclude about the implied 1-year forward rate from year 1 to year 2?',
    options: [
      { value: 'A', text: 'It equals 2%, the 1-year spot rate' },
      { value: 'B', text: 'It equals 4%, the 2-year spot rate' },
      { value: 'C', text: 'It is between 2% and 4%' },
      { value: 'D', text: 'It is higher than 4%' }
    ],
    answer: 'D',
    explanation: 'The 2-year spot rate (4%) is an average of year 1 (2%) and the forward rate. For the average to be 4% when year 1 is only 2%, year 2\'s rate must be well above 4% \u2014 it works out to about 6.04%. Like a GPA: if your cumulative is 3.5 but semester 1 was 2.0, semester 2 must have been stellar.'
  },
  {
    id: 'pre_dur',
    conceptTag: 'duration',
    type: 'choice',
    prompt: 'Which of the following bonds is <strong>most sensitive</strong> to a change in interest rates?',
    options: [
      { value: 'A', text: '5-year bond with an 8% coupon' },
      { value: 'B', text: '10-year bond with a 6% coupon' },
      { value: 'C', text: '10-year zero-coupon bond' },
      { value: 'D', text: '5-year zero-coupon bond' }
    ],
    answer: 'C',
    explanation: 'The 10-year zero-coupon bond has the highest duration \u2014 it combines the longest maturity with zero intermediate cash flows. All your money arrives at year 10, giving compounding maximum time to amplify any rate change. Longest wait + no early payments = maximum nervousness.'
  },
  {
    id: 'pre_eh',
    conceptTag: 'expectations_hypothesis',
    type: 'choice',
    prompt: 'Under the pure <strong>Expectations Hypothesis</strong>, a steeply upward-sloping yield curve signals that:',
    options: [
      { value: 'A', text: 'Long bonds carry higher risk premia' },
      { value: 'B', text: 'The market expects short-term interest rates to rise' },
      { value: 'C', text: 'Inflation is currently high' },
      { value: 'D', text: 'The central bank is about to cut rates' }
    ],
    answer: 'B',
    explanation: 'Under the EH, long rates are simply averages of expected future short rates. A steep curve means the market expects short rates to climb \u2014 the only way long rates can be higher is if future short rates are expected to exceed today\'s. No risk premia, no mystery \u2014 just expectations.'
  },
  {
    id: 'pre_cs',
    conceptTag: 'eh_tests',
    type: 'choice',
    prompt: 'Campbell and Shiller (1991) test the Expectations Hypothesis by regressing <strong>future yield changes</strong> on the <strong>current yield spread</strong>. Under the EH, the slope coefficient \u03B2 should equal:',
    options: [
      { value: 'A', text: '0 (no relationship)' },
      { value: 'B', text: '1 (yield spread perfectly forecasts changes)' },
      { value: 'C', text: '\u22121 (yield spread forecasts opposite changes)' },
      { value: 'D', text: 'The term premium' }
    ],
    answer: 'B',
    explanation: 'Under the EH, if the spread between long and short rates is wide, it\'s because rates are expected to rise \u2014 and the spread should predict the exact magnitude of that rise (\u03B2 = 1). If \u03B2 \u2260 1, either expectations are wrong or there\'s a time-varying risk premium lurking in the spread.'
  },
  {
    id: 'pre_cp',
    conceptTag: 'cochrane_piazzesi',
    type: 'choice',
    prompt: 'The Cochrane-Piazzesi (2005) return-forecasting factor is constructed by regressing <strong>average bond excess returns</strong> on:',
    options: [
      { value: 'A', text: 'The level of the federal funds rate' },
      { value: 'B', text: 'A single forward-spot spread (like Fama-Bliss)' },
      { value: 'C', text: 'A linear combination of forward rates across all maturities' },
      { value: 'D', text: 'Stock market volatility (VIX)' }
    ],
    answer: 'C',
    explanation: 'Cochrane and Piazzesi regress the average excess return across maturities on a full set of forward rates, then use the fitted value as a single forecasting factor. This approach captures risk premium information spread across the entire yield curve \u2014 not just one point on it.'
  },
  {
    id: 'pre_lsc',
    conceptTag: 'yield_curve_factors',
    type: 'choice',
    prompt: 'A Principal Component Analysis (PCA) of the yield curve reveals three dominant factors: Level, Slope, and Curvature. Together, these three factors explain approximately:',
    options: [
      { value: 'A', text: '50% of yield variation' },
      { value: 'B', text: '75% of yield variation' },
      { value: 'C', text: '90% of yield variation' },
      { value: 'D', text: '99.9% of yield variation' }
    ],
    answer: 'D',
    explanation: 'The yield curve is remarkably low-dimensional: just three numbers capture virtually all the action. Level alone gets about 97%, Slope adds ~2.5%, and Curvature adds ~0.4%. Instead of tracking dozens of individual yields, you can track three factors and miss almost nothing.'
  }
];

/* ----------------------------------------------------------
   POST-QUIZ  (7 conceptual questions, isomorphic to pre-quiz)
   Same concepts, different angles / framing
   ---------------------------------------------------------- */
const POST_QUIZ = [
  {
    id: 'post_bp',
    conceptTag: 'bond_pricing',
    type: 'choice',
    prompt: 'If market interest rates <strong>rise sharply</strong>, what happens to the market price of an existing fixed-rate bond?',
    options: [
      { value: 'A', text: 'It rises \u2014 higher rates mean better returns for bondholders' },
      { value: 'B', text: 'It falls \u2014 future cash flows are now discounted at a higher rate' },
      { value: 'C', text: 'It stays the same \u2014 the coupon is fixed by contract' },
      { value: 'D', text: 'It depends entirely on the bond\'s credit rating' }
    ],
    answer: 'B',
    explanation: 'Bond prices and yields move in opposite directions \u2014 always. When market rates rise, the present value of the bond\'s fixed cash flows shrinks. New bonds offer better yields, so existing bonds must drop in price to compete. The seesaw at work.'
  },
  {
    id: 'post_fr',
    conceptTag: 'forward_rates',
    type: 'choice',
    prompt: 'A forward rate is best described as:',
    options: [
      { value: 'A', text: 'The average interest rate over the life of a bond' },
      { value: 'B', text: 'The marginal rate implied by spot rates for a specific future period' },
      { value: 'C', text: 'The rate set by the central bank for future policy' },
      { value: 'D', text: 'The rate at which a bank will lend money tomorrow' }
    ],
    answer: 'B',
    explanation: 'Forward rates are the "semester grades" hidden inside cumulative GPA. While spot rates give you averages over the whole period, forward rates extract what the market implies for one specific future year. They\'re the fine print of the yield curve.'
  },
  {
    id: 'post_dur',
    conceptTag: 'duration',
    type: 'choice',
    prompt: 'Two bonds both mature in 10 years. <strong>Bond X</strong> has a 2% coupon and <strong>Bond Y</strong> has a 10% coupon. Which has higher duration?',
    options: [
      { value: 'A', text: 'Bond Y \u2014 higher coupon means more cash flow at risk' },
      { value: 'B', text: 'Bond X \u2014 lower coupon means you wait longer for your money' },
      { value: 'C', text: 'They have the same duration \u2014 both mature in 10 years' },
      { value: 'D', text: 'Duration only depends on yield, not coupon' }
    ],
    answer: 'B',
    explanation: 'Bond X\'s tiny 2% coupon means almost all its value is locked up in the big final payment at year 10. Bond Y gets fat coupons along the way, pulling the "centre of gravity" of its cash flows closer to today. Lower coupon \u2192 longer wait \u2192 higher duration \u2192 more sensitive to rate changes.'
  },
  {
    id: 'post_eh',
    conceptTag: 'expectations_hypothesis',
    type: 'choice',
    prompt: 'Under the Expectations Hypothesis, an <strong>inverted yield curve</strong> (long rates below short rates) signals that:',
    options: [
      { value: 'A', text: 'A recession is certain' },
      { value: 'B', text: 'The market expects short-term rates to fall' },
      { value: 'C', text: 'Long bonds carry negative risk premia' },
      { value: 'D', text: 'The central bank has lost control of monetary policy' }
    ],
    answer: 'B',
    explanation: 'Under the EH, the long rate is an average of expected future short rates. If the 10-year rate is below the 2-year rate, the market expects short rates to fall enough to drag the average down. An inverted curve says: "We think rates are heading lower." (Historically this has often preceded recessions \u2014 but the EH only speaks to expectations, not guarantees.)'
  },
  {
    id: 'post_cs',
    conceptTag: 'eh_tests',
    type: 'choice',
    prompt: 'Fama and Bliss (1987) found that <strong>forward-spot spreads</strong>:',
    options: [
      { value: 'A', text: 'Have no forecasting power for bond returns' },
      { value: 'B', text: 'Perfectly forecast future spot rates, as the EH predicts' },
      { value: 'C', text: 'Significantly predict excess bond returns, violating the EH' },
      { value: 'D', text: 'Only predict returns during recessions' }
    ],
    answer: 'C',
    explanation: 'Under the EH, forward-spot spreads should have zero power to predict excess returns (because expected excess returns should be zero). But Fama-Bliss showed they DO predict returns \u2014 meaning the yield curve contains information about time-varying risk premia, not just rate expectations. The EH fails this test.'
  },
  {
    id: 'post_cp',
    conceptTag: 'cochrane_piazzesi',
    type: 'choice',
    prompt: 'Compared to the Fama-Bliss single forward spread, the Cochrane-Piazzesi factor achieves:',
    options: [
      { value: 'A', text: 'About the same R\u00B2 (~5%)' },
      { value: 'B', text: 'A much higher R\u00B2 (~30\u201335%), capturing information across all forwards' },
      { value: 'C', text: 'A lower R\u00B2 but with less overfitting' },
      { value: 'D', text: 'An R\u00B2 of nearly 100%, perfectly predicting returns' }
    ],
    answer: 'B',
    explanation: 'The CP factor uses ALL forward rates, not just a single spread, and achieves R\u00B2 values of 30\u201335% \u2014 vastly outperforming Fama-Bliss\'s ~5%. The entire forward curve contains risk premium information that a single spread misses. It\'s the difference between reading one sentence of a book versus the whole chapter.'
  },
  {
    id: 'post_lsc',
    conceptTag: 'yield_curve_factors',
    type: 'choice',
    prompt: 'The second principal component of the yield curve is called "Slope" because its <strong>loadings</strong> are:',
    options: [
      { value: 'A', text: 'Flat across all maturities' },
      { value: 'B', text: 'Positive for short maturities and negative for long maturities' },
      { value: 'C', text: 'Hump-shaped, peaking at medium maturities' },
      { value: 'D', text: 'Only non-zero for the 10-year yield' }
    ],
    answer: 'B',
    explanation: 'The Slope factor captures "tilting" movements: when short yields rise and long yields fall (or vice versa). The loadings are positive at the short end and negative at the long end \u2014 like a seesaw pivoting around medium maturities. This steepening/flattening of the curve is the second most important source of yield variation.'
  }
];

/* ----------------------------------------------------------
   GAME QUESTIONS  (7 base camps, 2 questions each = 14 total)
   Each camp: Level 1 = recall/concept, Level 2 = deeper application
   ---------------------------------------------------------- */
const GAME_QUESTIONS = {

  /* ---- Base Camp 1: Bond Pricing & Yields ---- */
  bond_pricing: [
    {
      id: 'game_bp_1',
      conceptTag: 'bond_pricing',
      level: 1,
      type: 'choice',
      prompt: 'A zero-coupon bond pays <strong>$1,000 in 10 years</strong>. If market yields increase from 3% to 5%, what happens to this bond\'s price?',
      options: [
        { value: 'A', text: 'It rises, because higher yields reward the bondholder' },
        { value: 'B', text: 'It falls, because future cash flows are discounted more heavily' },
        { value: 'C', text: 'It stays the same \u2014 the face value is contractually fixed' },
        { value: 'D', text: 'It falls initially, then recovers to par as maturity approaches' }
      ],
      answer: 'B',
      explanation: 'Higher yields mean future dollars are worth less today. At 3%, your $1,000 in 10 years is worth about $744. At 5%, it\'s only worth $614 \u2014 a loss of $130! The longer you wait for your money and the higher the discount rate, the bigger the hit.',
      conceptNote: '<strong>The Price\u2013Yield Seesaw</strong><br><br>Here\'s the most fundamental law of fixed income: bond prices and yields move in <em>opposite directions</em>. Always. No exceptions.<br><br>Why? A bond\'s price is the present value of its future cash flows. When you crank up the discount rate (yield), each future dollar shrinks. When you lower it, those future dollars plump up.<br><br>The pricing formula for a zero-coupon bond is:<br>\\(P = \\frac{FV}{(1+y)^n}\\)<br><br><strong>Why does this work?</strong> You\'re answering: "How much do I need to invest today at rate \\(y\\) to grow to \\(FV\\) in \\(n\\) years?" Higher \\(y\\) means you need less today. Lower \\(y\\) means you need more.<br><br>It\'s a seesaw: push yield up, price goes down. Push yield down, price goes up.'
    },
    {
      id: 'game_bp_2',
      conceptTag: 'bond_pricing',
      level: 2,
      type: 'choice',
      prompt: '<strong>Bond A</strong>: 5-year, 8% coupon, trading at <strong>$1,040</strong>.<br><strong>Bond B</strong>: 5-year, 3% coupon, trading at <strong>$920</strong>.<br><br>Which bond has the <strong>higher</strong> yield to maturity?',
      options: [
        { value: 'A', text: 'Bond A \u2014 it has the higher coupon' },
        { value: 'B', text: 'Bond B \u2014 it trades at a deeper discount to par' },
        { value: 'C', text: 'They must have the same YTM since they have the same maturity' },
        { value: 'D', text: 'Cannot determine without calculating' }
      ],
      answer: 'B',
      explanation: 'Bond B trades at $920 \u2014 a deep discount from its $1,000 face value. You\'re buying $1,000 for $920 AND collecting coupons. That capital gain boosts your total return. Bond A trades above par, so you\'re losing $40 at maturity, which drags its yield below the 8% coupon. Discount bonds have YTM > coupon; premium bonds have YTM < coupon.',
      conceptNote: '<strong>Premium vs. Discount: What the Price Tag Tells You</strong><br><br>A bond\'s price relative to par tells a story:<br><br>\u2022 <strong>Premium</strong> (Price > Face Value): You\'re overpaying \u2192 your yield is <em>below</em> the coupon rate. You\'ll lose money at maturity when the bond only pays par.<br><br>\u2022 <strong>Discount</strong> (Price < Face Value): You\'re getting a bargain \u2192 your yield is <em>above</em> the coupon rate. You\'ll gain at maturity when the bond pays you the full face value.<br><br>\u2022 <strong>Par</strong> (Price = Face Value): YTM = Coupon Rate. Everything balances perfectly.<br><br>So you can rank yields just by looking at prices \u2014 no calculator needed!'
    }
  ],

  /* ---- Base Camp 2: Forward Rates ---- */
  forward_rates: [
    {
      id: 'game_fr_1',
      conceptTag: 'forward_rates',
      level: 1,
      type: 'choice',
      prompt: 'The yield curve shows: <strong>1Y spot = 2%, 2Y spot = 3%, 3Y spot = 5%</strong>. Without calculating, what can you conclude about the implied forward rate from year 2 to year 3?',
      options: [
        { value: 'A', text: 'It\'s between 3% and 5%' },
        { value: 'B', text: 'It equals exactly 5%' },
        { value: 'C', text: 'It\'s much higher than 5%' },
        { value: 'D', text: 'It could be negative' }
      ],
      answer: 'C',
      explanation: 'The 3-year spot rate (5%) is the <em>average</em> over all 3 years. But years 1 and 2 have low rates (2% and ~4%). For year 3 to drag the overall average all the way up to 5%, it must be carrying a HUGE rate \u2014 about 9.1%. The steeper the jump in spot rates, the more explosive the forward rate.',
      conceptNote: '<strong>Forward Rates: The Hidden Semester Grade</strong><br><br>Think of spot rates as your cumulative GPA and forward rates as individual semester grades.<br><br>If your cumulative GPA after 3 semesters is 3.5, but your first two semesters were 2.0 and 3.0, what must semester 3 have been? It must have been very high to pull the average up that much.<br><br>Forward rates work the same way. The formula extracts the "marginal" rate:<br>\\(f_{n-1,n} = \\frac{(1+s_n)^n}{(1+s_{n-1})^{n-1}} - 1\\)<br><br><strong>Why does this formula work?</strong> It\'s a no-arbitrage condition. Investing for \\(n\\) years at the spot rate should give the same return as investing for \\(n-1\\) years, then rolling into the forward rate. The formula solves for the rate that makes both strategies equivalent.<br><br>When the spot curve steepens sharply, the forward rate for that period must be enormous \u2014 it\'s doing all the heavy lifting to pull up the average.'
    },
    {
      id: 'game_fr_2',
      conceptTag: 'forward_rates',
      level: 2,
      type: 'interactive',
      prompt: 'Use the interactive yield curve tool below. Set the spot rates to: <strong>1Y = 2%, 2Y = 3%, 3Y = 5%</strong>. What is the implied forward rate from year 2 to year 3?',
      formula: '\\(f_{2,3} = \\frac{(1+s_3)^3}{(1+s_2)^2} - 1 = \\frac{(1.05)^3}{(1.03)^2} - 1\\)',
      answer: 9.12,
      tolerance: 0.25,
      unit: '%',
      explanation: 'f(2,3) = (1.05)\u00B3 / (1.03)\u00B2 \u2212 1 \u2248 <strong>9.12%</strong>. Surprised how big it is? That steep jump from 3% to 5% in spot rates means year 3 is doing <em>enormous</em> work to pull the average up. This is the forward rate magnifying glass in action!',
      conceptNote: '<strong>The Forward Rate Magnifying Glass</strong><br><br>Play with the sliders and watch what happens. Small changes in the spot curve can create <em>huge</em> swings in forward rates.<br><br>A yield curve that looks gently upward-sloping might be hiding a forward rate explosion at the long end. The yield curve is the summary; forward rates are the fine print. Always read the fine print.'
    }
  ],

  /* ---- Base Camp 3: Duration & Risk ---- */
  duration: [
    {
      id: 'game_dur_1',
      conceptTag: 'duration',
      level: 1,
      type: 'choice',
      prompt: 'What makes a bond <strong>more "nervous"</strong> (higher duration) when interest rates change?',
      options: [
        { value: 'A', text: 'Higher coupon, shorter maturity, higher yield' },
        { value: 'B', text: 'Lower coupon, longer maturity, lower yield' },
        { value: 'C', text: 'Higher coupon, longer maturity, higher yield' },
        { value: 'D', text: 'Duration depends only on maturity, nothing else' }
      ],
      answer: 'B',
      explanation: 'All three factors make you <em>wait longer</em> for your money: lower coupons mean less early cash flow, longer maturity pushes the big payment further out, and lower yields make future cash flows relatively more valuable (so changes in rates matter more). A 30-year zero-coupon bond in a low-rate environment is the <em>most nervous</em> bond possible.',
      conceptNote: '<strong>Duration: Your Bond\'s Nervousness Score</strong><br><br>Duration measures how sensitive a bond\'s price is to interest rate changes. Think of it as a "nervousness meter."<br><br>The Macaulay duration formula is a weighted-average of <em>when</em> each cash flow arrives:<br>\\(D = \\sum_{t=1}^{n} t \\times \\frac{PV(CF_t)}{P}\\)<br><br><strong>Why does this work?</strong> Each cash flow\'s present value changes when yields move. Cash flows further in the future get hit harder (more years of compounding). Duration captures this by weighting each time period by its present value share. The higher the weighted-average time, the more sensitive the price.<br><br>Three things dial up the nervousness:<br>\u2022 <strong>Longer maturity</strong> \u2014 more time for compounding to amplify changes<br>\u2022 <strong>Lower coupon</strong> \u2014 you wait longer for your money back<br>\u2022 <strong>Lower yield</strong> \u2014 future cash flows loom larger in PV terms<br><br>A zero-coupon bond is maximum nervousness: duration = maturity. All eggs in one basket.'
    },
    {
      id: 'game_dur_2',
      conceptTag: 'duration',
      level: 2,
      type: 'choice',
      prompt: 'A portfolio manager holds a bond with <strong>modified duration of 7 years</strong>. She fears a <strong>1% rate hike</strong>. The quick estimation formula says:<br><br>\\(\\frac{\\Delta P}{P} \\approx -D^* \\times \\Delta y\\)<br><br>Why does this formula have a <strong>negative sign</strong>?',
      options: [
        { value: 'A', text: 'Because duration itself is always a negative number' },
        { value: 'B', text: 'Because bond prices and yields move in opposite directions' },
        { value: 'C', text: 'The negative sign only applies when yields increase' },
        { value: 'D', text: 'It\'s a mathematical convention with no economic meaning' }
      ],
      answer: 'B',
      explanation: 'The negative sign captures the price-yield seesaw: when yields go UP (positive \u0394y), prices go DOWN (negative \u0394P/P). For our manager: \u0394P/P \u2248 \u22127 \u00D7 0.01 = \u22127%. On a $10 million portfolio, that\'s a $700,000 loss from a single percentage point move. Duration isn\'t just theory \u2014 it\'s the number that keeps portfolio managers awake at night.',
      conceptNote: '<strong>The Duration Formula: Your Instant Price Calculator</strong><br><br>\\(\\frac{\\Delta P}{P} \\approx -D^* \\times \\Delta y\\)<br><br><strong>Why does this formula work?</strong> It\'s a first-order Taylor expansion of the bond price function around the current yield. In plain English:<br><br>1. Bond price is a function of yield: \\(P(y)\\)<br>2. When yield changes by a small \\(\\Delta y\\), the price changes by approximately \\(P\'(y) \\times \\Delta y\\)<br>3. Modified duration \\(D^*\\) is just \\(-P\'(y)/P\\) \u2014 the percentage price sensitivity<br>4. The negative sign appears because \\(P\'(y) < 0\\) (price falls when yield rises)<br><br>So the formula says: <em>"For each 1% change in yield, the bond price changes by approximately (duration)%."</em><br><br>It\'s like saying a car traveling 60 mph covers about 1 mile per minute. Not perfect for large changes (that\'s where convexity helps), but incredibly useful for quick calculations.'
    }
  ],

  /* ---- Base Camp 4: Expectations Hypothesis ---- */
  expectations_hypothesis: [
    {
      id: 'game_eh_1',
      conceptTag: 'expectations_hypothesis',
      level: 1,
      type: 'choice',
      prompt: 'The Expectations Hypothesis makes three equivalent predictions. Which of the following is <strong>NOT</strong> one of them?',
      options: [
        { value: 'A', text: 'Forward rates are unbiased forecasts of future spot rates' },
        { value: 'B', text: 'Expected excess returns on long bonds are zero' },
        { value: 'C', text: 'Long yields equal the average of expected future short rates' },
        { value: 'D', text: 'Bond risk premia increase with maturity' }
      ],
      answer: 'D',
      explanation: 'The EH says there are NO risk premia at all \u2014 expected excess returns are zero regardless of maturity! The three genuine EH predictions (A, B, C) are all equivalent ways of saying: "The yield curve reflects nothing but rate expectations." Option D directly contradicts this by introducing risk premia.',
      conceptNote: '<strong>The Expectations Hypothesis: The "No Drama" Theory</strong><br><br>The EH is the simplest possible theory of the yield curve. It says:<br><br>1. <strong>\\(E[rx_{t+1}^{(n)}] = 0\\)</strong> \u2014 Expected excess returns on long bonds are zero.<br>2. <strong>\\(f_{t}^{(n)} = E_t[y_{t+1}^{(1)}]\\)</strong> \u2014 Forward rates are unbiased forecasts of future short rates.<br>3. <strong>\\(y_t^{(n)} = \\frac{1}{n}\\sum_{j=0}^{n-1} E_t[y_{t+j}^{(1)}]\\)</strong> \u2014 Long yields are averages of expected future short rates.<br><br>These are all the same idea dressed up differently. If the EH holds, the yield curve is a crystal ball that tells you exactly what the market expects short rates to do \u2014 nothing more, nothing less.<br><br>It\'s an elegant theory. It\'s also <em>wrong</em> \u2014 as we\'ll see. But it\'s the essential starting point.'
    },
    {
      id: 'game_eh_2',
      conceptTag: 'expectations_hypothesis',
      level: 2,
      type: 'choice',
      prompt: 'A newspaper headline reads: <em>"Yield curve has inverted \u2014 10-year rates now below 2-year rates."</em> Under the pure Expectations Hypothesis, this inversion means:',
      options: [
        { value: 'A', text: 'A recession is guaranteed within 12 months' },
        { value: 'B', text: 'The market expects short-term rates to fall significantly' },
        { value: 'C', text: 'Long bonds now carry negative risk premia' },
        { value: 'D', text: 'The bond market is broken and mispricing risk' }
      ],
      answer: 'B',
      explanation: 'Under the EH, the long rate is an average of expected future short rates. If the 10-year rate is below the 2-year rate, the market expects short rates to fall enough to drag the 10-year average below today\'s 2-year rate. That\'s a powerful signal. (Historically, inversions have preceded recessions \u2014 but the EH only speaks to expectations, not certainties.)',
      conceptNote: '<strong>Reading the Yield Curve\'s Crystal Ball</strong><br><br>Under the EH, every yield curve shape tells a story:<br><br>\u2022 <strong>Steep upward curve</strong> \u2192 "We expect rates to RISE"<br>\u2022 <strong>Flat curve</strong> \u2192 "We expect rates to stay about the SAME"<br>\u2022 <strong>Inverted curve</strong> \u2192 "We expect rates to FALL"<br><br>The 10-year rate is (approximately) the average of ten expected annual rates. The only way this average can be <em>below</em> today\'s short rate is if many future rates are expected to be lower.<br><br>This is why yield curve inversions are headline news \u2014 they often signal the market sees rate cuts (frequently triggered by recession) on the horizon. But remember: the EH assumes <em>no risk premia</em>. In reality, a steep curve might partly reflect risk premia rather than pure rate expectations.'
    }
  ],

  /* ---- Base Camp 5: Campbell-Shiller & Fama-Bliss ---- */
  eh_tests: [
    {
      id: 'game_cs_1',
      conceptTag: 'eh_tests',
      level: 1,
      type: 'choice',
      prompt: 'Campbell and Shiller (1991) regress future yield changes on the yield spread. Under the EH, the slope coefficient \u03B2 should equal 1. What do they <strong>actually find</strong> in U.S. data?',
      options: [
        { value: 'A', text: '\u03B2 \u2248 1, strongly confirming the EH' },
        { value: 'B', text: '\u03B2 > 1, suggesting yields overreact to the spread' },
        { value: 'C', text: '\u03B2 is negative, especially at longer maturities' },
        { value: 'D', text: '\u03B2 = 0, suggesting yields are completely unpredictable' }
      ],
      answer: 'C',
      explanation: 'The results are a spectacular failure for the EH. Not only is \u03B2 far from 1 \u2014 it\'s actually <em>negative</em> at long maturities! When the spread says "yields should rise," yields actually tend to <em>fall</em>. This means the yield spread is capturing time-varying risk premia rather than pure rate expectations.',
      conceptNote: '<strong>The Campbell-Shiller Test: How the EH Fails</strong><br><br>The test is beautifully simple:<br><br>1. <strong>If the EH is true:</strong> A wide yield spread (long rate \u2212 short rate) means rates are expected to rise. Regress future yield changes on the spread \u2192 \u03B2 should = 1.<br><br>2. <strong>What the data show:</strong> \u03B2 is not just different from 1 \u2014 it\'s <em>negative</em> at longer maturities! When the spread is wide (seemingly predicting rate rises), rates actually tend to <em>fall</em>.<br><br><strong>What went wrong?</strong> The spread mashes together two signals: (a) expected rate changes, and (b) time-varying risk premia. The risk premium component dominates, flipping the sign. When spreads are wide, it\'s mostly because risk premia are high, not because rates are about to rise.<br><br>This is one of the most famous failures in empirical finance.'
    },
    {
      id: 'game_cs_2',
      conceptTag: 'eh_tests',
      level: 2,
      type: 'choice',
      prompt: 'Fama and Bliss (1987) take a complementary approach: they test whether <strong>forward-spot spreads predict excess bond returns</strong>. Under the EH, the R\u00B2 of this regression should be:',
      options: [
        { value: 'A', text: 'Close to 100% \u2014 forwards should predict everything' },
        { value: 'B', text: 'Close to 0% \u2014 excess returns should be unpredictable' },
        { value: 'C', text: 'Exactly 50%' },
        { value: 'D', text: 'It depends on the maturity of the bond' }
      ],
      answer: 'B',
      explanation: 'Under the EH, expected excess returns are <em>zero</em>, so nothing should predict them \u2014 R\u00B2 should be 0%. But Fama-Bliss find R\u00B2 values of about 5\u201312%, meaning forward spreads DO predict excess returns. This was the first clear evidence that bond risk premia are time-varying \u2014 and it motivated Cochrane and Piazzesi to ask: "Can we do even better with more forward rates?"',
      conceptNote: '<strong>The Fama-Bliss Test: Predicting the "Unpredictable"</strong><br><br>The Fama-Bliss regression asks a devastating question:<br><br><em>Can today\'s yield curve predict how much extra return you\'ll earn from holding a long bond versus rolling short-term?</em><br><br>\\(rx_{t+1}^{(n)} = \\alpha + \\beta(f_t^{(n)} - y_t^{(1)}) + \\epsilon_{t+1}\\)<br><br>Under the EH, \\(\\beta = 0\\) and R\u00B2 = 0%. The answer should be "no."<br><br>But Fama-Bliss showed the answer is <strong>"yes"</strong>. Forward-spot spreads predict excess returns with R\u00B2 \u2248 5\u201312%. When forward spreads are wide, long bonds subsequently earn high excess returns.<br><br><strong>The takeaway:</strong> The yield curve contains information about <em>time-varying risk premia</em>, not just rate expectations. The forward-spot spread bundles together an expectations component and a risk premium component \u2014 and the risk premium piece is <em>predictable</em>.'
    }
  ],

  /* ---- Base Camp 6: Cochrane-Piazzesi ---- */
  cochrane_piazzesi: [
    {
      id: 'game_cp_1',
      conceptTag: 'cochrane_piazzesi',
      level: 1,
      type: 'choice',
      prompt: 'Cochrane and Piazzesi (2005) improve on Fama-Bliss by using <strong>all forward rates</strong> to forecast excess returns. Their key finding about the regression loadings on forward rates is:',
      options: [
        { value: 'A', text: 'All forwards receive equal weight' },
        { value: 'B', text: 'Only the 1-year forward matters' },
        { value: 'C', text: 'The loadings form a distinctive "tent shape" \u2014 highest in the middle' },
        { value: 'D', text: 'Only long-term forwards contribute to predictability' }
      ],
      answer: 'C',
      explanation: 'The CP factor\'s famous "tent shape" shows that middle-maturity forwards (around 3\u20134 years) get the highest weights, with declining weights at both the short and long ends. This pattern is not what any simple theory predicts \u2014 it was a genuinely surprising empirical discovery that suggests the risk premium signal is concentrated in the belly of the curve.',
      conceptNote: '<strong>The Cochrane-Piazzesi Factor: Using the Whole Curve</strong><br><br>Fama-Bliss used ONE forward spread. Cochrane and Piazzesi asked: <em>"What if we use ALL the forward rates?"</em><br><br>Their approach:<br>1. Compute the average excess return across 2\u20135 year bonds: \\(\\overline{rx}_{t+1}\\)<br>2. Regress it on all forward rates \\(f_t^{(1)}, f_t^{(2)}, \\ldots, f_t^{(5)}\\)<br>3. The fitted value is the CP factor<br><br>Result? R\u00B2 jumps from ~5% (Fama-Bliss) to ~35% (CP). The entire forward curve contains risk premium information that no single spread captures.<br><br>The loadings form a "tent shape" \u2014 middle-maturity forwards get the highest weight. This distinctive pattern is one of the most important empirical findings in modern fixed income.'
    },
    {
      id: 'game_cp_2',
      conceptTag: 'cochrane_piazzesi',
      level: 2,
      type: 'choice',
      prompt: 'Three stylised facts about <strong>realised excess returns</strong> on U.S. Treasuries are:<br>(i) they are volatile,<br>(ii) they co-move across maturities,<br>(iii) they are large around recessions.<br><br>Which fact is <strong>most problematic</strong> for the Expectations Hypothesis?',
      options: [
        { value: 'A', text: 'Fact (i) \u2014 the EH can\'t handle volatile returns' },
        { value: 'B', text: 'Fact (ii) \u2014 returns at different maturities should be independent' },
        { value: 'C', text: 'Fact (iii) \u2014 excess returns should not vary with the business cycle' },
        { value: 'D', text: 'None \u2014 all three facts are consistent with the EH' }
      ],
      answer: 'C',
      explanation: 'The EH says expected excess returns are ZERO \u2014 they shouldn\'t systematically vary with the business cycle. Seeing large excess returns around recessions means bond risk premia are <em>time-varying and predictable</em> \u2014 a direct violation. Facts (i) and (ii) are about <em>realised</em> returns, which can be volatile and correlated even under the EH. It\'s the <em>predictability</em> in fact (iii) that kills the theory.',
      conceptNote: '<strong>Bond Risk Premia: Why Should They Exist?</strong><br><br>The general asset pricing formula links risk premia to bad times:<br><br>\\(E_t[rx_{t+1}^{(n)}] \\approx -\\text{Cov}_t(m_{t+1}, rx_{t+1}^{(n)})\\)<br><br>If long bonds do badly when times are already bad (when the stochastic discount factor \\(m\\) is high), investors demand a positive risk premium \u2014 the <strong>term premium</strong>.<br><br>Key insight: term premia are <strong>time-varying</strong>. They rise around recessions when risk aversion spikes, and fall in calm times. This is why the CP factor tracks the business cycle \u2014 it measures the market\'s time-varying appetite for duration risk.<br><br>The three stylised facts all point to the same conclusion: bond excess returns are NOT the zero-mean white noise the EH predicts.'
    }
  ],

  /* ---- Base Camp 7: Level, Slope & Curvature ---- */
  yield_curve_factors: [
    {
      id: 'game_lsc_1',
      conceptTag: 'yield_curve_factors',
      level: 1,
      type: 'choice',
      prompt: 'PCA on the yield curve reveals three dominant factors. Match the description: <em>"Medium-term yields move relative to both the short and long ends"</em> \u2014 which factor is this?',
      options: [
        { value: 'A', text: 'Level (PC1) \u2014 parallel shifts in all yields' },
        { value: 'B', text: 'Slope (PC2) \u2014 short vs. long yields move in opposite directions' },
        { value: 'C', text: 'Curvature (PC3) \u2014 the "belly" moves relative to the "wings"' },
        { value: 'D', text: 'This movement can\'t be captured by PCA' }
      ],
      answer: 'C',
      explanation: 'Curvature (PC3) has hump-shaped loadings: positive for medium maturities, negative for short and long ends. It captures "butterfly" moves \u2014 when the belly of the curve rises or falls relative to the wings. While it explains only ~0.4% of total variance, it carries surprising predictive power for returns.',
      conceptNote: '<strong>Three Numbers That Capture (Almost) Everything</strong><br><br>Run PCA on a matrix of yields across maturities and time, and you discover something remarkable: just three factors explain 99.9% of all yield variation.<br><br>\u2022 <strong>Level (PC1, ~97%)</strong>: All yields shift up or down together. The loadings are flat across maturities. <em>"The tide lifts all boats."</em><br><br>\u2022 <strong>Slope (PC2, ~2.5%)</strong>: Short yields move opposite to long yields. The loadings are positive at the short end, negative at the long end. <em>"The seesaw tilts."</em><br><br>\u2022 <strong>Curvature (PC3, ~0.4%)</strong>: Medium-term yields move relative to both ends. The loadings are hump-shaped. <em>"The belly breathes."</em><br><br>This is an empirical fact, not a theoretical prediction \u2014 and it holds across countries and time periods.'
    },
    {
      id: 'game_lsc_2',
      conceptTag: 'yield_curve_factors',
      level: 2,
      type: 'choice',
      prompt: 'Researchers regress future excess bond returns on the three PCA factors. Which factor is <strong>most closely related</strong> to the original Fama-Bliss excess-return predictability result?',
      options: [
        { value: 'A', text: 'Level (PC1)' },
        { value: 'B', text: 'Slope (PC2)' },
        { value: 'C', text: 'Curvature (PC3)' },
        { value: 'D', text: 'None \u2014 PCA factors have no connection to return predictability' }
      ],
      answer: 'B',
      explanation: 'The Slope factor captures the spread between long and short rates \u2014 essentially what Fama-Bliss uses to predict excess returns. Slope alone gets R\u00B2 of about 10\u201315%, similar to Fama-Bliss. But adding Curvature pushes R\u00B2 up further, suggesting the CP factor\'s tent shape partly reflects a combination of Slope and Curvature information.',
      conceptNote: '<strong>From PCA Factors to Return Prediction</strong><br><br>An obvious question: if Level, Slope, and Curvature summarize the yield curve, do they also predict returns?<br><br>Regression: \\(rx_{t+1} = a + b_1 \\cdot Level_t + b_2 \\cdot Slope_t + b_3 \\cdot Curvature_t + \\epsilon_{t+1}\\)<br><br>Results:<br>\u2022 <strong>Level</strong>: weak/no predictive power. Knowing the overall level of rates doesn\'t help much.<br>\u2022 <strong>Slope</strong>: significant predictor, R\u00B2 \u2248 10\u201315%. This is basically the Fama-Bliss result in PCA clothing \u2014 the yield spread IS the slope factor.<br>\u2022 <strong>Curvature</strong>: adds significant predictive power, pushing total R\u00B2 to 20\u201330%.<br><br>An interesting finding: the combination of Slope + Curvature captures much (but not all) of the CP factor\'s predictive power. The CP tent shape is partly a weighted blend of these PCA factors.'
    }
  ]
};

/* ----------------------------------------------------------
   SURVEY QUESTIONS
   ---------------------------------------------------------- */
const SURVEY_CONFIG = {
  selfEfficacy: [
    { conceptTag: 'bond_pricing',            text: 'How confident are you that you can explain the price-yield relationship?' },
    { conceptTag: 'forward_rates',           text: 'How confident are you that you can interpret forward rates from spot rates?' },
    { conceptTag: 'duration',                text: 'How confident are you that you can use duration to assess interest rate risk?' },
    { conceptTag: 'expectations_hypothesis', text: 'How confident are you that you can explain the Expectations Hypothesis?' },
    { conceptTag: 'eh_tests',                text: 'How confident are you that you can describe Campbell-Shiller and Fama-Bliss findings?' },
    { conceptTag: 'cochrane_piazzesi',       text: 'How confident are you that you can explain the Cochrane-Piazzesi factor?' },
    { conceptTag: 'yield_curve_factors',     text: 'How confident are you that you can interpret Level, Slope, and Curvature?' }
  ],
  engagement: [
    { id: 'engaging',       text: 'How engaging did you find this game?' },
    { id: 'prefer_format',  text: 'Would you prefer this game format over a traditional tutorial?' }
  ],
  openText: [
    { id: 'most_difficult', text: 'What concept was most difficult for you?' },
    { id: 'suggestions',    text: 'Any suggestions for improvement?' }
  ],
  selfReport: [
    { id: 'pre_understanding',  text: 'Before the game, how would you rate your understanding of fixed income concepts?' },
    { id: 'post_understanding', text: 'After the game, how would you rate your understanding of fixed income concepts?' }
  ]
};

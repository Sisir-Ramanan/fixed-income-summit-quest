/* ============================================================
   questions.js  –  Fixed Income Summit Quest
   7 concepts, 3 pre/post, 7 game questions (1 per camp)
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
   PRE-QUIZ  (3 conceptual questions spanning the course)
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
   POST-QUIZ  (3 conceptual questions, isomorphic to pre-quiz)
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
   GAME QUESTIONS  (7 base camps, 1 question each = 7 total)
   ---------------------------------------------------------- */
const GAME_QUESTIONS = {

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
    }
  ],

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
    }
  ],

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
    }
  ],

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
    }
  ],

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
    }
  ],

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
    }
  ],

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

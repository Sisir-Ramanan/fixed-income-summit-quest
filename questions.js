/* ============================================================
   questions.js  –  Fixed Income Summit Quest
   All question banks: pre-quiz, game (per base-camp), post-quiz
   Each question carries a conceptTag for per-concept analytics.
   ============================================================ */

const CONCEPTS = [
  { id: 'bond_pricing',            label: 'Bond Pricing Basics' },
  { id: 'ytm',                     label: 'Yield Measures' },
  { id: 'forward_rates',           label: 'Forward Rates & Yield Curves' },
  { id: 'duration',                label: 'Duration & Risk' },
  { id: 'expectations_hypothesis', label: 'Expectations Hypothesis' }
];

/* ----------------------------------------------------------
   PRE-QUIZ  (5 questions, one per concept)
   ---------------------------------------------------------- */
const PRE_QUIZ = [
  {
    id: 'pre_bp',
    conceptTag: 'bond_pricing',
    type: 'numeric',
    prompt: 'A <strong>3-year zero-coupon bond</strong> has a face value of $100 and an annual yield of 4%. What is its price?',
    formula: '\\(P = \\frac{FV}{(1+y)^n} = \\frac{100}{(1.04)^3}\\)',
    answer: 88.90,
    tolerance: 0.50,
    unit: '$',
    explanation: 'The price of a zero-coupon bond is the face value discounted at the yield: $100 / (1.04)\u00B3 = $88.90.'
  },
  {
    id: 'pre_ytm',
    conceptTag: 'ytm',
    type: 'choice',
    prompt: 'A bond with face value $1,000, a <strong>5% annual coupon</strong>, and 3 years to maturity is trading at <strong>$960</strong>. Which best describes its yield to maturity?',
    options: [
      { value: 'A', text: 'Less than 5%' },
      { value: 'B', text: 'Exactly 5%' },
      { value: 'C', text: 'Greater than 5%' },
      { value: 'D', text: 'Cannot be determined' }
    ],
    answer: 'C',
    explanation: 'When a bond trades below par, the YTM exceeds the coupon rate because the investor also earns a capital gain at maturity.'
  },
  {
    id: 'pre_fr',
    conceptTag: 'forward_rates',
    type: 'numeric',
    prompt: 'The 1-year spot rate is <strong>3%</strong> and the 2-year spot rate is <strong>4%</strong>. What is the implied 1-year forward rate one year from now?',
    formula: '\\(f_{1,2} = \\frac{(1+s_2)^2}{(1+s_1)} - 1\\)',
    answer: 5.01,
    tolerance: 0.15,
    unit: '%',
    explanation: 'f(1,2) = (1.04)\u00B2 / 1.03 \u2212 1 = 1.0816 / 1.03 \u2212 1 \u2248 5.01%. The forward rate is the break-even rate for year 2 implied by the two spot rates.'
  },
  {
    id: 'pre_dur',
    conceptTag: 'duration',
    type: 'numeric',
    prompt: 'A <strong>5-year zero-coupon bond</strong> has an annual yield of 6%. What is its Macaulay duration (in years)?',
    answer: 5.00,
    tolerance: 0.10,
    unit: 'years',
    explanation: 'A zero-coupon bond\u2019s Macaulay duration always equals its maturity, because the single cash flow occurs at maturity. Duration = 5 years.'
  },
  {
    id: 'pre_eh',
    conceptTag: 'expectations_hypothesis',
    type: 'choice',
    prompt: 'According to the <strong>pure expectations hypothesis</strong>, a steep upward-sloping yield curve implies:',
    options: [
      { value: 'A', text: 'Markets expect future short-term rates to rise' },
      { value: 'B', text: 'Markets expect future short-term rates to fall' },
      { value: 'C', text: 'There is a large term premium' },
      { value: 'D', text: 'Bonds are mispriced' }
    ],
    answer: 'A',
    explanation: 'Under the pure EH, long rates are averages of expected future short rates. A steep curve means the market expects short rates to increase.'
  }
];

/* ----------------------------------------------------------
   POST-QUIZ  (5 questions, isomorphic to pre-quiz)
   Same concepts, different numbers / wording / framing
   ---------------------------------------------------------- */
const POST_QUIZ = [
  {
    id: 'post_bp',
    conceptTag: 'bond_pricing',
    type: 'numeric',
    prompt: 'A <strong>4-year zero-coupon bond</strong> has a face value of $100 and an annual yield of 5%. What is its price?',
    formula: '\\(P = \\frac{100}{(1.05)^4}\\)',
    answer: 82.27,
    tolerance: 0.50,
    unit: '$',
    explanation: 'Price = $100 / (1.05)\u2074 = $100 / 1.2155 = $82.27.'
  },
  {
    id: 'post_ytm',
    conceptTag: 'ytm',
    type: 'choice',
    prompt: 'A bond with face value $1,000, a <strong>6% annual coupon</strong>, and 4 years to maturity is trading at <strong>$1,050</strong>. Which best describes its yield to maturity?',
    options: [
      { value: 'A', text: 'Less than 6%' },
      { value: 'B', text: 'Exactly 6%' },
      { value: 'C', text: 'Greater than 6%' },
      { value: 'D', text: 'Cannot be determined' }
    ],
    answer: 'A',
    explanation: 'When a bond trades above par (at a premium), the YTM is less than the coupon rate. The investor pays more than face value, reducing the effective yield.'
  },
  {
    id: 'post_fr',
    conceptTag: 'forward_rates',
    type: 'numeric',
    prompt: 'The 1-year spot rate is <strong>2%</strong> and the 2-year spot rate is <strong>3.5%</strong>. What is the implied 1-year forward rate one year from now?',
    formula: '\\(f_{1,2} = \\frac{(1.035)^2}{1.02} - 1\\)',
    answer: 5.02,
    tolerance: 0.15,
    unit: '%',
    explanation: 'f(1,2) = (1.035)\u00B2 / 1.02 \u2212 1 = 1.07122 / 1.02 \u2212 1 \u2248 5.02%.'
  },
  {
    id: 'post_dur',
    conceptTag: 'duration',
    type: 'numeric',
    prompt: 'A <strong>3-year zero-coupon bond</strong> has an annual yield of 4%. What is its Macaulay duration (in years)?',
    answer: 3.00,
    tolerance: 0.10,
    unit: 'years',
    explanation: 'A zero-coupon bond\u2019s Macaulay duration equals its maturity. Duration = 3 years.'
  },
  {
    id: 'post_eh',
    conceptTag: 'expectations_hypothesis',
    type: 'choice',
    prompt: 'According to the <strong>pure expectations hypothesis</strong>, a flat yield curve implies:',
    options: [
      { value: 'A', text: 'Markets expect future short-term rates to remain roughly unchanged' },
      { value: 'B', text: 'Markets expect future short-term rates to rise sharply' },
      { value: 'C', text: 'There is a large negative term premium' },
      { value: 'D', text: 'The economy is necessarily in recession' }
    ],
    answer: 'A',
    explanation: 'Under the EH, a flat curve means the market expects future short rates to stay near current levels \u2014 no significant changes anticipated.'
  }
];

/* ----------------------------------------------------------
   GAME QUESTIONS  (organised by base-camp / concept)
   Each base camp has 2-3 questions with escalating difficulty:
     Level 1 = recognition / recall
     Level 2 = application / calculation
     Level 3 = transfer / analysis  (where present)
   ---------------------------------------------------------- */
const GAME_QUESTIONS = {

  /* ---- Base Camp 1: Bond Pricing Basics ---- */
  bond_pricing: [
    {
      id: 'game_bp_1',
      conceptTag: 'bond_pricing',
      level: 1,
      type: 'choice',
      prompt: 'Which of the following correctly describes the relationship between bond prices and yields?',
      options: [
        { value: 'A', text: 'They move in the same direction' },
        { value: 'B', text: 'They move in opposite directions' },
        { value: 'C', text: 'They are unrelated' },
        { value: 'D', text: 'The relationship depends on the coupon rate only' }
      ],
      answer: 'B',
      explanation: 'Bond prices and yields have an inverse relationship. When yields rise, the present value of future cash flows falls, so the bond price decreases, and vice versa.',
      conceptNote: 'A bond\u2019s price is the present value of its cash flows, discounted at the yield. Since the yield appears in the denominator, a higher yield means a lower price.'
    },
    {
      id: 'game_bp_2',
      conceptTag: 'bond_pricing',
      level: 2,
      type: 'numeric',
      prompt: 'Calculate the price of a <strong>5-year zero-coupon bond</strong> with face value <strong>$1,000</strong> and an annual yield of <strong>3.5%</strong>. Round to 2 decimal places.',
      formula: '\\(P = \\frac{1000}{(1.035)^5}\\)',
      answer: 841.97,
      tolerance: 1.50,
      unit: '$',
      explanation: 'P = 1000 / (1.035)\u2075 = 1000 / 1.18769 \u2248 $841.97. Each year of discounting reduces the present value further.',
      conceptNote: 'Zero-coupon bonds are the simplest to price \u2014 just discount the single face-value payment. The longer the maturity and higher the yield, the lower the price.'
    }
  ],

  /* ---- Base Camp 2: Yield Measures ---- */
  ytm: [
    {
      id: 'game_ytm_1',
      conceptTag: 'ytm',
      level: 1,
      type: 'choice',
      prompt: 'Yield to maturity (YTM) is best described as:',
      options: [
        { value: 'A', text: 'The coupon rate divided by the current bond price' },
        { value: 'B', text: 'The single discount rate that equates the present value of all future cash flows to the current price' },
        { value: 'C', text: 'The annual return if the bond is sold after one year' },
        { value: 'D', text: 'The spread between the bond yield and the risk-free rate' }
      ],
      answer: 'B',
      explanation: 'YTM is the internal rate of return of the bond \u2014 the single discount rate that makes the present value of all future coupons and the face value equal to today\u2019s market price.',
      conceptNote: 'YTM summarises the total return from holding a bond to maturity, accounting for coupon income, the time value of money, and any capital gain or loss.'
    },
    {
      id: 'game_ytm_2',
      conceptTag: 'ytm',
      level: 2,
      type: 'numeric',
      prompt: 'A <strong>3-year bond</strong> pays a <strong>5% annual coupon</strong> on a $100 face value and is priced at <strong>par ($100)</strong>. What is its yield to maturity?',
      formula: '\\(\\text{When Price} = \\text{Par} \\Rightarrow \\text{YTM} = \\text{Coupon Rate}\\)',
      answer: 5.00,
      tolerance: 0.10,
      unit: '%',
      explanation: 'When a bond is priced at par, its YTM equals its coupon rate. Since $100 price = $100 face value, the YTM is exactly 5%.',
      conceptNote: 'This is a key rule: Price = Par \u21D2 YTM = Coupon Rate. Price < Par \u21D2 YTM > Coupon Rate. Price > Par \u21D2 YTM < Coupon Rate.'
    },
    {
      id: 'game_ytm_3',
      conceptTag: 'ytm',
      level: 3,
      type: 'choice',
      prompt: 'Consider two bonds with <strong>5-year maturities</strong>: Bond A has a 2% coupon and Bond B has an 8% coupon. If yields rise by 1%, which bond experiences a <strong>larger percentage price decline</strong>?',
      options: [
        { value: 'A', text: 'Bond A (the lower-coupon bond)' },
        { value: 'B', text: 'Bond B (the higher-coupon bond)' },
        { value: 'C', text: 'Both decline by exactly the same percentage' },
        { value: 'D', text: 'Neither bond\u2019s price declines when yields rise' }
      ],
      answer: 'A',
      explanation: 'Lower-coupon bonds have higher duration because more of their value is concentrated in the distant face-value payment. Higher duration means greater price sensitivity to yield changes.',
      conceptNote: 'Duration links coupon structure to interest rate risk. Low coupon \u2192 higher duration \u2192 more sensitivity. This is why zero-coupon bonds have the highest duration for a given maturity.'
    }
  ],

  /* ---- Base Camp 3: Forward Rates & Yield Curves ---- */
  forward_rates: [
    {
      id: 'game_fr_1',
      conceptTag: 'forward_rates',
      level: 1,
      type: 'choice',
      prompt: 'A forward rate \\(f_{1,2}\\) represents:',
      options: [
        { value: 'A', text: 'Today\u2019s 1-year spot rate' },
        { value: 'B', text: 'The implied interest rate for borrowing between year 1 and year 2, as seen from today' },
        { value: 'C', text: 'The simple average of all spot rates' },
        { value: 'D', text: 'The yield on a 2-year coupon bond' }
      ],
      answer: 'B',
      explanation: 'A forward rate f(1,2) is the interest rate implied by today\u2019s term structure for the period between year 1 and year 2. It\u2019s the rate that makes investing for 1 year then rolling over equivalent to investing for 2 years today.',
      conceptNote: 'Forward rates are extracted from the current yield curve using no-arbitrage logic: (1+s\u2082)\u00B2 = (1+s\u2081)(1+f\u2081\u200A\u2082). They represent the market\u2019s break-even rates for future periods.'
    },
    {
      id: 'game_fr_2',
      conceptTag: 'forward_rates',
      level: 2,
      type: 'numeric',
      prompt: 'Given: 1-year spot rate = <strong>3%</strong>, 2-year spot rate = <strong>3.5%</strong>, 3-year spot rate = <strong>4.2%</strong>. Calculate the implied 1-year forward rate from <strong>year 2 to year 3</strong>.',
      formula: '\\(f_{2,3} = \\frac{(1+s_3)^3}{(1+s_2)^2} - 1\\)',
      answer: 5.61,
      tolerance: 0.15,
      unit: '%',
      explanation: 'f(2,3) = (1.042)\u00B3 / (1.035)\u00B2 \u2212 1 = 1.13137 / 1.07122 \u2212 1 \u2248 5.61%. Notice the forward rate is higher than any spot rate \u2014 the curve is accelerating upward.',
      conceptNote: 'When the yield curve is upward-sloping, forward rates exceed spot rates. The marginal (forward) rate for each additional year must be high enough to pull the average (spot rate) up.'
    },
    {
      id: 'game_fr_3',
      conceptTag: 'forward_rates',
      level: 3,
      type: 'interactive',
      prompt: 'Use the interactive yield curve tool below. Set the spot rates to: <strong>1Y = 2%, 2Y = 3%, 3Y = 5%</strong>. What is the implied forward rate from year 2 to year 3?',
      formula: '\\(f_{2,3} = \\frac{(1+s_3)^3}{(1+s_2)^2} - 1 = \\frac{(1.05)^3}{(1.03)^2} - 1\\)',
      answer: 9.12,
      tolerance: 0.25,
      unit: '%',
      explanation: 'f(2,3) = (1.05)\u00B3 / (1.03)\u00B2 \u2212 1 = 1.15763 / 1.0609 \u2212 1 \u2248 9.12%. The steep jump from 3% to 5% implies a very high forward rate for year 3 \u2014 illustrating how small spot-rate differences can produce large forward rates.',
      conceptNote: 'This interactive demonstrates a key insight: forward rates magnify differences in the spot curve. A yield curve that looks mildly steep can imply dramatically high forward rates at the long end.'
    }
  ],

  /* ---- Base Camp 4: Duration & Risk ---- */
  duration: [
    {
      id: 'game_dur_1',
      conceptTag: 'duration',
      level: 1,
      type: 'choice',
      prompt: 'Duration primarily measures a bond\u2019s sensitivity to:',
      options: [
        { value: 'A', text: 'Credit (default) risk' },
        { value: 'B', text: 'Inflation risk' },
        { value: 'C', text: 'Interest rate changes' },
        { value: 'D', text: 'Liquidity risk' }
      ],
      answer: 'C',
      explanation: 'Duration measures how much a bond\u2019s price changes when interest rates move. A higher duration means greater price sensitivity to yield changes.',
      conceptNote: 'Macaulay duration is the weighted-average time to receive a bond\u2019s cash flows. Modified duration converts this into a direct measure of price sensitivity: \u0394P/P \u2248 \u2212D* \u00D7 \u0394y.'
    },
    {
      id: 'game_dur_2',
      conceptTag: 'duration',
      level: 2,
      type: 'numeric',
      prompt: 'A bond has a <strong>modified duration of 4.5 years</strong>. If yields <strong>increase by 0.5%</strong> (50 basis points), approximately what is the <strong>percentage price change</strong>?',
      formula: '\\(\\frac{\\Delta P}{P} \\approx -D^* \\times \\Delta y = -4.5 \\times 0.005\\)',
      answer: -2.25,
      tolerance: 0.10,
      unit: '%',
      explanation: '\u0394P/P \u2248 \u22124.5 \u00D7 0.005 = \u22120.0225 = \u22122.25%. The negative sign indicates a price decline when yields rise.',
      conceptNote: 'The duration approximation is linear and works well for small yield changes. For large changes, convexity (the second-order term) also matters. Note: enter a negative number since the price falls.'
    },
    {
      id: 'game_dur_3',
      conceptTag: 'duration',
      level: 3,
      type: 'choice',
      prompt: 'Rank these bonds from <strong>highest to lowest duration</strong>:<br>(A) 10-year zero-coupon<br>(B) 10-year 8% coupon<br>(C) 5-year zero-coupon<br>(D) 30-year 6% coupon',
      options: [
        { value: 'A', text: 'D, A, B, C' },
        { value: 'B', text: 'A, D, B, C' },
        { value: 'C', text: 'D, A, C, B' },
        { value: 'D', text: 'A, B, D, C' }
      ],
      answer: 'A',
      explanation: 'The 30-year 6% coupon bond (\u224814\u201315 yrs duration) > 10-year zero (10 yrs) > 10-year 8% coupon (\u22487\u20138 yrs) > 5-year zero (5 yrs). Longer maturity and lower coupons increase duration.',
      conceptNote: 'Duration depends on both maturity and coupon structure. A 30-year coupon bond can have higher duration than a 10-year zero because the long maturity dominates, even though coupons reduce duration.'
    }
  ],

  /* ---- Base Camp 5 (Summit): Expectations Hypothesis ---- */
  expectations_hypothesis: [
    {
      id: 'game_eh_1',
      conceptTag: 'expectations_hypothesis',
      level: 1,
      type: 'choice',
      prompt: 'The pure expectations hypothesis predicts that:',
      options: [
        { value: 'A', text: 'Long-term rates equal the average of expected future short-term rates' },
        { value: 'B', text: 'Longer maturity bonds always have higher yields' },
        { value: 'C', text: 'Forward rates are unbiased predictors of future spot rates' },
        { value: 'D', text: 'Both A and C' }
      ],
      answer: 'D',
      explanation: 'The pure EH has two equivalent implications: (1) long rates are averages of expected future short rates, and (2) forward rates are unbiased predictors of future spot rates. Both follow from assuming no term premium.',
      conceptNote: 'The EH is a benchmark theory. It says the only reason long rates differ from short rates is because of expected rate changes \u2014 not because investors demand extra compensation (term premia) for holding longer bonds.'
    },
    {
      id: 'game_eh_2',
      conceptTag: 'expectations_hypothesis',
      level: 2,
      type: 'numeric',
      prompt: 'Under the expectations hypothesis, the current 1-year rate is <strong>3%</strong> and the market expects the 1-year rate next year to be <strong>5%</strong>. What should the current <strong>2-year spot rate</strong> be?',
      formula: '\\(s_2 = \\sqrt{(1+s_1)(1+E[r_1])} - 1 = \\sqrt{1.03 \\times 1.05} - 1\\)',
      answer: 4.00,
      tolerance: 0.10,
      unit: '%',
      explanation: 's\u2082 = \u221A(1.03 \u00D7 1.05) \u2212 1 = \u221A1.0815 \u2212 1 \u2248 3.995% \u2248 4.00%. The 2-year rate is the geometric mean of the current and expected future 1-year rates.',
      conceptNote: 'Under the EH, the 2-year rate must make investors indifferent between (a) locking in 2 years at s\u2082, and (b) investing for 1 year at s\u2081 then rolling over at the expected future rate.'
    },
    {
      id: 'game_eh_3',
      conceptTag: 'expectations_hypothesis',
      level: 3,
      type: 'choice',
      prompt: 'The yield curve shows: 1Y = 4%, 2Y = 5%, 3Y = 5.5%. The implied forwards are f(1,2) = 6.01% and f(2,3) = 6.51%. If you believe actual future 1-year rates will be <strong>5.5%</strong> and <strong>5.8%</strong>, what does this suggest?',
      options: [
        { value: 'A', text: 'The expectations hypothesis holds \u2014 forwards match expectations' },
        { value: 'B', text: 'Term premia exist \u2014 forwards exceed expected rates, indicating compensation for risk' },
        { value: 'C', text: 'Bonds are significantly overpriced' },
        { value: 'D', text: 'The yield curve will definitely invert soon' }
      ],
      answer: 'B',
      explanation: 'The forward rates (6.01%, 6.51%) are higher than expected future rates (5.5%, 5.8%). This gap suggests term premia \u2014 investors demand extra compensation for holding longer-maturity bonds, violating the pure EH.',
      conceptNote: 'In practice, forward rates usually exceed realised future rates, implying positive term premia. This is one of the most important findings in empirical fixed income \u2014 the EH is a useful benchmark but typically fails in the data.'
    }
  ]
};

/* ----------------------------------------------------------
   SURVEY QUESTIONS
   ---------------------------------------------------------- */
const SURVEY_CONFIG = {
  selfEfficacy: [
    { conceptTag: 'bond_pricing',            text: 'How confident are you that you can calculate the price of a zero-coupon bond?' },
    { conceptTag: 'ytm',                     text: 'How confident are you that you can determine yield to maturity from bond characteristics?' },
    { conceptTag: 'forward_rates',           text: 'How confident are you that you can calculate forward rates from spot rates?' },
    { conceptTag: 'duration',                text: 'How confident are you that you can use duration to estimate price changes?' },
    { conceptTag: 'expectations_hypothesis', text: 'How confident are you that you can interpret the yield curve using the expectations hypothesis?' }
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

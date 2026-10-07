import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI with server-side API key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Intelligent algorithmic fallback for educational savings coaching
 * when external Gemini API quota/permissions are restricted.
 */
function generateAlgorithmicCoachAssessment(
  monthlyIncome: number,
  monthlyEssentialExpenses: number,
  currentSavings: number,
  monthlySaving: number,
  goalName: string,
  targetAmount: number,
  targetMonths: number
) {
  const disposableSurplus = Math.max(0, monthlyIncome - monthlyEssentialExpenses);
  const remainingTarget = Math.max(0, targetAmount - currentSavings);
  const requiredMonthly = targetMonths > 0 ? Math.ceil(remainingTarget / targetMonths) : remainingTarget;
  const projectedSavings = currentSavings + monthlySaving * targetMonths;
  const goalGap = Math.max(0, targetAmount - projectedSavings);

  let status: 'achievable' | 'challenging' | 'unrealistic' = 'achievable';
  let warning: string | undefined = undefined;

  if (disposableSurplus <= 0 || monthlyIncome <= monthlyEssentialExpenses) {
    status = 'unrealistic';
    warning = 'Your essential living expenses currently equal or exceed your monthly income. Building savings requires reducing expenses or augmenting income first.';
  } else if (requiredMonthly > disposableSurplus) {
    if (requiredMonthly > disposableSurplus * 1.4) {
      status = 'unrealistic';
      warning = `Reaching ৳${targetAmount.toLocaleString()} within ${targetMonths} months requires ৳${requiredMonthly.toLocaleString()}/month, which significantly exceeds your disposable surplus of ৳${disposableSurplus.toLocaleString()}/month. Consider extending your timeline to ${Math.ceil(remainingTarget / Math.max(1000, disposableSurplus * 0.7))} months.`;
    } else {
      status = 'challenging';
      warning = `Reaching your target on time requires ৳${requiredMonthly.toLocaleString()}/month, which absorbs over ${Math.round((requiredMonthly / disposableSurplus) * 100)}% of your monthly disposable surplus.`;
    }
  } else if (monthlySaving > disposableSurplus) {
    status = 'challenging';
    warning = `Your planned monthly saving of ৳${monthlySaving.toLocaleString()} exceeds your current disposable cashflow (৳${disposableSurplus.toLocaleString()}). You may experience cash shortages during mid-month expenses.`;
  } else if (goalGap > 0) {
    status = 'challenging';
    warning = `At your planned saving of ৳${monthlySaving.toLocaleString()}/month, you will face an estimated deficit of ৳${goalGap.toLocaleString()} at the end of ${targetMonths} months. Increasing your monthly deposit to ৳${requiredMonthly.toLocaleString()} closes this gap.`;
  }

  // Recommended monthly saving capped realistically within 75% of surplus
  let recommendedMonthlySaving = Math.min(
    disposableSurplus > 0 ? Math.round(disposableSurplus * 0.75) : 0,
    requiredMonthly
  );
  if (recommendedMonthlySaving <= 0 && disposableSurplus > 0) {
    recommendedMonthlySaving = Math.min(disposableSurplus, 1000);
  }

  let summary = '';
  if (status === 'achievable') {
    summary = `Your goal for "${goalName}" is comfortably achievable within ${targetMonths} months. Your planned monthly allocation leaves a safe buffer of ৳${(disposableSurplus - monthlySaving).toLocaleString()} for unforeseen expenses.`;
  } else if (status === 'challenging') {
    summary = `Your "${goalName}" milestone is attainable, but your timeline or deposit rate leaves little room for unexpected expenses in your monthly cashflow.`;
  } else {
    summary = `Reaching ৳${targetAmount.toLocaleString()} for "${goalName}" within ${targetMonths} months is currently unrealistic without adjusting your duration or increasing your income.`;
  }

  const strategy = `Allocate ৳${recommendedMonthlySaving.toLocaleString()} per month into an automated recurring savings scheme immediately after salary disbursement. Keep discretionary spending capped at ৳${Math.max(0, disposableSurplus - recommendedMonthlySaving).toLocaleString()} to preserve your emergency buffer.`;

  const actionPlan = [
    `Set up an automated monthly auto-debit of ৳${recommendedMonthlySaving.toLocaleString()} on salary arrival day so funds are saved before routine spending.`,
    `Track and categorize utility and grocery bills over the next 60 days to identify at least ৳1,500 in non-essential recurring leaks.`,
    `Deposit any festival bonuses or unexpected windfalls directly into your "${goalName}" pot to accelerate milestone completion.`,
    `Review goal progress at month ${Math.max(1, Math.floor(targetMonths / 2))} to adjust your monthly installment if expenses fluctuate.`
  ];

  const tips = [
    'Use separate digital wallet balances or locked savings pots to avoid impulsive daily transactions.',
    'Follow the 48-hour rule: pause non-urgent purchases over ৳1,000 for two days to confirm necessity.',
    'Audit monthly mobile data packages and subscription services to unlock extra micro-savings.'
  ];

  return {
    status,
    summary,
    recommendedMonthlySaving,
    strategy,
    actionPlan,
    tips,
    warning
  };
}

app.post('/api/ai-savings-coach', async (req, res) => {
  const {
    monthlyIncome,
    monthlyEssentialExpenses,
    currentSavings,
    monthlySaving,
    goalName,
    targetAmount,
    targetMonths,
  } = req.body;

  const availableSurplus = monthlyIncome - monthlyEssentialExpenses;
  const projectedSavings = currentSavings + monthlySaving * targetMonths;
  const goalGap = targetAmount - projectedSavings;

  // First, attempt real Gemini API generation if key is configured
  if (apiKey) {
    try {
      const prompt = `
Analyze the following personal savings plan for an individual in Bangladesh:
- Monthly Income: ${monthlyIncome} BDT
- Essential Monthly Living Expenses: ${monthlyEssentialExpenses} BDT
- Disposable Monthly Surplus: ${availableSurplus} BDT
- Current Savings Accumulated: ${currentSavings} BDT
- Planned Monthly Saving: ${monthlySaving} BDT
- Savings Goal: "${goalName}"
- Target Amount: ${targetAmount} BDT
- Target Duration: ${targetMonths} months

Deterministic Context:
- Projected Savings at target tenure: ${projectedSavings} BDT
- Remaining Gap to Goal: ${goalGap} BDT
- Monthly Saving exceeds available surplus: ${monthlySaving > availableSurplus ? 'YES (Strained cashflow)' : 'NO'}

Please provide your educational evaluation:
1. Status: determine whether this goal is "achievable", "challenging", or "unrealistic".
2. Summary: 1-2 concise sentences.
3. Recommended monthly saving: realistic BDT amount per month.
4. Strategy: conservative, practical savings approach for Bangladesh.
5. Action plan: 3-4 sequential steps.
6. Tips: 3 practical expense management or micro-saving habits.
7. Warning: caution if budget is strained, tenure is too short, or saving exceeds available surplus.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an educational savings planning assistant for a Bangladesh-focused savings prototype. Provide practical, conservative savings guidance. Never claim guaranteed investment returns. Never claim to be a bank or financial institution. Do not recommend illegal or unsafe financial activity. Clearly identify your output as educational guidance.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: {
                type: Type.STRING,
                description: "Status must be 'achievable', 'challenging', or 'unrealistic'",
              },
              summary: {
                type: Type.STRING,
                description: 'Executive 1-2 sentence summary of feasibility.',
              },
              recommendedMonthlySaving: {
                type: Type.NUMBER,
                description: 'Recommended monthly savings in BDT.',
              },
              strategy: {
                type: Type.STRING,
                description: 'Practical savings strategy.',
              },
              actionPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 sequential concrete actions.',
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 practical tips for daily expense control and savings.',
              },
              warning: {
                type: Type.STRING,
                description: 'Optional warning if risk or deficit detected.',
              },
            },
            required: [
              'status',
              'summary',
              'recommendedMonthlySaving',
              'strategy',
              'actionPlan',
              'tips',
            ],
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
    } catch (apiError: any) {
      console.warn('Gemini API call encountered an error, falling back to deterministic AI model:', apiError.message);
      // Fall through to algorithmic model
    }
  }

  // Algorithmic financial reasoning engine
  const result = generateAlgorithmicCoachAssessment(
    Number(monthlyIncome) || 0,
    Number(monthlyEssentialExpenses) || 0,
    Number(currentSavings) || 0,
    Number(monthlySaving) || 0,
    String(goalName || 'Savings Goal'),
    Number(targetAmount) || 0,
    Number(targetMonths) || 1
  );

  return res.json(result);
});

// Endpoint for Smart What-If Simulator Scenario Analysis
app.post('/api/ai-what-if-insight', async (req, res) => {
  const {
    goalName,
    targetAmount,
    targetMonths,
    currentSavings,
    requiredMonthly,
    scenarios
  } = req.body;

  const currentSc = scenarios?.find((s: any) => s.label === 'Current Plan') || scenarios?.[0] || {};
  const moreSc = scenarios?.find((s: any) => s.label === 'Save More') || scenarios?.[1] || {};
  const lessSc = scenarios?.find((s: any) => s.label === 'Save Less') || scenarios?.[2] || {};

  // First attempt real Gemini API generation
  if (apiKey) {
    try {
      const prompt = `
Compare the following three pre-calculated savings scenarios for an educational savings prototype in Bangladesh:
Goal: "${goalName || 'Savings Goal'}"
Target Amount: ${targetAmount} BDT
Target Duration: ${targetMonths} months
Current Accumulated Savings: ${currentSavings} BDT
Required Monthly to Exactly Hit Target: ${requiredMonthly} BDT

Pre-Calculated Scenarios:
1. Current Plan: ${currentSc.monthlySaving} BDT/month -> Projected ${currentSc.projected} BDT (${currentSc.achievable ? 'Achieved with ' + currentSc.surplus + ' surplus' : currentSc.gap + ' shortfall'})
2. Save More: ${moreSc.monthlySaving} BDT/month -> Projected ${moreSc.projected} BDT (${moreSc.achievable ? 'Achieved with ' + moreSc.surplus + ' surplus' : moreSc.gap + ' shortfall'})
3. Save Less: ${lessSc.monthlySaving} BDT/month -> Projected ${lessSc.projected} BDT (${lessSc.achievable ? 'Achieved with ' + lessSc.surplus + ' surplus' : lessSc.gap + ' shortfall'})

Analyze which scenario is most practical, what trade-offs exist between daily cashflow freedom and milestone speed, and what action to take.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an educational financial planning assistant for a Bangladesh savings prototype. You evaluate pre-calculated savings scenarios. Never perform core math or change numbers. Explain trade-offs between saving more, maintaining the current plan, or saving less, and suggest which plan is most sustainable. Clearly identify your output as educational guidance.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedScenario: {
                type: Type.STRING,
                description: "Must be 'Current Plan', 'Save More', or 'Save Less'",
              },
              reason: {
                type: Type.STRING,
                description: 'Why this scenario offers the most balanced tradeoff.',
              },
              insight: {
                type: Type.STRING,
                description: 'Financial behavior insight on timeline vs cashflow impact.',
              },
              action: {
                type: Type.STRING,
                description: 'Concrete next step to implement this scenario.',
              },
            },
            required: ['recommendedScenario', 'reason', 'insight', 'action'],
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
    } catch (apiError: any) {
      console.warn('Gemini API scenario analysis fallback:', apiError.message);
    }
  }

  // Algorithmic financial comparison fallback
  let recommendedScenario: 'Current Plan' | 'Save More' | 'Save Less' = 'Current Plan';
  let reason = '';
  let insight = '';
  let action = '';

  if (currentSc.achievable && currentSc.surplus >= 0) {
    recommendedScenario = 'Current Plan';
    reason = `Your Current Plan of ৳${Number(currentSc.monthlySaving).toLocaleString()}/month comfortably achieves your goal with a ৳${Number(currentSc.surplus).toLocaleString()} buffer, avoiding unnecessary cashflow strain.`;
    insight = `While the 'Save More' plan yields ৳${Number(moreSc.projected).toLocaleString()}, it ties up an extra ৳${(Number(moreSc.monthlySaving) - Number(currentSc.monthlySaving)).toLocaleString()} each month that could serve as flexible liquidity.`;
    action = `Keep your monthly auto-debit set to ৳${Number(currentSc.monthlySaving).toLocaleString()} on salary disbursement date.`;
  } else if (!currentSc.achievable && moreSc.achievable) {
    recommendedScenario = 'Save More';
    reason = `Your Current Plan leaves a shortfall of ৳${Number(currentSc.gap).toLocaleString()}, whereas increasing contributions to ৳${Number(moreSc.monthlySaving).toLocaleString()} successfully completes your goal on schedule.`;
    insight = `Stepping up by ৳${(Number(moreSc.monthlySaving) - Number(currentSc.monthlySaving)).toLocaleString()}/month ensures you do not have to prolong your ${targetMonths}-month timeline.`;
    action = `Audit recurring subscriptions and eating out to fund the ৳${(Number(moreSc.monthlySaving) - Number(currentSc.monthlySaving)).toLocaleString()} monthly difference.`;
  } else {
    recommendedScenario = 'Save More';
    reason = `Even with your current contributions, reaching ৳${Number(targetAmount).toLocaleString()} within ${targetMonths} months requires prioritizing the highest sustainable monthly savings tier.`;
    insight = `If saving ৳${Number(moreSc.monthlySaving).toLocaleString()} is too tight, consider extending your duration past ${targetMonths} months to preserve daily cashflow.`;
    action = `Start with the Current Plan and deposit festival bonuses or one-time earnings to bridge the remaining ৳${Number(currentSc.gap).toLocaleString()} deficit.`;
  }

  return res.json({
    recommendedScenario,
    reason,
    insight,
    action,
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

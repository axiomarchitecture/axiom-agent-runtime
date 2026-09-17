import type { JevAdapter } from "./adapter.js";
import type {
  Action,
  ConditionOperator,
  JevDecision,
} from "../core/types.js";

type ChoiceAnswer = {
  type: "choice";
  choice: string;
  probabilities?: Record<string, number>;
  confidence?: number;
};

type SystemOneResponse = {
  model?: string;
  answers?: Record<string, ChoiceAnswer>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

const DEFAULT_ENDPOINT = "https://api.typesafe.ai/v1/systemone";

const ACTIONS: Action[] = ["BUY", "SELL", "PAY", "TRANSFER"];

const CONDITION_OPERATORS: ConditionOperator[] = [
  "LT",
  "LTE",
  "GT",
  "GTE",
  "EQ",
  "NONE",
];

function isAction(value: string): value is Action {
  return ACTIONS.includes(value as Action);
}

function isConditionOperator(value: string): value is ConditionOperator {
  return CONDITION_OPERATORS.includes(value as ConditionOperator);
}

function extractAmount(input: string): number {
  const match = input.match(
    /\b(?:buy|sell|pay|transfer)\s+([0-9]+(?:[.,][0-9]+)?)/i
  );

  if (!match) {
    throw new Error("Could not determine a transaction amount from the input.");
  }

  const amount = Number(match[1].replace(",", "."));

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Transaction amount must be a positive finite number.");
  }

  return amount;
}

function extractPriceCondition(
  input: string
): { operator: ConditionOperator; value?: number; currency: string } {
  const match = input.match(
    /\b(?:below|under|less than|lower than|above|over|greater than|higher than|at|equal to)\s*\$?\s*([0-9]+(?:[.,][0-9]+)?)/i
  );

  if (!match) {
    return {
      operator: "NONE",
      currency: "USD",
    };
  }

  const value = Number(match[1].replace(",", "."));

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Price condition value must be a valid number.");
  }

  const lower = input.toLowerCase();

  let operator: ConditionOperator;

  if (
    lower.includes("below") ||
    lower.includes("under") ||
    lower.includes("less than") ||
    lower.includes("lower than")
  ) {
    operator = "LT";
  } else if (
    lower.includes("above") ||
    lower.includes("over") ||
    lower.includes("greater than") ||
    lower.includes("higher than")
  ) {
    operator = "GT";
  } else {
    operator = "EQ";
  }

  return {
    operator,
    value,
    currency: "USD",
  };
}

function readChoice(
  response: SystemOneResponse,
  question: string
): { choice: string; confidence: number; probabilities: Record<string, number> } {
  const answer = response.answers?.[question];

  if (!answer || answer.type !== "choice" || typeof answer.choice !== "string") {
    throw new Error(`Jev did not return a valid choice for "${question}".`);
  }

  return {
    choice: answer.choice,
    confidence:
      typeof answer.confidence === "number" ? answer.confidence : 0,
    probabilities: answer.probabilities ?? {},
  };
}

export class RealJevAdapter implements JevAdapter {
  constructor(
    private readonly config: {
      apiKey: string;
      endpoint?: string;
    }
  ) {}

  async decide(input: string): Promise<JevDecision> {
    if (!this.config.apiKey) {
      throw new Error(
        "RealJevAdapter is not configured. Set TYPESAFE_API_KEY in the environment."
      );
    }

    const endpoint = this.config.endpoint ?? DEFAULT_ENDPOINT;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: input,
        model: "jev-latest",
        questions: {
          action: {
            type: "choice",
            instructions:
              "Which economic action does the user explicitly intend? Choose BUY, SELL, PAY, or TRANSFER.",
            criteria: {
              BUY: "The user intends to purchase an asset.",
              SELL: "The user intends to sell an asset.",
              PAY: "The user intends to pay or spend funds.",
              TRANSFER: "The user intends to transfer assets between accounts or parties.",
            },
          },
          asset: {
            type: "choice",
            instructions:
              "Which asset is the user referring to? Choose the exact ticker if explicitly identifiable. Choose UNKNOWN if it cannot be determined.",
            criteria: {
              KAS: "Kaspa (KAS) is the asset being discussed.",
              BTC: "Bitcoin (BTC) is the asset being discussed.",
              USD: "United States dollars (USD) are the asset being discussed.",
              UNKNOWN: "The asset cannot be determined from the input.",
            },
          },
          condition_operator: {
            type: "choice",
            instructions:
              "What price condition does the user express? LT means below/under, LTE means at or below, GT means above/over, GTE means at or above, EQ means exactly equal, NONE means no price condition.",
            criteria: {
              LT: "The user specifies a price below a threshold.",
              LTE: "The user specifies a price at or below a threshold.",
              GT: "The user specifies a price above a threshold.",
              GTE: "The user specifies a price at or above a threshold.",
              EQ: "The user specifies an exact price match.",
              NONE: "The user does not specify a price condition.",
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `TypeSafe API request failed (${response.status}): ${body}`
      );
    }

    const data = (await response.json()) as SystemOneResponse;

    const action = readChoice(data, "action");
    const asset = readChoice(data, "asset");
    const condition = readChoice(data, "condition_operator");

    if (!isAction(action.choice)) {
      throw new Error(`Jev returned unsupported action: ${action.choice}`);
    }

    if (!isConditionOperator(condition.choice)) {
      throw new Error(
        `Jev returned unsupported condition operator: ${condition.choice}`
      );
    }

    const amount = extractAmount(input);
    const parsedCondition = extractPriceCondition(input);

    const confidence = Math.min(
      action.confidence,
      asset.confidence,
      condition.confidence
    );

    return {
      action: action.choice,
      asset: asset.choice,
      amount,
      currency: parsedCondition.currency,
      condition: {
        operator: condition.choice,
        value: parsedCondition.value,
      },
      confidence,
      rationale: "Decision interpreted by Jev and validated by Axiom.",
    };
  }
}
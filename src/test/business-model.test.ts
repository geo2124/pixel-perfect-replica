import { describe, expect, it } from "vitest";
import {
  demoFigures,
  demoProfile,
  financials,
  scenario,
  dimensions,
} from "@/features/platform/model";
import { canApprove } from "@/features/platform/state";
describe("Cedar House demonstration facts", () => {
  it("uses Cedar House as the restaurant business", () => {
    expect(demoProfile.name).toBe("Cedar House");
    expect(demoProfile.industry).toBe("Restaurant");
  });
  it("has 22 employees", () => expect(demoFigures["employees"]).toBe(22));
  it("has $75,000 monthly revenue", () => expect(demoFigures["revenue"]).toBe(75000));
  it("has $24,000 ingredient costs", () => expect(demoFigures["ingredients"]).toBe(24000));
  it("has $21,000 salaries and benefits", () => expect(demoFigures["salaries"]).toBe(21000));
  it("has $6,000 rent", () => expect(demoFigures["rent"]).toBe(6000));
  it("has $3,000 utilities", () => expect(demoFigures["utilities"]).toBe(3000));
  it("has $2,000 marketing spend", () => expect(demoFigures["marketing"]).toBe(2000));
  it("has $4,000 delivery commissions", () => expect(demoFigures["delivery"]).toBe(4000));
  it("has $10,500 other operating expenses", () => expect(demoFigures["other"]).toBe(10500));
  it("calculates the specified $4,500 operating profit", () =>
    expect(financials(demoFigures).profit).toBe(4500));
  it("models all twelve dimensions", () => expect(dimensions).toHaveLength(12));
});
describe("Financial calculations", () => {
  it("calculates a coherent 6% operating and 68% gross margin", () => {
    const f = financials(demoFigures);
    expect(f.margin).toBe(6);
    expect(f.gross).toBe(68);
    expect(f.expenses).toBe(70500);
    expect(f.fixed).toBe(42500);
  });
  it("does not treat missing expenses as zero", () => {
    const f = financials({ ...demoFigures, ingredients: null });
    expect(f.profit).toBeNull();
    expect(f.score).toBeNull();
  });
  it("does not score missing cash data", () =>
    expect(financials({ ...demoFigures, cash: null }).score).toBeNull());
  it("handles zero revenue without division artifacts", () => {
    const f = financials({ ...demoFigures, revenue: 0 });
    expect(f.margin).toBeNull();
    expect(f.breakEven).toBeNull();
  });
  it("applies the disclosed financial score criteria", () => {
    expect(financials(demoFigures).score).toBe(73);
  });
  it("keeps an unchanged scenario equal to baseline", () => {
    expect(scenario(demoFigures, 0, 0, 0)?.profit).toBe(4500);
  });
  it("calculates ingredient and payroll savings directly", () => {
    const result = scenario(demoFigures, 0, 7.5, 5);
    expect(result?.profit).toBe(7350);
    expect(result?.improvement).toBe(2850);
  });
  it("scales variable costs with revenue", () => {
    const result = scenario(demoFigures, 10, 0, 0);
    expect(result?.revenue).toBe(82500);
    expect(result?.profit).toBeCloseTo(9200, 5);
  });
});
describe("Demonstration approval interfaces", () => {
  it("enables management roles to preview approvals", () => {
    expect(canApprove("Business owner")).toBe(true);
    expect(canApprove("CFO")).toBe(true);
  });
  it("does not offer approval actions to analysts", () =>
    expect(canApprove("Financial analyst")).toBe(false));
});

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Save,
  Building2,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlatform } from "../platform/state";
import { demoProfile, dimensions, type Profile } from "../platform/model";
import { PageHeading, Field, Panel, Tag, Progress, ModuleTabs, Footer } from "../platform/common";
import { toast } from "sonner";
export function BusinessDefinition() {
  const { state, update, log } = usePlatform();
  const [step, setStep] = useState(state.onboardingStep);
  const [editing, setEditing] = useState(!state.profile.approved);
  const p = state.profile;
  const set = (key: keyof Profile, value: string) =>
    update((s) => ({ ...s, profile: { ...s.profile, [key]: value, approved: false } }));
  const next = () => {
    if (step === 0 && !p.name.trim()) {
      toast.error("Enter a business name");
      return;
    }
    const n = Math.min(3, step + 1);
    setStep(n);
    update((s) => ({ ...s, onboardingStep: n }));
  };
  const start = () => {
    update((s) => ({
      ...s,
      profile: {
        name: "",
        industry: "Restaurant",
        model: "Casual dining",
        stage: "Idea",
        market: "",
        vision: "",
        objective: "",
        constraints: "",
        approved: false,
      },
      figures: Object.fromEntries(Object.keys(s.figures).map((k) => [k, null])),
      classification: "User-provided figure",
      onboardingStep: 0,
      dimensionAnswers: {},
    }));
    setStep(0);
    setEditing(true);
  };
  return (
    <div className="page">
      <PageHeading
        title="Business definition"
        subtitle="The foundation for every analysis, forecast and decision."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={start}>
              <Plus />
              New business
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditing(true);
                setStep(0);
              }}
            >
              <Building2 />
              Edit profile
            </Button>
          </>
        }
      />
      {!editing && p.approved ? (
        <>
          <div className="two-column">
            <section>
              <div className="eyebrow">APPROVED BUSINESS CONCEPT</div>
              <h2 className="text-3xl font-semibold mt-3">{p.name}</h2>
              <p className="description mt-3 max-w-xl">{p.vision}</p>
              <div className="flex gap-2 mt-5">
                <Tag tone="success">Approved profile</Tag>
                <Tag>{p.stage}</Tag>
                <Tag>{p.model}</Tag>
              </div>
              <div className="form-grid mt-8">
                {[
                  ["Industry", p.industry],
                  ["Primary market", p.market],
                  [
                    "Revenue model",
                    p.industry === "Restaurant"
                      ? "Dine-in, takeaway & delivery"
                      : "Products and services",
                  ],
                  ["Strategic objective", p.objective],
                ].map(([label, value]) => (
                  <div className="border-b border-border pb-5" key={label}>
                    <div className="eyebrow">{label}</div>
                    <p className="text-sm leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
              <div className="side-note">
                <h3 className="font-semibold text-xs">Strategic constraints</h3>
                <p className="description mt-2">{p.constraints}</p>
              </div>
            </section>
            <Panel title="Profile readiness" subtitle="Business understanding before optimization">
              <div className="panel-body">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck className="text-success size-8" />
                  <div>
                    <h3 className="font-semibold">Ready for architecture mapping</h3>
                    <p className="description">Concept approved by management</p>
                  </div>
                </div>
                <Progress value={100} />
                <div className="notice">
                  Demonstration profile and market are fictional. Current software, operating
                  processes and analytical assumptions still require validation.
                </div>
                <Link to="/architecture">
                  <Button className="w-full">
                    Explore business architecture
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            </Panel>
          </div>
          <div className="section-header mt-8">
            <h2>Business model overview</h2>
            <Tag>Illustrative sample</Tag>
          </div>
          <div className="three-grid">
            {[
              [
                "Value proposition",
                "Seasonal Mediterranean food, neighborhood hospitality and consistent quality.",
              ],
              [
                "Customer segments",
                "Neighborhood regulars, business lunches, families and delivery customers.",
              ],
              [
                "Revenue streams",
                "Dine-in 65%, delivery 25%, takeaway 10% of illustrative monthly sales.",
              ],
            ].map(([title, body]) => (
              <article className="dimension-card" key={title}>
                <h3 className="mt-0">{title}</h3>
                <p className="description mt-3">{body}</p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="stepper">
            {["Identity", "Business model", "Vision & constraints", "Review & approve"].map(
              (s, i) => (
                <div key={s} className={`step ${step >= i ? "active" : ""}`}>
                  0{i + 1} · {s}
                </div>
              ),
            )}
          </div>
          <div className="two-column">
            <section>
              <h2 className="section-title">
                {
                  [
                    "Let’s understand your business",
                    "How does the business operate?",
                    "What are you working toward?",
                    "Review your business concept",
                  ][step]
                }
              </h2>
              <p className="description mb-6">
                {step === 0
                  ? "Start with your business identity and current stage."
                  : step === 1
                    ? "Your industry and business model shape the questions that follow."
                    : step === 2
                      ? "Your objectives and constraints keep recommendations grounded."
                      : "Review the foundation before proceeding to the architecture map."}
              </p>
              <div className="form-grid">
                {step === 0 && (
                  <>
                    <Field label="Business name">
                      <input
                        aria-label="Business name"
                        value={p.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Business name"
                      />
                    </Field>
                    <Field label="Business stage">
                      <select
                        aria-label="Business stage"
                        value={p.stage}
                        onChange={(e) => set("stage", e.target.value)}
                      >
                        {[
                          "Idea",
                          "Startup",
                          "Operating business",
                          "Expansion",
                          "Restructuring",
                        ].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Industry">
                      <select
                        aria-label="Industry"
                        value={p.industry}
                        onChange={(e) => {
                          set("industry", e.target.value);
                          set(
                            "model",
                            e.target.value === "Restaurant"
                              ? "Casual dining"
                              : e.target.value === "Manufacturing"
                                ? "Make to stock"
                                : "Professional services",
                          );
                        }}
                      >
                        {["Restaurant", "Manufacturing", "Retail", "Professional services"].map(
                          (v) => (
                            <option key={v}>{v}</option>
                          ),
                        )}
                      </select>
                    </Field>
                    <Field label="Primary geographic market">
                      <input
                        aria-label="Primary market"
                        value={p.market}
                        onChange={(e) => set("market", e.target.value)}
                        placeholder="City, country or region"
                      />
                    </Field>
                  </>
                )}
                {step === 1 && (
                  <>
                    <Field
                      label={p.industry === "Restaurant" ? "Restaurant format" : "Operating model"}
                      full
                    >
                      <select
                        aria-label="Operating model"
                        value={p.model}
                        onChange={(e) => set("model", e.target.value)}
                      >
                        {(p.industry === "Restaurant"
                          ? [
                              "Fine dining",
                              "Casual dining",
                              "Fast casual",
                              "Quick service",
                              "Delivery-first",
                              "Multi-branch group",
                            ]
                          : p.industry === "Manufacturing"
                            ? ["Make to stock", "Make to order", "Contract manufacturing"]
                            : [
                                "Professional services",
                                "Retail stores",
                                "Online commerce",
                                "Subscription",
                              ]
                        ).map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Business concept & value proposition" full>
                      <textarea
                        aria-label="Business concept"
                        rows={4}
                        value={p.vision}
                        onChange={(e) => set("vision", e.target.value)}
                      />
                    </Field>
                    <Field
                      label={
                        p.industry === "Restaurant"
                          ? "Sales channels & service capacity"
                          : "Products, customers & sales channels"
                      }
                      full
                    >
                      <textarea
                        aria-label="Sales channels"
                        rows={3}
                        defaultValue={
                          p.industry === "Restaurant"
                            ? "Dine-in, takeaway and delivery. 60 seats; lunch and dinner services."
                            : ""
                        }
                        onBlur={(e) =>
                          update((s) => ({
                            ...s,
                            dimensionAnswers: {
                              ...s.dimensionAnswers,
                              concept: {
                                ...s.dimensionAnswers["concept"],
                                channels: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </Field>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Field
                      label={p.stage === "Idea" ? "Launch objective" : "Management objectives"}
                      full
                    >
                      <textarea
                        aria-label="Management objectives"
                        rows={3}
                        value={p.objective}
                        onChange={(e) => set("objective", e.target.value)}
                      />
                    </Field>
                    <Field label="Resources, constraints & regulatory requirements" full>
                      <textarea
                        aria-label="Constraints"
                        rows={4}
                        value={p.constraints}
                        onChange={(e) => set("constraints", e.target.value)}
                      />
                    </Field>
                    <Field label="Supporting business document (optional)" full>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt,.csv,.xlsx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            log(`Document attached to concept: ${file.name} (metadata only)`);
                            toast.success(
                              "Document name recorded; content processing is not part of this prototype",
                            );
                          }
                        }}
                      />
                    </Field>
                  </>
                )}
                {step === 3 && (
                  <div className="col-span-full">
                    {Object.entries(p)
                      .filter(([k]) => k !== "approved")
                      .map(([k, v]) => (
                        <div className="settings-line" key={k}>
                          <span className="capitalize text-muted-foreground">{k}</span>
                          <span className="text-right max-w-[70%]">
                            {String(v) || "Not provided"}
                          </span>
                        </div>
                      ))}
                    <div className="notice">
                      Unanswered fields remain unavailable. User-entered information is not
                      independently verified.
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  disabled={step === 0}
                  onClick={() => {
                    setStep(step - 1);
                    update((s) => ({ ...s, onboardingStep: step - 1 }));
                  }}
                >
                  <ArrowLeft />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Progress saved in this browser")}
                  >
                    <Save />
                    Save
                  </Button>
                  {step < 3 ? (
                    <Button onClick={next}>
                      Continue
                      <ArrowRight />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        update((s) => ({ ...s, profile: { ...s.profile, approved: true } }));
                        setEditing(false);
                        log(`Business concept approved: ${p.name}`);
                        toast.success("Business profile approved");
                      }}
                    >
                      <Check />
                      Approve profile
                    </Button>
                  )}
                </div>
              </div>
            </section>
            <aside>
              <div className="side-note">
                <h3 className="text-xs font-semibold">
                  {p.stage === "Idea"
                    ? "Planning a new business"
                    : "Understanding your operating model"}
                </h3>
                <p className="description mt-2">
                  {p.stage === "Idea"
                    ? "Historical performance is not expected. Projections will remain assumptions until actual figures exist."
                    : "Available data, manual processes and existing systems will be mapped objectively. Missing software is not a weakness by itself."}
                </p>
              </div>
              <Tag tone="blue">User-provided information</Tag>
            </aside>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
export function Architecture() {
  const [tab, setTab] = useState("12 dimensions");
  const { state } = usePlatform();
  return (
    <div className="page">
      <PageHeading
        title="Business architecture"
        subtitle="One connected model of your people, processes, systems and decisions."
        actions={
          <Link to="/business">
            <Button variant="outline" size="sm">
              Business profile
              <ArrowUpRightIcon />
            </Button>
          </Link>
        }
      />
      <ModuleTabs
        tabs={["12 dimensions", "Relationship map", "Data readiness"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "12 dimensions" ? (
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="description">
              12 interconnected dimensions · questions adapted to{" "}
              {state.profile.industry.toLowerCase()}
            </p>
            <Tag tone="blue">Progressive assessment</Tag>
          </div>
          <div className="three-grid">
            {dimensions.map((d, i) => {
              const answers = state.dimensionAnswers[d.slug];
              const filled = answers ? d.fields.filter((f) => answers[f]?.trim()).length : 0;
              const coverage = answers
                ? Math.round((filled / d.fields.length) * 100)
                : d.completeness;
              return (
                <Link
                  key={d.slug}
                  to="/dimensions/$pillar"
                  params={{ pillar: d.slug }}
                  className="dimension-card"
                >
                  <div className="flex justify-between">
                    <span className="dimension-number">
                      DIMENSION {String(i + 1).padStart(2, "0")}
                    </span>
                    <Tag
                      tone={
                        d.status === "Healthy"
                          ? "success"
                          : d.status === "Data gaps"
                            ? "neutral"
                            : "warning"
                      }
                    >
                      {d.status}
                    </Tag>
                  </div>
                  <h3>{d.name}</h3>
                  <p className="text-[10px] text-muted-foreground">
                    {answers ? "User-provided assessment" : "Illustrative sample assessment"}
                  </p>
                  <div className="metric-line">
                    <span>{d.metric}</span>
                    <strong>{d.value}</strong>
                  </div>
                  <Progress value={coverage} />
                  <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
                    <span>Data completeness</span>
                    <span>
                      {coverage}% <ArrowRight className="inline size-3 ml-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : tab === "Relationship map" ? (
        <>
          <RelationshipMap />
          <div className="notice">
            Select a dimension to inspect its process dependencies, data sources and unresolved
            questions.
          </div>
        </>
      ) : (
        <div className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Data coverage</th>
                <th>Data source</th>
                <th>Classification</th>
                <th>Unresolved information</th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map((d) => (
                <tr key={d.slug}>
                  <td>
                    <Link
                      className="text-primary"
                      to="/dimensions/$pillar"
                      params={{ pillar: d.slug }}
                    >
                      {d.name}
                    </Link>
                  </td>
                  <td>{d.completeness}%</td>
                  <td>
                    {["financial", "sales"].includes(d.slug)
                      ? "POS / accounting sample"
                      : "Spreadsheet / management sample"}
                  </td>
                  <td>
                    <Tag>Illustrative</Tag>
                  </td>
                  <td>{d.fields[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Footer />
    </div>
  );
}
export function RelationshipMap() {
  return (
    <div className="panel map-canvas">
      <svg className="map-connectors" viewBox="0 0 700 330" preserveAspectRatio="none">
        <path d="M170 80 C270 80 270 165 350 165 M170 165H530 M170 250 C270 250 270 165 350 165 M350 165 C430 165 430 80 530 80 M350 165 C430 165 430 250 530 250" />
      </svg>
      <div className="map-column">
        {["financial", "sales", "procurement"].map((slug) => {
          const d = dimensions.find((v) => v.slug === slug);
          return (
            <Link
              key={slug}
              to="/dimensions/$pillar"
              params={{ pillar: slug }}
              className="map-node"
            >
              <Network className="size-4 text-primary" />
              {d?.short}
            </Link>
          );
        })}
      </div>
      <div className="map-node map-center">
        <Building2 className="size-5" />
        Business model
      </div>
      <div className="map-column">
        {["operations", "inventory", "customers"].map((slug) => {
          const d = dimensions.find((v) => v.slug === slug);
          return (
            <Link
              key={slug}
              to="/dimensions/$pillar"
              params={{ pillar: slug }}
              className="map-node"
            >
              <Network className="size-4 text-success" />
              {d?.short}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export function Dimension({ pillar }: { pillar: string }) {
  const d = dimensions.find((v) => v.slug === pillar);
  const { state, update, log } = usePlatform();
  const [tab, setTab] = useState("Overview");
  const [question, setQuestion] = useState(0);
  if (!d) return <div className="page">Dimension not found</div>;
  const answers = state.dimensionAnswers[d.slug] ?? {};
  const current = d.fields[question] ?? "";
  return (
    <div className="page">
      <PageHeading
        title={d.name}
        eyebrow="BUSINESS ARCHITECTURE / DIMENSION ASSESSMENT"
        subtitle={`${state.profile.name} · ${state.profile.industry} · ${state.profile.model}`}
        actions={
          <Link to="/architecture">
            <Button variant="outline" size="sm">
              <ArrowLeft />
              All dimensions
            </Button>
          </Link>
        }
      />
      <ModuleTabs
        tabs={["Overview", "Questionnaire", "Information repository", "Dependencies"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Overview" ? (
        <>
          <div className="kpi-grid">
            <div className="kpi">
              <div className="kpi-label">Data completeness</div>
              <div className="kpi-value">
                {state.dimensionAnswers[d.slug]
                  ? Math.round((d.fields.filter((k) => answers[k]?.trim()).length / 3) * 100)
                  : d.completeness}
                %
              </div>
              <p className="description mt-2">
                {state.dimensionAnswers[d.slug] ? "User-entered fields" : "Illustrative baseline"}
              </p>
            </div>
            <div className="kpi">
              <div className="kpi-label">{d.metric}</div>
              <div className="kpi-value">{d.value}</div>
              <p className="description mt-2">Sample business metric</p>
            </div>
            <div className="kpi">
              <div className="kpi-label">Assessment status</div>
              <Tag tone="warning">{d.status}</Tag>
              <p className="description mt-4">Validation required</p>
            </div>
          </div>
          <h2 className="section-title">Dimension priorities</h2>
          <p className="description">{d.fields.join(" · ")}</p>
          <div className="notice">
            {state.profile.industry === "Restaurant"
              ? "Restaurant context: menu profitability, ingredient waste, service capacity and guest experience."
              : state.profile.industry === "Manufacturing"
                ? "Manufacturing context: raw materials, machine capacity, yield and production scheduling."
                : "Business context: product and service economics, workflow capacity and customer demand."}{" "}
            These sample metrics have not been verified.
          </div>
          <Button onClick={() => setTab("Questionnaire")}>
            Continue assessment
            <ArrowRight />
          </Button>
        </>
      ) : tab === "Questionnaire" ? (
        <div className="two-column">
          <section>
            <div className="eyebrow">
              QUESTION {question + 1} OF {d.fields.length}
            </div>
            <h2 className="section-title">{current}</h2>
            <p className="description mb-5">
              {state.profile.industry === "Restaurant"
                ? `Describe ${current.toLowerCase()} for your ${state.profile.model.toLowerCase()} restaurant.`
                : `Describe ${current.toLowerCase()} for your ${state.profile.industry.toLowerCase()} business.`}
            </p>
            <textarea
              aria-label={current}
              rows={5}
              value={answers[current] ?? ""}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  dimensionAnswers: {
                    ...s.dimensionAnswers,
                    [d.slug]: { ...s.dimensionAnswers[d.slug], [current]: e.target.value },
                  },
                }))
              }
            />
            <div className="form-grid mt-5">
              <Field label="Information classification">
                <select
                  aria-label="Information classification"
                  value={answers[`${current}:classification`] ?? "User-provided figure"}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      dimensionAnswers: {
                        ...s.dimensionAnswers,
                        [d.slug]: {
                          ...s.dimensionAnswers[d.slug],
                          [`${current}:classification`]: e.target.value,
                        },
                      },
                    }))
                  }
                >
                  {[
                    "Verified data",
                    "User-provided figure",
                    "Estimated figure",
                    "Assumption",
                    "Not available",
                    "Not applicable",
                    "Requires validation",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Source / supporting evidence">
                <input
                  aria-label="Evidence source"
                  value={answers[`${current}:source`] ?? ""}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      dimensionAnswers: {
                        ...s.dimensionAnswers,
                        [d.slug]: {
                          ...s.dimensionAnswers[d.slug],
                          [`${current}:source`]: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </Field>
            </div>
            <div className="flex justify-between mt-7">
              <Button
                variant="outline"
                disabled={question === 0}
                onClick={() => setQuestion(question - 1)}
              >
                <ArrowLeft />
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (question < 2) setQuestion(question + 1);
                  else {
                    log(`${d.name} assessment saved for review`);
                    toast.success("Assessment saved");
                    setTab("Information repository");
                  }
                }}
              >
                {question === 2 ? "Save assessment" : "Next question"}
                <ArrowRight />
              </Button>
            </div>
          </section>
          <div className="side-note">
            <h3 className="text-xs font-semibold">Missing information is not zero</h3>
            <p className="description mt-3">
              You can leave fields blank or classify information as unavailable. Manual workflows
              and spreadsheets are valid operating systems.
            </p>
          </div>
        </div>
      ) : tab === "Information repository" ? (
        <div className="panel table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Information</th>
                <th>Recorded answer</th>
                <th>Classification</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {d.fields.map((k) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className="max-w-72 whitespace-normal">{answers[k] || "Not available"}</td>
                  <td>
                    <Tag>{answers[`${k}:classification`] ?? "Not available"}</Tag>
                  </td>
                  <td>{answers[`${k}:source`] || "Not specified"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <RelationshipMap />
          <div className="notice">
            {d.name} interacts with finance, operations and data quality. Changing assumptions can
            affect related forecasts and recommendations; review downstream analyses before
            approval.
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight className="-rotate-45" />;
}

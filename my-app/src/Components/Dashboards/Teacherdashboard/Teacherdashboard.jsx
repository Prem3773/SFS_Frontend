import React, { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeachingImprovementReport from "./TeachingImprovementReport";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_ENDPOINT = GEMINI_MODEL
  ? `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
  : "";
const GEMINI_MAX_FEEDBACK = 20;
const GEMINI_ONLY = true;
const GEMINI_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    improvementAreas: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["summary", "improvementAreas"],
};
const GEMINI_SYSTEM_INSTRUCTION = [
  "You are an education analyst. Use ONLY the student feedback text to identify areas the teacher should improve in their teaching.",
  "Do not mention the system/platform. Do not invent issues that are not supported by the feedback.",
  "Return ONLY valid JSON in this format:",
  '{ "summary": "string", "improvementAreas": ["string", "string", "string"] }',
  "Rules:",
  "- Summary should be 3 to 5 sentences.",
  "- Improvement areas should be short, actionable phrases (3 to 5 items).",
  "- Always provide improvement areas even if feedback is positive (give growth opportunities).",
  "- Never return empty fields.",
  "- Do not include markdown or code fences.",
].join("\n");

const buildGeminiPrompt = ({ feedbacks, teacherName }) => {
  const feedbackSnippets = (feedbacks || [])
    .flatMap((fb) => Object.entries(fb?.responses || {}))
    .filter(([, val]) => typeof val === "string" && val.trim().length > 0)
    .map(([key, val]) => `${key}: ${val.replace(/\s+/g, " ").trim()}`)
    .slice(0, GEMINI_MAX_FEEDBACK);

  return [
    `Teacher: ${teacherName || "Unknown"}`,
    `Feedback items provided: ${feedbackSnippets.length}`,
    "Student feedback about teaching:",
    feedbackSnippets.length > 0 ? feedbackSnippets.map((t) => `- ${t}`).join("\n") : "- none",
  ].join("\n");
};

const parseGeminiJson = (text) => {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // fall through to best-effort extraction
  }
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const normalizeGeminiOutput = (parsed) => {
  if (!parsed || typeof parsed !== "object") return null;
  const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
  const improvementAreasRaw = Array.isArray(parsed.improvementAreas)
    ? parsed.improvementAreas
    : Array.isArray(parsed.areas)
    ? parsed.areas
    : [];
  const improvementAreas = improvementAreasRaw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  if (!summary && improvementAreas.length === 0) return null;
  return { summary, improvementAreas };
};

const callGemini = async (body) => {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  const data = await response.json();
  return (data?.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("")
    .trim();
};

const requestGeminiInsights = async (context) => {
  if (!GEMINI_API_KEY || !GEMINI_ENDPOINT) return null;

  const prompt = buildGeminiPrompt(context);
  const baseBody = {
    systemInstruction: { parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  };

  let outputText = "";
  try {
    outputText = await callGemini({
      ...baseBody,
      generationConfig: {
        ...baseBody.generationConfig,
        responseMimeType: "application/json",
        responseJsonSchema: GEMINI_JSON_SCHEMA,
      },
    });
  } catch (schemaError) {
    outputText = await callGemini(baseBody);
  }

  if (!outputText) return null;

  const parsed = normalizeGeminiOutput(parseGeminiJson(outputText));
  if (parsed) return parsed;

  if (outputText.trim().startsWith("{")) {
    throw new Error("Gemini returned incomplete JSON.");
  }

  return { summary: outputText, improvementAreas: [] };
};

const Teacherdashboard = ({ user }) => {
  const [sentimentStats, setSentimentStats] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [improvementAreas, setImprovementAreas] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [aiStatus, setAiStatus] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "EduFeed";
    const fetchTeacherStats = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No auth token found. Please log in again.");
          setLoading(false);
          return;
        }
        
        const url = new URL("https://feedback-system-1-0sp1.onrender.com/api/feedback/teacher/stats");

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          setError(`Teacher stats failed (${res.status}). ${text || res.statusText}`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const sentiment = data.sentimentStats || data;

        const sentimentPayload = {
          positive: sentiment.positive ?? 0,
          neutral: sentiment.neutral ?? 0,
          negative: sentiment.negative ?? 0,
        };
        const feedbackTotal = data.totalFeedback ?? data.total ?? 0;
        const feedbackList = data.feedbacks || data.recentFeedback || data.recentFeedbacks || [];
        const trendPayload = data.monthlyTrend || data.trend || [];

        setSentimentStats(sentimentPayload);
        setTotalFeedback(feedbackTotal);
        setRecentFeedback(feedbackList);
        setImprovementAreas([]);
        setAiSummary("");

        setMonthlyTrend(trendPayload); // Use trend from backend

        setLoading(false);

        if (!GEMINI_API_KEY) {
          setAiStatus("Gemini API key not configured. Add VITE_GEMINI_API_KEY to generate insights.");
          setImprovementAreas([]);
          setAiSummary("");
          return;
        }

        if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
          setAiStatus("More feedback is needed to generate Gemini insights.");
          setImprovementAreas([]);
          setAiSummary("");
          return;
        }

        setAiLoading(true);
        setAiStatus("Generating insights with Gemini...");
        try {
          const geminiInsights = await requestGeminiInsights({
            feedbacks: feedbackList,
            teacherName: user || "Teacher",
          });

          const hasSummary = Boolean(geminiInsights?.summary);
          const hasAreas =
            Array.isArray(geminiInsights?.improvementAreas) &&
            geminiInsights.improvementAreas.length > 0;

          setAiSummary(hasSummary ? geminiInsights.summary : "");
          setImprovementAreas(hasAreas ? geminiInsights.improvementAreas : []);

          setAiStatus(
            hasSummary || hasAreas
              ? "Generated with Gemini."
              : "Gemini returned no usable insights."
          );
        } catch (geminiError) {
          console.log(geminiError);
          setAiStatus("Gemini response was incomplete or unavailable. Please try again.");
          setAiSummary("");
          setImprovementAreas([]);
        } finally {
          setAiLoading(false);
        }

      } catch (err) {
        console.log(err);
        setError("Network/CORS error while fetching teacher stats.");
        setLoading(false);
      }
    };

    fetchTeacherStats();
  }, []);

  const barData = [
    {
      name: "Sentiment",
      Positive: sentimentStats.positive,
      Neutral: sentimentStats.neutral,
      Negative: sentimentStats.negative,
    },
  ];

  const reportData = {
    positive_percent: 75,
    neutral_percent: 15,
    negative_percent: 10,
    aoi_points: `- Improve lesson pacing and structure\n- Add more interactive sessions\n- Use more real-world examples`
  };

  const resolvedImprovementAreas = improvementAreas;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherSidebar />

      <div className="flex-1 min-w-0 w-full p-4 pt-16 md:pt-4">

        {/* HEADER */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
          <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white">
            Welcome, {user || "Teacher"}
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
            AI & ML Powered Teacher Performance Dashboard
          </p>
          <div className="mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6">
            <button
              onClick={() => setShowReport(!showReport)}
              className="w-full sm:w-auto px-4 py-2 rounded-md font-semibold bg-purple-500 text-white hover:bg-purple-600 transition"
            >
              {showReport ? "View Dashboard" : "Generate Report"}
            </button>
          </div>
        </div>

        {showReport ? (
          <TeachingImprovementReport {...reportData} teacherName={user || "Teacher"} />
        ) : (
          <>
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-300">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-600 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                {error}
              </div>
            ) : totalFeedback === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                No feedback found yet.
              </div>
            ) : (
              <>
                {/* SENTIMENT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Positive", value: sentimentStats.positive, color: "green" },
                    { label: "Neutral", value: sentimentStats.neutral, color: "yellow" },
                    { label: "Negative", value: sentimentStats.negative, color: "red" },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md text-center"
                    >
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        {card.label}
                      </h3>
                      <p className={`text-3xl font-bold mt-2 text-${card.color}-500`}>
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* BAR CHART */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-3">Sentiment Bar Chart</h2>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Positive" fill="#4CAF50" />
                        <Bar dataKey="Neutral" fill="#FFC107" />
                        <Bar dataKey="Negative" fill="#F44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* LINE CHART */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow col-span-1 lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-3">Monthly Feedback Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyTrend}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#4F46E5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* IMPROVEMENT AREAS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Areas for Improvement
                  </h2>

                  {aiLoading && (
                    <p className="text-xs text-gray-500 mb-3">
                      Updating improvement areas with Gemini...
                    </p>
                  )}

                  {resolvedImprovementAreas.length === 0 ? (
                    <p className="text-gray-500">
                      {GEMINI_ONLY
                        ? aiLoading
                          ? "Generating improvement areas with Gemini..."
                          : "Gemini improvement areas not available yet."
                        : "Not enough data to generate improvement areas yet."}
                    </p>
                  ) : (
                    <>
                      <ul className="space-y-3">
                        {resolvedImprovementAreas.map((a, i) => (
                          <li key={i} className="bg-gray-200 dark:bg-gray-700 p-3 rounded flex justify-between">
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* RECENT FEEDBACK */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
                  <h2 className="text-2xl font-semibold mb-4">Recent Feedback</h2>
                  {recentFeedback.length === 0 ? (
                    <p className="text-gray-500">No recent feedback.</p>
                  ) : (
                    <ul className="space-y-4">
                      {recentFeedback.map((fb) => (
                        <li key={fb._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-gray-800 dark:text-gray-200">
                            {fb?.responses?.additionalComments || "No comments provided."}
                          </p>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              - {fb?.userId?.username || "Unknown user"}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                fb.sentiment === "positive"
                                  ? "text-green-500"
                                  : fb.sentiment === "negative"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            >
                              {fb.sentiment}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* AI SUMMARY */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6 mb-10">
                  <h2 className="text-2xl font-semibold mb-4">
                    AI Summary
                  </h2>
                  {aiStatus && (
                    <p className="text-xs text-gray-500 mb-2">
                      {aiStatus}
                    </p>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {aiSummary ||
                      (GEMINI_ONLY
                        ? aiLoading
                          ? "Generating summary with Gemini..."
                          : "Gemini summary not available yet."
                        : "AI summary unavailable.")}
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Teacherdashboard;

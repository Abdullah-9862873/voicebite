const { GoogleGenerativeAI } = require("@google/generative-ai");
const MenuItem = require("../models/MenuItem");

let model;

const getModel = () => {
  if (!model) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });
  }
  return model;
};

const processCommand = async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "No transcript provided" });
  }

  try {
    const menuItems = await MenuItem.find(
      {},
      "name description category"
    ).lean();

    const categories = [...new Set(menuItems.map((i) => i.category))];

    const menuContext = menuItems
      .map(
        (item) =>
          `- ${item.name}: ${item.description} (Category: ${item.category})`
      )
      .join("\n");

    const prompt = `
You are the VoiceBite Elite AI Concierge.

MENU:
${menuContext}

Available Categories: [${categories.join(", ")}]

Return ONLY valid JSON as instructed.
Transcript: "${transcript}"
`;

    const result = await getModel().generateContent(prompt);
    const responseText = result.response.text().trim();

    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      return res.json({
        action: "SEARCH",
        payload: { query: transcript },
      });
    }

    const jsonContent = responseText.substring(jsonStart, jsonEnd);
    res.json(JSON.parse(jsonContent));
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      error: "AI processing failed",
    });
  }
};

module.exports = { processCommand };

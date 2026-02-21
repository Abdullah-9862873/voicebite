require("dotenv").config();

const handler = require("./api/index");
const connectDB = require("./config/db");

const app = handler.app || handler;
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Local backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start local server:", error.message);
    process.exit(1);
  }
})();

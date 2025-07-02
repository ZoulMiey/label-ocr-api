import express from "express";
import cors from "cors";
import vision from "@google-cloud/vision";

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Google Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "api/your-service-account-key.json"  // Update this path if needed
});

// Route to confirm backend is running
app.get("/", (req, res) => {
  res.send("Label OCR API is running!");
});

// OCR endpoint
app.post("/ocr", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const [result] = await client.textDetection({ image: { content: image } });
    const detections = result.textAnnotations;

    res.json({
      text: detections[0]?.description || "",
      raw: detections
    });
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ error: "OCR failed", details: err.message });
  }
});

// Start server (needed for local testing)
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

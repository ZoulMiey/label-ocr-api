import express from "express";
import cors from "cors";
import vision from "@google-cloud/vision";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY)
});

app.post("/ocr", async (req, res) => {
  try {
    const base64Image = req.body.image;
    const buffer = Buffer.from(base64Image, "base64");

    const [result] = await client.textDetection({ image: { content: buffer } });
    const detections = result.textAnnotations;
    const fullText = detections.length ? detections[0].description : "";

    res.json({ text: fullText });
  } catch (error) {
    res.status(500).json({ error: "OCR failed", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`OCR server running on port ${PORT}`);
});
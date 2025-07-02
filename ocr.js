import express from "express";
import cors from "cors";
import vision from "@google-cloud/vision";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new vision.ImageAnnotatorClient({
  keyFilename: "service-account-key.json",
});

app.post("/api/ocr", async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ error: "No base64 image provided" });
    }

    const [result] = await client.textDetection({
      image: { content: base64 },
    });

    const detections = result.textAnnotations || [];
    const text = detections[0]?.description || "";
    res.json({ text });
  } catch (error) {
    console.error("OCR error:", error);
    res.status(500).json({ error: "OCR failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

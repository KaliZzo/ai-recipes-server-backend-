const express = require("express");
const router = express.Router();
const multer = require("multer");
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const path = require("path");
const OpenAI = require("openai");
const fs = require('fs')

// Configure OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const userPrompt = fs.readFileSync('./prompts/userPrompt.txt', 'utf-8')
const systemPrompt = fs.readFileSync('.//prompts/systemPrompt.txt','utf-8')

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, "audio-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  console.log("File saved:", req.file.path);

  try {
    const transcription = await transcribeAudio(req.file.path);
    const extractedData = await getIngredients(transcription)
    res.json(extractedData).status(200);
    // Delete the file
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

async function transcribeAudio(audioFilePath) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
    });

    console.log("Transcription completed:", transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

async function getIngredients(text) {
  try {
    const ingredients = z.object({
      allIngredients: z.array(z.string()),
    });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `${systemPrompt}` },
        {
          role: "user",
          content: `${userPrompt} ${text}`,
        },
      ],
      response_format: zodResponseFormat(ingredients, "myIngredients"),
    });

    const myIngredients = completion.choices[0].message.parsed;
    return myIngredients
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;

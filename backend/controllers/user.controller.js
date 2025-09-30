const storageService = require('../services/storage.service');
const userModel = require('../models/user.model');
const { v4: uuid } = require("uuid");
const axios = require("axios");
const pdf = require("pdf-parse");
const { InferenceClient } = require('@huggingface/inference');

const client = new InferenceClient(process.env.HF_API_KEY);
const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

// Extract text from PDF
async function fetchPDFText(url) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const data = await pdf(response.data);
    return data.text;
}

// Query LLaMA model
async function queryLLaMA(prompt) {
    try {
        const response = await client.chatCompletion({
            model: MODEL,
            provider: "sambanova",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512,
            temperature: 0.3,
        });

        var generatedText = response.choices[0].message.content;
        generatedText = generatedText.replace(/```json|```/g, '').trim();
        // console.log("LLaMA Response:", generatedText);

        // Parse JSON safely
        let jsonData = {};
        try {
            jsonData = JSON.parse(generatedText);
        } catch (err) {
            console.warn("Failed to parse JSON, returning default structure");
            // Return default keys with null if parsing fails
            jsonData = { name: null, email: null, phone: null };
        }

        // Ensure all keys exist for MongoDB insertion
        jsonData.name = jsonData.name || null;
        jsonData.email = jsonData.email || null;
        jsonData.phone = jsonData.phone || null;

        // console.log("Parsed Data:", jsonData);

        return jsonData;
    } catch (err) {
        console.error("Error querying LLaMA:", err.response?.data || err.message);
        return { name: null, email: null, phone: null };
    }
}

async function queryInterviewQuestions(prompt) {
    try {
        const response = await client.chatCompletion({
            model: MODEL,
            provider: "sambanova",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512,
            temperature: 0.5,
        });

        // Get the model response
        let generatedText = response.choices[0].message.content;
        generatedText = generatedText.replace(/```json|```/g, '').trim();
        // console.log("LLaMA Response:", generatedText);

        // Parse JSON safely
        let jsonData = {};
        try {
            jsonData = JSON.parse(generatedText);
        } catch (err) {
            console.warn("Failed to parse JSON, returning default structure");
            // Default structure if parsing fails
            jsonData = {
                questions: [
                    "Easy question 1",
                    "Easy question 2",
                    "Medium question 1",
                    "Medium question 2",
                    "Hard question 1",
                    "Hard question 2"
                ]
            };
        }

        // Ensure the questions array exists
        if (!jsonData.questions || !Array.isArray(jsonData.questions)) {
            jsonData.questions = [
                "Easy question 1",
                "Easy question 2",
                "Medium question 1",
                "Medium question 2",
                "Hard question 1",
                "Hard question 2"
            ];
        }

        // console.log("Parsed Interview Questions:", jsonData);
        return jsonData;

    } catch (err) {
        console.error("Error querying LLaMA for interview:", err.response?.data || err.message);
        return {
            questions: [
                "Easy question 1",
                "Easy question 2",
                "Medium question 1",
                "Medium question 2",
                "Hard question 1",
                "Hard question 2"
            ]
        };
    }
}


// Upload and parse resume
module.exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Check if file is a PDF
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: "Only PDF files are allowed" });
        }

        // Upload PDF to storage
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());


        // Extract text from PDF
        const extractedText = await fetchPDFText(fileUploadResult.url);


        // Prompt for LLaMA to return clean JSON
        const prompt = `
Extract the Name, Email, and Phone Number from the following resume text.
Return output strictly in JSON format with keys exactly: "name", "email", "phone".
Do NOT include anything else. Do NOT add explanations, extra text, or formatting.
If any field is missing, return null for it.

Resume Text:
${extractedText}
`;

        const interviewPrompt = `
Generate a list of 6 interview questions for a Full-Stack Developer role:
- 2 easy-level questions (20 seconds to answer)
- 2 medium-level questions (60 seconds to answer)
- 2 hard-level questions (120 seconds to answer)

The questions should:
- Be realistic, as if asked by a real interviewer.
- Cover typical full-stack topics: front-end, back-end, databases, APIs, frameworks, deployment, architecture, or project experience.
- Be strictly answerable in a chat-based interview (short text responses, no coding or large essays).
- Respect the time limits (questions must be designed to be reasonably answerable within the allotted time).

Return ONLY the list of 6 questions in strict JSON format like this:

{
  "questions": [
    "Easy question 1",
    "Easy question 2",
    "Medium question 1",
    "Medium question 2",
    "Hard question 1",
    "Hard question 2"
  ]
}
`;




        const interviewQuestions = await queryInterviewQuestions(interviewPrompt);
        // console.log("Interview Questions:", interviewQuestions);


        const structuredData = await queryLLaMA(prompt);

        // Response ready for MongoDB insertion
        res.status(200).json({
            extractedText: extractedText,
            interviewQuestions: interviewQuestions,
            message: "File uploaded and parsed successfully",
            url: fileUploadResult.url,
            text: extractedText,
            data: structuredData // { name, email, phone }
        });

    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: "Failed to upload or process resume" });
    }
};

module.exports.addUserInfo = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: "Fields are required" });
        }
        const isUserAlready = await userModel.findOne({ email });

        if (isUserAlready) {
            return res.status(400).json({ message: 'User already exist' });
        }
        const user = userModel.create({
            name,
            email,
            phone,
            interviewQues: [],
            interviewAns: [],
            interviewSummary: ""
        })
        res.status(200).json({ message: "User info saved", user });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to save user info" });
    }
};



async function generateHiringSummary(questions, answers) {
    const prompt = `
You are an expert recruiter. Based on the following Full-Stack Developer interview questions
and answers, write a concise summary evaluating the candidate's skills, strengths,
weaknesses, and whether they are suitable for hiring.

Return the result strictly in JSON format with two keys:
{
  "summary": "One-paragraph summary here",
  "score": 0-10
}

Questions:
${JSON.stringify(questions)}

Answers:
${JSON.stringify(answers)}
`;

    try {
        const response = await client.chatCompletion({
            model: MODEL,
            provider: "sambanova",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512,
            temperature: 0.5,
        });

        let raw = response.choices[0].message.content;
        raw = raw.replace(/```/g, '').trim();

        let jsonData = { summary: "Summary unavailable", score: 0 };
        try {
            jsonData = JSON.parse(raw);
        } catch (err) {
            console.warn("Failed to parse JSON from AI response, returning default");
        }

        return jsonData;

    } catch (err) {
        console.error("Error generating hiring summary:", err.response?.data || err.message);
        return { summary: "Summary unavailable. Could not generate interview evaluation.", score: 0 };
    }
}



module.exports.saveInterviewQuestionAnswer = async (req, res, next) => {
    try {
        const { email, question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ error: "Question and answer are required" });
        }
        const user = await userModel.findOne({
            email: email
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.interviewQues = question;
        user.interviewAns = answer;

        const summary = await generateHiringSummary(question, answer);
        user.interviewSummary = summary.summary;
        user.interviewScore = summary.score;
        await user.save();

        res.status(200).json({ message: "Interview Saved", user });
    } catch (err) {
        res.status(500).json({ error: "Failed to save question and answer" });
    }
};


exports.getAllCandidates = async (req, res) => {
    try {
        const users = await userModel.find().sort({ interviewScore: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



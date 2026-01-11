const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const Ably = require("ably");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

const app = express();
mongoose.connect("xyz");
const ABLY_API_KEY = "XYZ"; 

const API_KEY ="XYZ"; 
const ably = new Ably.Rest(ABLY_API_KEY);
app.set('view engine', 'ejs');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
});

const userModel = mongoose.model("user", userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile("public/fusi.html", { root: __dirname });
});

/* ================= REGISTER ================= */
app.get('/create', (req, res) => {
    res.render('create', { error: req.query.error });
});



app.post('/create', async (req, res) => {
    let { username, email, password, age } = req.body;

    if (!username || !email || !password || !age) {
        return res.redirect("/?error=emptyfields");
    }

    age = Number(age);
    if (isNaN(age) || age < 18 || age > 100) {
        return res.redirect("/?error=invalidage");
    }

    let exists = await userModel.findOne({ email });
    if (exists) return res.redirect("/?error=emailexists");

    const hash = await bcrypt.hash(password, 10);

    await userModel.create({ username, email, password: hash, age });

    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render('login', { error: req.query.error });
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.redirect("/login?error=emptyfields");
    }

    let user = await userModel.findOne({ email });
    if (!user) return res.redirect("/?error=notfound");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login?error=wrongpassword");

    let token = jwt.sign({ email: user.email }, "xyzz");
    res.cookie("token", token);
    res.sendFile("public/chatting.html", { root: __dirname });
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/create");
});

app.get('/chatbot', (req, res) => {
    res.sendFile("public/chatbot.html", { root: __dirname })
});

app.post("/chatbot", async (req, res) => {
try {
    const userMessage = req.body.message;

    const response = await fetch(
      // Using the v1 endpoint for gemini-2.5-flash
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `
You are CampusCircle Assistant.
You help college students with:
- campus events
- academics and exams
- notes sharing
- student doubts
- technical discussions

Answer in a simple, friendly, student-style tone.
Do NOT talk about unrelated topics like politics, celebrities, or random AI stuff.

Student question:
${userMessage}
          `
        }
      ]
    }
  ]
})

      }
    );

    const data = await response.json();
    console.log("GEMINI RAW RESPONSE:", data);

    // 1. Check for API errors (HTTP 4xx/5xx) explicitly captured in the JSON body
    if (data.error) {
        console.error("Gemini API Error:", data.error.message);
        // Using return here stops execution immediately
        return res.status(data.error.code || 500).json({ reply: `API Error: ${data.error.message}` });
    }
    
    // ⭐ THE GUARANTEED PARSING FIX ⭐
    // Use optional chaining for robustness, falling back to a detailed error message.
    let reply = 
      data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "The model returned a successful response, but the text part was empty or not found. Check the console for safety warnings.";
      
    // 2. Check for safety blocks if the text is empty
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text && data.candidates?.[0]?.finishReason === 'SAFETY') {
        reply = "I cannot generate a response for that prompt due to safety settings.";
    }

    res.json({ reply });

  } catch (err) {
    // This catches network errors or JSON parsing errors
    console.error("FETCH/SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error occurred during the API request." });
  }
});

app.get('/chatting', (req, res) => {
    res.sendFile("public/chatting.html", { root: __dirname })
});

// app.js mein isse replace kar do
app.get('/token', async (req, res) => {
    try {
        const tokenRequest = await ably.auth.createTokenRequest({
            clientId: req.query.clientId // Frontend se username yahan aayega
        });
        res.json(tokenRequest);
    } catch (e) {
        res.status(500).send("Ably Error: " + e.message);
    }
});



app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});





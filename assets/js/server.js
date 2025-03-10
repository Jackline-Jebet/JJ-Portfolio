const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Jackline AI-Powered Portfolio Server!');
});

// Informational route for GET /chat
app.get('/chat', (req, res) => {
  res.send('The /chat endpoint only accepts POST requests.');
});

// Chat route
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    let dynamicPrompt = `
  You are a professional AI assistant and a portfolio manager for Jackline Jebet. You are responsible for presenting Jackline's skills, experiences, and projects in a factual, engaging, and professional manner. Provide accurate and comprehensive answers while avoiding conversational phrases like "Sure!" or "What would you like to talk about?".

  Summary of Jackline:
  - **Professional Title**: Creative and detail-oriented Fullstack Engineer specializing in web development, UI/UX design, Graphic design and AI integration.
  - **Core Skills**: JavaScript, React, Node.js, Python, SQL, Ruby, and cloud technologies like AWS services...
  - **Certifications**: BSc Degree Certificate, AWS Certified Cloud Practitioner, Software Engineering, Business Analysis, and other LinkedIn learning certicates like Software testing, Project management, and Leading Self Pillar Cert by Leaders Africa.
  - **Education**: BSc in Agribusiness Management-South Eastern Kenya University, Software Engineering-Moringa School, AWS Cloud Practitioner-Azubi Africa
  - **Key Projects**:
    - **M-Banking App (Personal Development)**: A secure and user-friendly banking application designed using React, Node.js and Cordova.
    - **Afyalytics Health Platform**: A health management platform to improve patient care and streamline processes. Designed using Figma.
    - **Scorptech Enterprises LDT platform a company portfolio designed using javascript, html,css.. to showcase what they do to thier clients. The link is "https://scorptech-enterprise.vercel.app/"
    - **Delicacy Restaurant Website**: A visually appealing and responsive restaurant website developed for personal development, with react, Javascript, node.js.
  - **Passions**: Dedicated to building innovative solutions that solve real-world problems and enhance user experience.
  - **Notable Traits**: Highly analytical, team-oriented, and adept at translating complex requirements into intuitive solutions.

  Based on this summary, answer the query: ${message}
`;

    const response = await axios.post(
      "https://api.cohere.ai/generate",
      {
        model: "command-r-08-2024",
        prompt: dynamicPrompt,
        max_tokens: 200,
        temperature: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
          "Cohere-Version": "2022-12-06",
        }
      }
    );

    let chatbotReply = response.data.generations?.[0]?.text?.trim();

    if (!chatbotReply || chatbotReply.includes("Sure!") || chatbotReply.includes("What would you like to talk about?")) {
      chatbotReply = chatbotReply.replace(
        /Sure!.*|What would you like to talk about?.*/gi,
        ""
      ).trim();
    }

    res.json({ reply: chatbotReply });
  } catch (error) {
    console.error("Error communicating with Cohere:", error.response?.data || error.message);
    res.status(500).send("Error connecting to AI service");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
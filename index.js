const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq SDK with your API key
const groq = new Groq({
  apiKey: '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'
});

// Endpoint to handle chat completions
app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate that `prompt` is provided
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: "'prompt' must be a non-empty string." });
    }

    // Custom message for fake news detection
    const systemMessage = {
      role: 'system',
      content: "If the user mentions encountering fake news, provide multiple ethical ways they can take action. Suggest verifying sources, reporting to authorities, educating others, and promoting media literacy."
    };

    // Convert the prompt to the expected `messages` array
    const messages = [
      systemMessage,
      { role: 'user', content: prompt }
    ];

    // Call the Groq SDK
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    // Extract and format the assistant's response
    const assistantMessage = chatCompletion.choices?.[0]?.message?.content || "No response from the assistant.";
    res.json({ response: assistantMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

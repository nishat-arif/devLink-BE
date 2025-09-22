
const express = require('express');
const openAiRouter = express.Router(); //creates authRouter

const { OpenAI } = require('openai'); // OpenAI SDK v4+


// Initialize OpenAI client ...
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for generating bio suggestions
openAiRouter.post('/generate-bio-suggestions', async (req, res) => {
  const { skills, hobbies } = req.body;

  if (!skills|| !hobbies) {
    return res.status(400).json({ error: 'Skills and hobbies are required.' });
  }

  try {
    const prompt = `Generate a creative profile bio suggestions for a user with the following skills and hobbies:
                    skills: ${skills}
                    hobbies: ${hobbies}
                    Please provide a variety of tones (e.g., witty, adventurous, romantic, quirky) and aim for around 1-2 sentences per bio . sentences should be without use of any special escape sequence and without any new line.
                    Result should be comma seperated like the example given ahead.
                    I am a javacsript developer, i love to travel , i  love hanging out`;

    const completion = await openai.chat.completions.create({
      model:  "gpt-3.5-turbo", // You can choose a different model based on your needs and budget
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200, // Adjust as needed
      n: 3, // Generate 3 suggestions
    });

    const bioSuggestions = completion.choices.map(choice => choice.message.content.trim());
    res.json({ bioSuggestions});
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate bio suggestions.' });
  }
});

module.exports = openAiRouter;

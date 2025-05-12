const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        // `node-fetch`를 동적으로 불러오기
        const fetch = (await import('node-fetch')).default;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userInput }]
            })
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
            throw new Error(`API Error: ${data.error ? data.error.message : 'Unknown error'}`);
        }

        const chatbotMessage = data.choices[0].message.content.trim();
        res.json({ message: chatbotMessage });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Error processing request" });
    }
});

console.log("Server is starting...");

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

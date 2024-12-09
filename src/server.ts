import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

interface ChatRequest {
    message: string;
}

interface ChatResponse {
    response: string;
}

const app = express();
const port: number = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/chat', async (req: Request<{}, {}, ChatRequest>, res: Response<ChatResponse | { error: string }>) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not found in environment variables');
        }

        const { message } = req.body;
        
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Generate response
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

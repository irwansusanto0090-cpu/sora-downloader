import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

// Main API Proxy
app.post('/api/sora-download', async (req, res) => {
    try {
        const response = await fetch("https://vid7.link/api/sora-download", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Video Download Proxy
app.get('/api/video-proxy', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).send('Missing video URL');

        const response = await fetch(videoUrl);
        if (!response.ok) return res.status(response.status).send('Failed to fetch video');

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="sora-video-${Date.now()}.mp4"`);

        response.body.pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).send('Internal Server Error');
    }
});

// Export for Vercel
export default app;

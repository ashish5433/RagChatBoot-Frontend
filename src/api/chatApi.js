import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function fetchHistory(sessionId) {
    const response = await axios.get(`${API_BASE_URL}/session/${sessionId}/history`);
    const messages = [];
    response.data.history.forEach(item => {
        messages.push({ role: 'user', text: item.query });
        messages.push({ role: 'assistant', text: item.answer });
    });
    return messages;
}


export async function resetSession(sessionId) {
    const response = await axios.delete(`${API_BASE_URL}/session/${sessionId}`);
    return response.data;
}


export async function streamChatResponse({ sessionId, query, onChunk }) {
    let lastProcessedPosition = 0;
    await axios({
        method: 'POST',
        url: `${API_BASE_URL}/chat`,
        data: {
            session_id: sessionId,
            query
        },
        headers: {
            'Content-Type': 'application/json'
        },
        onDownloadProgress: (progressEvent) => {
            const responseText = progressEvent.event.currentTarget.responseText;
            const newChunk = responseText.substring(lastProcessedPosition);
            lastProcessedPosition = responseText.length;
            const lines = newChunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.substring(6));
                        if (data.text) {
                            onChunk(data.text);
                        }
                    } catch (e) {
                        console.error("Error parsing stream data:", e);
                    }
                }
            }
        }
    });
}
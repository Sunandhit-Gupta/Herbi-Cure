
async function   getAiResponse (prompt) {

    try {
        // Step 1: Create Chat Session
        const sessionResponse = await fetch('https://gateway-dev.on-demand.io/chat/v1/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'ZkNPJIOGJ6CHcdT1PaXhnIcdcSVwcKB2',
            },
            body: JSON.stringify({
                "pluginIds": ["plugin-1717418141"],
                "externalUserId": "Phase",
            }),
        });

        const sessionData = await sessionResponse.json();
        const sessionId = sessionData.data.id;

        // Step 2: Answer Query using session ID from Step 1
        const queryResponse = await fetch(`https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'ZkNPJIOGJ6CHcdT1PaXhnIcdcSVwcKB2',
            },
            body: JSON.stringify({
                "endpointId": "predefined-openai-gpt4o",
                "query": prompt,
                "pluginIds": ["plugin-1717418141"],
                "responseMode": "sync",
            }),
        });

        const queryData = await queryResponse.json();

        const answer = queryData.data.answer;
        return answer;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export { getAiResponse };

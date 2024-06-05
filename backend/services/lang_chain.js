import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

const ollama = new Ollama({
    model: "llama3",
});


const template = " {restaurant_type} . The returned answer should be within 100 words ans it should be written in mardown language";


const promptTemp = new PromptTemplate({
    template: template,
    inputVariables: ["restaurant_type"],
});

const chain = new LLMChain({
    llm: ollama,
    prompt: promptTemp
});


async function   getAiResponse (country) {

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
        const sessionId = sessionData.chatSession.id;

        // Step 2: Answer Query using session ID from Step 1
        const queryResponse = await fetch(`https://gateway-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'ZkNPJIOGJ6CHcdT1PaXhnIcdcSVwcKB2',
            },
            body: JSON.stringify({
                "endpointId": "predefined-openai-gpt4o",
                "query": country,
                "pluginIds": ["plugin-1717418141"],
                "responseMode": "sync",
            }),
        });

        
        const queryData = await queryResponse.json();
        const answer = queryData.chatMessage.answer;
        console.log(answer);
        return answer;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export { getAiResponse };

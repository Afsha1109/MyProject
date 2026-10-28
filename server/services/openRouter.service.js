import axios from "axios"

export const askAi = async (messages) => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error("Messages array is empty.");
    }

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
        throw new Error("OpenRouter API key is not configured. Set OPENROUTER_API_KEY in the server environment.");
    }

    const configuredModel = process.env.OPENROUTER_MODEL?.trim() || "google/gemma-4-31b-it:free";
    const fallbackModels = process.env.OPENROUTER_FALLBACK_MODELS
        ?.split(",")
        .map((model) => model.trim())
        .filter(Boolean)
        || ["nvidia/nemotron-3.5-lightning:free", "liquid/lfm-2.5-2.6b:free"];
    const models = [...new Set([configuredModel, ...fallbackModels])];
    let lastError;

    for (const model of models) {
        try {
            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model,
                    messages,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            const content = response?.data?.choices?.[0]?.message?.content;
            if (typeof content !== "string" || !content.trim()) {
                throw new Error("OpenRouter returned an empty response.");
            }

            return content;
        } catch (error) {
            const status = error.response?.status;
            const providerMessage = error.response?.data?.error?.message
                || error.response?.data?.message
                || error.message
                || "Unknown error";
            lastError = new Error(
                `OpenRouter request failed${status ? ` (${status})` : ""} using ${model}: ${providerMessage}`,
                { cause: error },
            );

            if (status !== 429 && (!status || status < 500)) {
                throw lastError;
            }
            console.warn(lastError.message);
        }
    }

    throw lastError;
}

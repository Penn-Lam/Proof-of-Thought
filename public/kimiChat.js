const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: "sk-2PGuE8Z4KB9i1M8CSdd3KVtk2NhiU6R8I7z4TTFqbucPPCvX",
    baseURL: "https://api.moonshot.cn/v1",
});

/**
 * 调用Kimi分析对话，输出思维节点和边
 * @param {Array} dialog 用户与AI的对话数组
 * @returns {Promise<Object>} { nodes: [...], edges: [...] }
 */
async function analyzeThinking(dialog) {
    const dialogText = dialog.map(d => `${d.role}: ${d.content}`).join('\n');
    const prompt = `
    你现在是一个思维过程分析助手。请根据下面的对话，分析用户的思维过程，输出Json格式，包含：
    {
        "nodes": [
            {"id": "1", "label": "思维点1"},
            {"id": "2", "label": "思维点2"}
        ],
        "edges": [
            {"from": "1", "to": "2", "label": "关联说明"}
        ]
    }
    只返回符合上述格式的Json，不要输出多余内容。
    对话内容如下：
    ${dialogText}
    `;

    const completion = await client.chat.completions.create({
        model: "moonshot-v1-auto",
        messages: [
            {role: "system", content: "你是一个思维过程分析助手"},
            {role: "user", content: prompt}
        ],
        response_format: {type: "json_object"},
        temperature: 0.6
    });
    
    try {
        const content = completion.choices[0].message.content;
        return JSON.parse(content);
    } catch (e) {
        throw new Error("Kimi返回内容无法解析为JSON");
    }
}

module.exports = analyzeThinking;
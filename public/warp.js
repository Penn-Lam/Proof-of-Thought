const warpEl = document.getElementById("warp-text");

let i = 0;
let warpText = '';

const TYPE_DELAY = 50;
const BAR_DELAY = 500;

function generatePotText() {
    const { scene, potData } = linkData;
    let thoughtText = '';

    switch (scene) {
        case 'ai_chat':
            thoughtText = `> 分享者的洞察:\n> "${potData.insight}"\n|\n> 个人解读:\n> "${potData.interpretation}"\n|\n> 关键问题:\n> "${potData.query}"`;
            break;
        case 'ai_art':
            thoughtText = `> 创作意图:\n> "${potData.vision}"\n|\n> 魔法咒语:\n> "${potData.prompt}"\n|\n> 策展选择:\n> "${potData.choice}"`;
            break;
        case 'ai_code':
            thoughtText = `> 解决的问题:\n> "${potData.problem}"\n|\n> 架构决策:\n> "${potData.decision}"\n|\n> 人类监督:\n> "${potData.oversight}"`;
            break;
        case 'general':
            thoughtText = `> 分享者的思考:\n> "${potData.thought}"`;
            break;
        default:
            thoughtText = `> 分享者的思考:\n> "这是一个值得分享的内容"`;
    }

    return `[OK] Human Cognitive Signature Verified.\n[INFO] Injecting Thought-Payload:\n|\n|\n${thoughtText}\n|\n> Establishing quantum tunnel to target vector...\n> Target: ${warpUrl}\n> Engaging Warp Drive in T-minus: [3]...[2]...[1]...\n>>> CONNECTION ESTABLISHED. ENGAGE!`;
}

warpText = generatePotText();

function typewrite() {
    if (i < warpText.length) {
        if (warpText[i] === "|") {
            i++;
            setTimeout(typewrite, BAR_DELAY);
            return;
        }

        warpEl.innerHTML += warpText[i];

        i++;
        setTimeout(typewrite, TYPE_DELAY);
    } else {
        setInterval(rampSpeed, 5);
        setTimeout(redirect, 1500);
    }
}

function rampSpeed() {
    warpSpeed = constrain(warpSpeed + 0.2, 0, 20);
}

function redirect() {
    window.location.replace(warpUrl);
}

// 启动打字机效果
typewrite();

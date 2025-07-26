/**
 * Proof-of-Thought (PoT) 前端交互逻辑
 * 处理场景选择、动态表单生成、表单提交等功能
 */

// 场景配置
const SCENE_CONFIGS = {
    ai_chat: {
        title: '分享AI聊天记录',
        description: '展示你的提问能力和洞察力',
        fields: [
            {
                id: 'insight',
                name: 'insight',
                label: '核心洞察',
                type: 'text',
                placeholder: '你从这次对话中获得的最重要的洞察是什么？',
                required: true
            },
            {
                id: 'interpretation',
                name: 'interpretation',
                label: '个人解读',
                type: 'textarea',
                placeholder: 'AI给出了什么答案？你如何理解和补充这个答案？',
                required: true
            },
            {
                id: 'query',
                name: 'query',
                label: '关键问题',
                type: 'textarea',
                placeholder: '你向AI提出的最核心的问题是什么？',
                required: true
            }
        ],
        copyTemplate: '我刚才和AI就这个话题聊过，如果你需要的话，可以和你分享一个记录：{short_link}'
    },
    ai_art: {
        title: '分享AI生成的艺术作品',
        description: '展示你的审美构思和创意表达',
        fields: [
            {
                id: 'vision',
                name: 'vision',
                label: '创作意图',
                type: 'text',
                placeholder: '你希望这幅作品传达怎样的情绪、故事或美学概念？',
                required: true
            },
            {
                id: 'prompt',
                name: 'prompt',
                label: '魔法咒语',
                type: 'textarea',
                placeholder: '在引导AI的提示词中，你认为最画龙点睛的关键词或短语是什么？',
                required: true
            },
            {
                id: 'choice',
                name: 'choice',
                label: '万里挑一',
                type: 'textarea',
                placeholder: '这张作品是AI一次生成的惊喜，还是你从众多结果里精心挑选的？为什么偏偏是它？',
                required: true
            }
        ],
        copyTemplate: '我用AI创作了一幅作品，它背后有我的一个想法。你可以通过这个链接感受一下，顺便看看我的创作思路：{short_link}'
    },
    ai_code: {
        title: '分享AI辅助的代码',
        description: '展示你的架构能力和工程严谨性',
        fields: [
            {
                id: 'problem',
                name: 'problem',
                label: '解决的问题',
                type: 'text',
                placeholder: '这段代码的核心目标是修复什么Bug或实现什么功能？',
                required: true
            },
            {
                id: 'decision',
                name: 'decision',
                label: '架构决策',
                type: 'textarea',
                placeholder: 'AI可能提供了多种实现方案，你最终选择并优化为当前方案的决策逻辑是什么？',
                required: true
            },
            {
                id: 'oversight',
                name: 'oversight',
                label: '人类监督',
                type: 'textarea',
                placeholder: '你对AI生成的代码做了哪些关键性的修改、重构或安全加固？',
                required: true
            }
        ],
        copyTemplate: '<p align="center">\n  <a href="{short_link}" target="_blank">\n    <img src="https://raw.githubusercontent.com/Penn-Lam/Proof-of-Thought/283761aded274cdeb2eafca629d8a9c1c4f5ea1a/Assets/PoT%20Badge.svg" alt="PoT Badge" width="60">\n  </a>\n</p>'
    },
    general: {
        title: '通用分享',
        description: '为任何内容添加你的思考',
        fields: [
            {
                id: 'thought',
                name: 'thought',
                label: '你的思考',
                type: 'textarea',
                placeholder: '请分享你对这个内容的思考、观点或补充...',
                required: true
            }
        ],
        copyTemplate: '我想和你分享一个内容，以及我的一些思考：{short_link}'
    }
};

let sceneSelect;
let potFormContainer;
let dynamicFormFields;
let submitBtn;
let mainContainer;
let successContainer;

document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    bindEvents();
});

function initializeElements() {
    sceneSelect = document.getElementById('scene-select');
    potFormContainer = document.getElementById('pot-form-container');
    dynamicFormFields = document.getElementById('dynamic-form-fields');
    submitBtn = document.getElementById('submit-btn');
    mainContainer = document.getElementById('main-container');
    successContainer = document.getElementById('success-container');
}

function bindEvents() {
    sceneSelect.addEventListener('change', handleSceneChange);
    
    document.getElementById('pot-form').addEventListener('submit', handleFormSubmit);

    document.addEventListener('click', function(e) {
        if (e.target.id === 'copy-button') {
            handleCopyClick(e);
        }
        if (e.target.id === 'create-another') {
            handleCreateAnother();
        }
    });
    
    document.addEventListener('input', validateForm);
}

function handleSceneChange() {
    const selectedScene = sceneSelect.value;
    
    if (!selectedScene) {
        potFormContainer.style.display = 'none';
        submitBtn.disabled = true;
        return;
    }
    
    generateDynamicForm(selectedScene);
    potFormContainer.style.display = 'block';
    validateForm();
}

function generateDynamicForm(scene) {
    const config = SCENE_CONFIGS[scene];
    if (!config) return;
    
    dynamicFormFields.innerHTML = '';
    
    const description = document.createElement('p');
    description.className = 'scene-description';
    description.textContent = config.description;
    dynamicFormFields.appendChild(description);
    
    config.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
        
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.id = field.id;
        input.name = field.name;
        input.placeholder = field.placeholder;
        input.required = field.required;
        input.className = 'pot-field';
        
        formGroup.appendChild(input);
        dynamicFormFields.appendChild(formGroup);
    });
}

function validateForm() {
    const url = document.getElementById('url').value;
    const scene = sceneSelect.value;
    
    if (!url || !scene) {
        submitBtn.disabled = true;
        return;
    }
    
    // 检查PoT字段是否都已填写
    const potFields = document.querySelectorAll('.pot-field[required]');
    const allFilled = Array.from(potFields).every(field => field.value.trim() !== '');
    
    submitBtn.disabled = !allFilled;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const scene = formData.get('scene');
    
    const potData = {};
    const config = SCENE_CONFIGS[scene];
    config.fields.forEach(field => {
        potData[field.name] = formData.get(field.name);
    });
    
    const copyTemplate = getCopyTemplate(scene);
    
    try {
        const grabRes = await fetch('/grab-dialog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: formData.get('url') })
        });
        if (grabRes.ok) {
            const grabData = await grabRes.json();
            if (grabData.success && Array.isArray(grabData.dialogs)) {
                potData["dialog"] = grabData.dialogs;
            }
        }
    } catch (err) {
        // 可以选择忽略抓取失败，或提示用户
        console.warn('抓取对话失败', err);
    }

    if(potData.dialog && potData.dialog.length > 0) {
        try {
            const res = await fetch('/analyze-thinking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dialog: potData.dialog })
                });
            const data = await res.json();
            console.log("aaaaa",data);
        } catch (err) {
            console.error('分析思维错误', err);
        }
    }


    const submitData = {
        url: formData.get('url'),
        path: formData.get('path'),
        scene: scene,
        potData: potData,
        copyTemplate: copyTemplate
    };

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = '创建中...';
        
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData)
        });
        
        if (response.ok) {
            const shortLink = await response.text();
            const copyText = copyTemplate.replace('{short_link}', shortLink);
            showSuccess(shortLink, copyText);

        } else {
            const errorText = await response.text();
            alert('创建失败: ' + errorText);
        }
    } catch (error) {
        alert('网络错误: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '创建PoT链接';
    }
}

function getCopyTemplate(scene) {
    const config = SCENE_CONFIGS[scene];
    return config ? config.copyTemplate : '查看这个链接：{short_link}';
}

function showSuccess(shortLink, copyText) {
    mainContainer.style.display = 'none';
    successContainer.style.display = 'block';
    
    document.getElementById('short-link-display').textContent = shortLink;
    document.getElementById('copy-text-display').textContent = copyText;
    
    const copyButton = document.getElementById('copy-button');
    copyButton.setAttribute('data-copy-text', copyText);
}

async function handleCopyClick(e) {
    const copyText = e.target.getAttribute('data-copy-text');
    
    try {
        await navigator.clipboard.writeText(copyText);
        
        const originalText = e.target.textContent;
        e.target.textContent = 'Copied';
        e.target.style.backgroundColor = '#844C21';
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.backgroundColor = '';
        }, 2000);
    } catch (err) {
        // 降级方案：使用传统的复制方法
        const textArea = document.createElement('textarea');
        textArea.value = copyText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Copied');
    }
}

function handleCreateAnother() {
    successContainer.style.display = 'none';
    mainContainer.style.display = 'block';
    
    document.getElementById('pot-form').reset();
    potFormContainer.style.display = 'none';
    submitBtn.disabled = true;
}

if (typeof window !== 'undefined') {
    window.getCopyTemplate = getCopyTemplate;
    window.showSuccess = showSuccess;
    window.SCENE_CONFIGS = SCENE_CONFIGS;
}

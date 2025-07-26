const warpEl = document.getElementById("warp-text");
let i = 0;
let warpText = '';

const TYPE_DELAY = 10;
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
        // 检查是否存在思维导图数据
        if (linkData.potData && linkData.potData.thinkingMap && linkData.potData.thinkingMap.data) {
            // 在打字机效果结束后展示思维导图，并隐藏打字机内容
            warpEl.style.display = 'none';
            showMindMap();
        } else {
            setInterval(rampSpeed, 5);
        }
    }
}

function rampSpeed() {
    warpSpeed = constrain(warpSpeed + 0.2, 0, 20);
}

function redirect() {
    window.location.replace(warpUrl);
}

// 展示思维导图的新函数
function showMindMap() {
    // 确保思维导图数据存在且有效
    if (!linkData.potData || !linkData.potData.thinkingMap || !linkData.potData.thinkingMap.data) {
        console.error('思维导图数据缺失或无效');
        setTimeout(redirect, 1500);
        return;
    }
    
    console.log(linkData.potData.thinkingMap.data)
    // 创建一个新的div来展示思维导图
    const container = document.createElement('div');
    container.id = 'mindmap-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        color: white;
    `;
    
    // 添加头部信息
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 0, 0, 0);
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'Thought Map';
    title.style.margin = '0';
    
    const originalLink = document.createElement('a');
    originalLink.href = warpUrl;
    originalLink.target = '_blank';
    originalLink.textContent = 'Original Link';
    originalLink.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(135deg, #ea5455 0%, #9856b4ff 100%);
        color: white;
        text-decoration: none;
        border-radius: 25px;
        border: none;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: inline-flex;
        align-items: center;
        justify-content: center;
    `;
    
    originalLink.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    };
    
    originalLink.onmouseout = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    };
    
    header.appendChild(title);
    header.appendChild(originalLink);
    
    // 添加图表容器
    const chartContainer = document.createElement('div');
    chartContainer.id = 'mindmap-chart';
    chartContainer.style.cssText = `
        flex: 1;
        min-height: 0;
    `;
    
    // 添加跳转信息
    
    container.appendChild(header);
    container.appendChild(chartContainer);
    
    // 添加到页面
    document.body.appendChild(container);
    
    // 初始化ECharts
    const myChart = echarts.init(chartContainer);
    
    // 获取思维导图数据
    let mindmapData = linkData.potData.thinkingMap.data;
    if (!mindmapData || typeof mindmapData !== 'object') {
        console.error('无效的思维导图数据格式');
        setTimeout(redirect, 1500);
        return;
    }
    
    // 设置思维导图选项
    const option = {
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: function(params) {
                // 当悬停在节点上时显示节点名称和详细信息
                if (params.dataType === 'node') {
                    // 如果节点有text属性，则显示text，否则显示name
                    let content = params.data?.text || params.name;
                    // 每20个字换行
                    content = content.replace(/(.{20})/g, '$1<br/>');
                    return `${params.name}<br/>${content}`;
                }
                return params.name;
            }
        },
        animationEasingUpdate:'quinticInOut',
        darkMode: true,
        series: [
            {
                type: 'graph',
                layout: 'force',
                animation: true,
                darkMode: true,
                data: mindmapData.nodes.map((node, index) => {
                    // 定义一组渐变色，使用指定的主要配色
                    const gradients = [
                        {
                            type: 'linear',
                            x: 0, y: 0, x2: 1, y2: 1,
                            colorStops: [{ offset: 0, color: '#ffd460' }, { offset: 1, color: '#f07b3f' }]
                        },
                        {
                            type: 'linear',
                            x: 0, y: 0, x2: 1, y2: 1,
                            colorStops: [{ offset: 0, color: '#ea5455' }, { offset: 1, color: '#ffd460' }]
                        },
                        {
                            type: 'linear',
                            x: 0, y: 0, x2: 1, y2: 1,
                            colorStops: [{ offset: 0, color: '#ffd460' }, { offset: 1, color: '#9856b4ff' }]
                        },
                        {
                            type: 'linear',
                            x: 0, y: 0, x2: 1, y2: 1,
                            colorStops: [{ offset: 0, color: '#9856b4ff' }, { offset: 1, color: '#ffd460' }]
                        }
                    ];
                    
                    return {
                        id: node.id,
                        name: node.name,
                        value: node.symbolSize || 10,
                        symbolSize: node.symbolSize || 10,
                        text: node.text,
                        draggable: true, // 允许节点拖拽
                        label: {
                            show: true,
                            position: 'inside', // 将标签位置设置为节点内部
                            formatter: '{b}', // 显示节点名称
                            color: '#ffffff', // 白色字体
                            fontFamily: 'sans-serif', // 字体
                            fontSize: 14, // 增大字体大小
                            fontWeight: 'bold', // 加粗字体提高可读性
                            textBorderColor: '#000000', // 添加黑色描边
                            textBorderWidth: 2, // 设置描边宽度
                            padding: [5, 10] // 添加内边距
                        },
                        itemStyle: {
                            color: gradients[index % gradients.length], // 使用渐变色
                            borderColor: '#000000ff', // 添加边框
                            borderWidth: 2, // 边框宽度
                            shadowColor: 'rgba(0, 0, 0, 0.3)', // 添加阴影
                            shadowBlur: 10 // 阴影模糊度
                        },
                        emphasis: {
                            label: {
                                fontSize: 16, // 悬浮时增大字体
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                borderColor: '#000000', // 悬浮时改变边框颜色
                                borderWidth: 3, // 悬浮时增加边框宽度
                                shadowBlur: 15, // 悬浮时增强阴影效果
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    };
                }),
                links: mindmapData.links.map(link => {
                    return {
                        source: link.source,
                        target: link.target,
                        value: link.value || 1,
                        lineStyle: {
                            width: link.value ? Math.min(link.value * 2, 8) : 3, // 增加连线宽度
                            curveness: 0.3,
                            color: 'rgba(255, 255, 255, 1)', // 增加连线亮度，设置不透明
                            opacity: 1 // 设置透明度为0
                        },
                        label: {
                            show: false,
                            formatter: link.name,
                            color: '#ffffff', // 默认白色字体
                            fontSize: 12,
                            position: 'middle' // 将连线标签放置在连线中间位置
                        },
                        emphasis: {
                            lineStyle: {
                                width: link.value ? Math.min(link.value * 3, 12) : 6, // 悬浮时更宽的连线
                                color: '#ffd700' // 悬浮时使用金色（宝色）
                            },
                            label: {
                                formatter: link.name,
                                color: '#ffd700', // 悬浮时字体变为金色（宝色）
                                fontWeight: 'bold'
                            }
                        }
                    };
                }),
                force: {
                    repulsion: 400, // 增加节点之间的斥力，使节点分散
                    gravity: 0.1,
                    edgeLength: [150, 300], // 增加边长范围，使节点分布更开
                    layoutAnimation: true,
                },
                roam: false, // 禁止整体漫游
                focusNodeAdjacency: true,
                hoverAnimation: true,
                label: {
                    position: 'inside', // 将标签位置设置为节点内部
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 10
                    }
                }
            }
        ]
    };
    
    // 渲染图表
    myChart.setOption(option);
    
    // 手动跳转功能由按钮触发，无需自动跳转
}

// 启动打字机效果
typewrite();
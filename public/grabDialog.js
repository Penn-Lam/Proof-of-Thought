const fs = require('fs');
const cheerio = require('cheerio');
const https = require('https');
const http = require('http');

// 动态导入 puppeteer，如果没有安装则回退到基本功能
let puppeteer = null;
try {
    puppeteer = require('puppeteer');
} catch (error) {
    console.warn('Puppeteer 未安装，将使用基本的 HTTP 请求方式。要支持动态网页，请运行: npm install puppeteer');
}

// 兼容不同版本的 Puppeteer 的等待函数
async function waitForDelay(page, ms) {
    if (page.waitForDelay) {
        await page.waitForDelay(ms);
    } else if (page.waitForTimeout) {
        await page.waitForTimeout(ms);
    } else {
        // 回退到原生 setTimeout
        await new Promise(resolve => setTimeout(resolve, ms));
    }
}

async function grabDialog(urlOrPath, options = {}) {
    // 判断是 URL 还是本地文件路径
    const isUrl = urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://');

    if (isUrl) {
        // 检查是否是需要 JavaScript 渲染的网站
        const needsJSRendering = isJavaScriptSite(urlOrPath);

        if (needsJSRendering && puppeteer) {
            console.log('检测到 JavaScript 网站，使用 Puppeteer 进行渲染...');
            return await grabWithPuppeteer(urlOrPath, options);
        } else if (needsJSRendering && !puppeteer) {
            console.log('警告: 检测到 JavaScript 网站但 Puppeteer 未安装，使用基础 HTTP 请求（可能无法获取完整内容）');
        }

        // 使用基础 HTTP 请求
        return await grabWithHttp(urlOrPath);
    } else {
        // 处理本地文件
        try {
            const html = fs.readFileSync(urlOrPath, 'utf-8');
            const dialogs = parseHtml(html);
            return dialogs;
        } catch (error) {
            throw error;
        }
    }
}

// 判断是否是需要 JavaScript 渲染的网站
function isJavaScriptSite(url) {
    const jsPatterns = [
        'gemini.google.com',
        'chat.openai.com',
        'claude.ai',
        'poe.com',
        'character.ai'
    ];

    return jsPatterns.some(pattern => url.includes(pattern));
}

// 使用 Puppeteer 抓取动态内容
// 浏览器实例缓存
let cachedBrowser = null;
let browserLastUsed = 0;
const BROWSER_CACHE_TIMEOUT = 5 * 60 * 1000; // 5分钟缓存

// 获取或创建浏览器实例
async function getBrowser(headless = true) {
    const now = Date.now();

    // 如果有缓存的浏览器且未超时，复用它
    if (cachedBrowser && (now - browserLastUsed) < BROWSER_CACHE_TIMEOUT) {
        try {
            await cachedBrowser.version();
            browserLastUsed = now;
            return { browser: cachedBrowser, isNew: false };
        } catch (error) {
            cachedBrowser = null;
        }
    }

    // 创建新的浏览器实例
    console.log('启动新的浏览器实例...');
    const browser = await puppeteer.launch({
        headless,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    });

    cachedBrowser = browser;
    browserLastUsed = now;
    return { browser, isNew: true };
}

async function grabWithPuppeteer(url, options = {}) {
    const {
        waitTime = 5000,           // 增加默认等待时间到5秒
        waitForSelector = null,
        headless = true,
        timeout = 30000,          // 增加超时时间到30秒
        useCache = true,          // 是否使用浏览器缓存
        waitForNetworkIdle = true, // 是否等待网络空闲
        minDialogs = 2,           // 最少对话数量
        maxWaitForDialogs = 30000 // 等待对话的最大时间(毫秒)
    } = options;

    let browser = null;
    let shouldCloseBrowser = false;

    try {
        const startTime = Date.now();

        // 获取浏览器实例
        const browserInfo = useCache ? await getBrowser(headless) :
            { browser: await puppeteer.launch({ headless, args: ['--no-sandbox', '--disable-setuid-sandbox'] }), isNew: true };

        browser = browserInfo.browser;
        shouldCloseBrowser = !useCache;

        if (!browserInfo.isNew) {
            console.log('复用现有浏览器实例');
        }

        const page = await browser.newPage();

        // 并行设置页面配置
        await Promise.all([
            page.setDefaultTimeout(timeout),
            page.setDefaultNavigationTimeout(timeout),
            page.setViewport({ width: 1366, height: 768 }),
            page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
            page.setExtraHTTPHeaders({
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            })
        ]);

        console.log(`正在访问: ${url}`);

        // 页面导航
        const navigationPromise = page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout
        });

        // 如果需要等待网络空闲，则使用networkidle0
        let waitForNetworkPromise = null;
        if (waitForNetworkIdle) {
            waitForNetworkPromise = page.waitForNavigation({ waitUntil: 'networkidle0', timeout });
        }

        await navigationPromise;
        console.log(`页面加载完成，耗时: ${Date.now() - startTime}ms`);

        // 等待网络空闲（如果启用）
        if (waitForNetworkPromise) {
            try {
                await Promise.race([
                    waitForNetworkPromise,
                    waitForDelay(page, 10000) // 最多等待10秒
                ]);
                console.log('网络空闲状态达成');
            } catch (error) {
                console.log('网络空闲等待超时，继续处理...');
            }
        }

        // 智能等待：并行检测内容和等待
        const hasContent = await Promise.race([
            checkForContent(page),
            waitForDelay(page, waitTime).then(() => false)
        ]);

        if (hasContent) {
            console.log('内容已加载，跳过额外等待');
        } else {
            console.log('等待更多内容加载...');
            await waitForDelay(page, 5000); // 额外等待5秒
        }

        // 快速滚动以触发懒加载
        await quickScroll(page);

        // 等待一小段时间让滚动后的内容加载
        await waitForDelay(page, 2000);

        // 等待足够的对话数据加载
        await waitForDialogs(page, minDialogs, maxWaitForDialogs);

        console.log('获取页面内容...');
        const html = await page.content();

        // 关闭页面以释放资源
        await page.close();

        const dialogs = parseHtml(html);
        console.log(`抓取完成，总耗时: ${Date.now() - startTime}ms，获得 ${dialogs.length} 条对话`);

        return dialogs;

    } catch (error) {
        console.error('Puppeteer 抓取失败:', error);
        throw new Error(`页面渲染失败: ${error.message}`);
    } finally {
        if (browser && shouldCloseBrowser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.warn('关闭浏览器时出错:', closeError.message);
            }
        }
    }
}

// 等待足够的对话数据加载
async function waitForDialogs(page, minDialogs, maxWaitTime) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
        try {
            const dialogCount = await page.evaluate(() => {
                // 检查常见的对话选择器
                const selectors = [
                    '.message-content',
                    '.response-container',
                    '.user-query-container',
                    '.gemini-message',
                    '.chat-message',
                    '.message',
                    '[data-message-id]',
                    '[data-testid*="message"]'
                ];
                
                let total = 0;
                for (const selector of selectors) {
                    total += document.querySelectorAll(selector).length;
                }
                return total;
            });
            
            console.log(`检测到 ${dialogCount} 条对话消息`);
            
            if (dialogCount >= minDialogs) {
                console.log(`已加载 ${dialogCount} 条对话，达到最少要求 ${minDialogs} 条`);
                return;
            }
            
            // 等待一段时间后再次检查
            await waitForDelay(page, 2000);
        } catch (error) {
            console.log('检查对话数量时出错:', error.message);
            // 即使出错也继续等待
            await waitForDelay(page, 2000);
        }
    }
    
    console.log(`等待对话数据超时，继续处理...`);
}

// 智能内容检测
async function checkForContent(page) {
    // 扩展选择器列表以支持更多平台
    const selectors = [
        '.message-content',
        '.response-container',
        '.user-query-container',
        '.gemini-message',
        '.chat-message',
        '.message',
        '[data-message-id]',
        '[data-testid*="message"]',
        'p'
    ];

    for (let i = 0; i < 25; i++) { // 增加检查次数到25次，每次200ms
        for (const selector of selectors) {
            try {
                const hasText = await page.evaluate((sel) => {
                    const els = document.querySelectorAll(sel);
                    return Array.from(els).some(el => {
                        const text = el.textContent || el.innerText || '';
                        return text.trim().length > 20;
                    });
                }, selector);

                if (hasText) {
                    console.log(`找到内容: ${selector}`);
                    return true;
                }
            } catch (e) {
                // 继续检查
            }
        }
        await waitForDelay(page, 200);
    }
    return false;
}

// 快速滚动
async function quickScroll(page) {
    try {
        await page.evaluate(() => {
            return new Promise((resolve) => {
                let scrollCount = 0;
                const maxScrolls = 20; // 增加滚动次数

                const scroll = () => {
                    if (scrollCount >= maxScrolls) {
                        // 滚动到底部确保所有内容加载
                        window.scrollTo(0, document.body.scrollHeight);
                        setTimeout(resolve, 1000); // 等待1秒后完成
                        return;
                    }

                    window.scrollBy(0, window.innerHeight);
                    scrollCount++;
                    setTimeout(scroll, 150); // 减少间隔到150ms
                };

                scroll();
            });
        });
    } catch (error) {
        console.log('快速滚动失败，继续处理...');
    }
}

// 使用基础 HTTP 请求抓取静态内容
function grabWithHttp(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https://') ? https : http;

        client.get(url, (res) => {
            let html = '';

            res.on('data', (chunk) => {
                html += chunk;
            });

            res.on('end', () => {
                try {
                    const dialogs = parseHtml(html);
                    resolve(dialogs);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

function parseHtml(html) {
    const $ = cheerio.load(html);
    const dialogs = [];

    console.log('开始解析 HTML 内容...');

    // 尝试多种选择器策略来查找用户查询
    const selectors = [
        '.user-query-container .horizontal-container',
        ".response-container-content"
    ]
    const userSelectors = [
        '.user-query-container .horizontal-container',
        '[data-test-id*="user"]',
        '.user-message',
        '.human-message',
        '.query-container',
        '.message-user',
        '.chat-user-message',
        '[data-author="user"]'
    ];

    for (const selector of userSelectors) {
        $(selector).each((i, el) => {
            const text = $(el).text().replace(/^用户：|^AI：|^User:|^Human:/, '').trim();
            if (text && text.length > 10) { // 过滤掉太短的文本
                dialogs.push({ role: 'user', text, selector });
            }
        });
        if (dialogs.filter(d => d.role === 'user').length > 0) {
            console.log(`使用用户选择器: ${selector}`);
            break;
        }
    }

    // 尝试多种选择器策略来查找 AI 响应
    const aiSelectors = [
        ".response-container-content",
        '.message-content .ng-star-inserted',
        '.response-container .message-content .markdown',
        '.response-container .message-content',
        '.response-container .presented-response-container',
        '.ai-message',
        '.assistant-message',
        '.bot-message',
        '[data-test-id*="response"]',
        '[data-test-id*="assistant"]',
        '.message-assistant',
        '.chat-assistant-message',
        '[data-author="assistant"]',
        '.gemini-message'
    ];

    for (const selector of aiSelectors) {
        $(selector).each((i, el) => {
            // 克隆元素并清理不需要的内容
            const $clone = $(el).clone();
            $clone.find('button').remove();
            $clone.find('.tts-button-container').remove();
            $clone.find('.menu-button-wrapper').remove();
            $clone.find('bard-avatar').remove();
            $clone.find('.response-container-header').remove();
            $clone.find('.response-container-footer').remove();
            $clone.find('script').remove();
            $clone.find('style').remove();
            $clone.find('svg').remove();
            $clone.find('img').remove();
            $clone.find('form').remove();

            const text = $clone.text().replace(/^用户：|^AI：|^Assistant:|^Bot:/, '').trim();
            if (text && text.length > 20) { // AI 响应通常更长
                dialogs.push({ role: 'ai', text, selector });
            }
        });
        if (dialogs.filter(d => d.role === 'ai').length > 0) {
            console.log(`使用 AI 选择器: ${selector}`);
            break;
        }
    }

    // 如果还是没有找到内容，尝试通用方法
    if (dialogs.length === 0) {
        console.log('使用通用方法查找对话内容...');

        // 查找所有可能包含对话的元素
        const possibleElements = $('div, p, span').filter(function () {
            const text = $(this).text().trim();
            return text.length > 50 && text.length < 10000; // 合理的文本长度
        });

        possibleElements.each((i, el) => {
            const text = $(el).text().trim();
            const $el = $(el);

            // 简单的启发式判断
            if (text.includes('？') || text.includes('?') || text.includes('请') || text.includes('如何')) {
                dialogs.push({ role: 'user', text, selector: 'heuristic' });
            } else if (text.length > 100) {
                dialogs.push({ role: 'ai', text, selector: 'heuristic' });
            }
        });

        // 去重
        const seen = new Set();
        const uniqueDialogs = dialogs.filter(dialog => {
            const key = dialog.text.substring(0, 100);
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });

        dialogs.length = 0;
        dialogs.push(...uniqueDialogs);
    }

    // 按照在页面中的顺序排序（简单的启发式方法）
    dialogs.sort((a, b) => {
        if (a.role === 'user' && b.role === 'ai') return -1;
        if (a.role === 'ai' && b.role === 'user') return 1;
        return 0;
    });

    // 输出为 JSON
    // fs.writeFileSync('output.json', JSON.stringify(dialogs, null, 2), 'utf-8');
    console.log(`对话共提取 ${dialogs.length} 条对话`);

    // 输出调试信息
    // dialogs.forEach((dialog, index) => {
    //     console.log(`${index + 1}. [${dialog.role}] (${dialog.selector || 'unknown'}): ${dialog.text.substring(0, 100)}...`);
    // });

    return dialogs;
}

module.exports = grabDialog;
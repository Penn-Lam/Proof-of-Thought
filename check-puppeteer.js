/**
 * Puppeteer 版本检测和基本功能测试
 * 使用方法: node check-puppeteer.js
 */

async function checkPuppeteer() {
    console.log('='.repeat(50));
    console.log('Puppeteer 环境检测');
    console.log('='.repeat(50));

    // 1. 检查 Puppeteer 是否安装
    let puppeteer;
    try {
        puppeteer = require('puppeteer');
        console.log('✅ Puppeteer 已安装');
    } catch (error) {
        console.log('❌ Puppeteer 未安装');
        console.log('请运行: npm install puppeteer');
        return;
    }

    // 2. 检查版本
    try {
        const packageJson = require('puppeteer/package.json');
        console.log(`📦 Puppeteer 版本: ${packageJson.version}`);
    } catch (error) {
        console.log('⚠️ 无法获取 Puppeteer 版本信息');
    }

    // 3. 测试基本功能
    console.log('\n🧪 测试基本功能...');
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('✅ 浏览器启动成功');

        const page = await browser.newPage();
        console.log('✅ 页面创建成功');

        // 测试等待函数
        console.log('🔍 检测可用的等待方法...');
        if (typeof page.waitForDelay === 'function') {
            console.log('✅ page.waitForDelay 可用');
            await page.waitForDelay(100);
        } else if (typeof page.waitForTimeout === 'function') {
            console.log('✅ page.waitForTimeout 可用');
            await page.waitForTimeout(100);
        } else {
            console.log('⚠️ 标准等待方法不可用，将使用 setTimeout 回退');
        }

        // 测试导航
        console.log('🌐 测试页面导航...');
        await page.goto('https://example.com', { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
        });
        console.log('✅ 页面导航成功');

        const title = await page.title();
        console.log(`📄 页面标题: ${title}`);

    } catch (error) {
        console.log('❌ 基本功能测试失败:', error.message);
        
        if (error.message.includes('Failed to launch')) {
            console.log('\n💡 可能的解决方案:');
            console.log('1. 在 Linux 上安装必要的依赖包');
            console.log('2. 尝试添加更多启动参数');
            console.log('3. 检查系统是否支持 Chrome/Chromium');
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('✅ 浏览器已关闭');
        }
    }

    console.log('\n🎯 测试 Gemini URL 访问...');
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('🔄 正在访问 Gemini...');
        await page.goto('https://gemini.google.com/share/c4471bf54153', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        
        console.log('✅ Gemini 页面访问成功');
        
        // 等待一下让页面加载
        if (page.waitForDelay) {
            await page.waitForDelay(3000);
        } else {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        const title = await page.title();
        console.log(`📄 Gemini 页面标题: ${title}`);
        
        // 检查是否有对话内容
        const hasContent = await page.evaluate(() => {
            const selectors = ['.message-content', '.response-container', 'p'];
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    return { selector, count: elements.length };
                }
            }
            return null;
        });
        
        if (hasContent) {
            console.log(`✅ 找到内容元素: ${hasContent.selector} (${hasContent.count} 个)`);
        } else {
            console.log('⚠️ 未找到预期的内容元素');
        }

    } catch (error) {
        console.log('❌ Gemini 访问测试失败:', error.message);
        
        if (error.message.includes('timeout')) {
            console.log('💡 建议: 网络可能较慢，尝试增加超时时间');
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('检测完成');
    console.log('='.repeat(50));
}

// 运行检测
checkPuppeteer().catch(console.error);
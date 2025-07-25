/**
 * 专门测试 Gemini URL 的脚本
 * 使用方法: node test-gemini-url.js
 */

const http = require('http');

const SERVER_URL = 'http://localhost:3001/grab-dialog';
const GEMINI_URL = 'https://gemini.google.com/share/c4471bf54153';

async function testGeminiUrl() {
    console.log('='.repeat(60));
    console.log('测试 Gemini URL 对话抓取');
    console.log('='.repeat(60));
    console.log(`目标 URL: ${GEMINI_URL}`);
    console.log('');

    const requestData = {
        url: GEMINI_URL,
        options: {
            waitTime: 10000,        // 等待10秒
            waitForSelector: '.message-content',
            headless: true,
            timeout: 60000          // 60秒超时
        }
    };

    const postData = JSON.stringify(requestData);

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/grab-dialog',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('发送请求...');
    console.log('请求配置:', JSON.stringify(requestData, null, 2));
    console.log('');

    const startTime = Date.now();

    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            console.log(`请求完成，耗时: ${duration}秒`);
            console.log(`状态码: ${res.statusCode}`);
            console.log('');

            try {
                const result = JSON.parse(responseData);
                
                if (result.success) {
                    console.log('✅ 抓取成功！');
                    console.log(`来源: ${result.source}`);
                    console.log(`方法: ${result.method}`);
                    console.log(`对话数量: ${result.count}`);
                    console.log('');

                    if (result.dialogs && result.dialogs.length > 0) {
                        console.log('对话内容预览:');
                        console.log('-'.repeat(40));
                        
                        result.dialogs.forEach((dialog, index) => {
                            const roleIcon = dialog.role === 'user' ? '👤' : '🤖';
                            const preview = dialog.text.length > 200 
                                ? dialog.text.substring(0, 200) + '...' 
                                : dialog.text;
                            
                            console.log(`${index + 1}. ${roleIcon} [${dialog.role.toUpperCase()}]:`);
                            console.log(`   ${preview}`);
                            if (dialog.selector) {
                                console.log(`   (选择器: ${dialog.selector})`);
                            }
                            console.log('');
                        });
                    } else {
                        console.log('⚠️ 未找到对话内容');
                    }
                } else {
                    console.log('❌ 抓取失败');
                    console.log(`错误: ${result.error}`);
                    if (result.source) {
                        console.log(`来源: ${result.source}`);
                    }
                }
            } catch (parseError) {
                console.log('❌ JSON 解析失败');
                console.log('原始响应:', responseData);
                console.log('解析错误:', parseError.message);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ 请求失败');
        console.log('错误:', error.message);
        console.log('');
        console.log('请确保:');
        console.log('1. 服务器正在运行 (node index.js)');
        console.log('2. 已安装 Puppeteer (npm install puppeteer)');
        console.log('3. 网络连接正常');
    });

    req.write(postData);
    req.end();
}

// 运行测试
testGeminiUrl();
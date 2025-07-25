/**
 * 对话抓取功能测试脚本
 * 使用方法: node test-grab-dialog.js
 */

const http = require('http');

// 测试配置
const TEST_CONFIG = {
    host: 'localhost',
    port: 3001,
    path: '/grab-dialog'
};

// 测试用例
const TEST_CASES = [
    {
        name: '测试本地 HTML 文件',
        data: {
            htmlFilePath: './example/_Gemini - 思想钢印：AI 时代的证明.html'
        }
    },
    {
        name: '测试 URL（如果可用）',
        data: {
            url: 'https://gemini.google.com/share/c4471bf54153'
        }
    },
    {
        name: '测试同时提供文件路径和 URL（应优先使用文件路径）',
        data: {
            htmlFilePath: './example/_Gemini - 思想钢印：AI 时代的证明.html',
            url: 'https://example.com'
        }
    },
    {
        name: '测试空请求（应返回错误）',
        data: {}
    },
    {
        name: '测试不存在的文件（应返回错误）',
        data: {
            htmlFilePath: './nonexistent-file.html'
        }
    }
];

/**
 * 发送 HTTP POST 请求
 */
function sendRequest(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            hostname: TEST_CONFIG.host,
            port: TEST_CONFIG.port,
            path: TEST_CONFIG.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        data: responseData,
                        parseError: error.message
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

/**
 * 格式化输出结果
 */
function formatResult(testCase, result) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`测试: ${testCase.name}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`请求数据:`, JSON.stringify(testCase.data, null, 2));
    console.log(`状态码: ${result.statusCode}`);
    
    if (result.parseError) {
        console.log(`JSON 解析错误: ${result.parseError}`);
        console.log(`原始响应: ${result.data}`);
        return;
    }
    
    if (result.data.success) {
        console.log(`✅ 成功`);
        console.log(`来源: ${result.data.source}`);
        console.log(`对话数量: ${result.data.count}`);
        
        if (result.data.dialogs && result.data.dialogs.length > 0) {
            console.log(`\n对话预览:`);
            result.data.dialogs.slice(0, 2).forEach((dialog, index) => {
                const preview = dialog.text.length > 100 
                    ? dialog.text.substring(0, 100) + '...' 
                    : dialog.text;
                console.log(`  ${index + 1}. [${dialog.role}]: ${preview}`);
            });
            
            if (result.data.dialogs.length > 2) {
                console.log(`  ... 还有 ${result.data.dialogs.length - 2} 条对话`);
            }
        }
    } else {
        console.log(`❌ 失败`);
        console.log(`错误信息: ${result.data.error}`);
        if (result.data.source) {
            console.log(`来源: ${result.data.source}`);
        }
    }
}

/**
 * 运行所有测试
 */
async function runTests() {
    console.log(`开始测试对话抓取功能...`);
    console.log(`服务器地址: http://${TEST_CONFIG.host}:${TEST_CONFIG.port}${TEST_CONFIG.path}`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < TEST_CASES.length; i++) {
        const testCase = TEST_CASES[i];
        
        try {
            const result = await sendRequest(testCase.data);
            formatResult(testCase, result);
            
            // 根据测试用例的预期结果判断成功或失败
            if (testCase.name.includes('应返回错误')) {
                if (!result.data.success) {
                    successCount++;
                } else {
                    failCount++;
                    console.log(`⚠️  预期失败但实际成功`);
                }
            } else {
                if (result.data.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            }
            
        } catch (error) {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`测试: ${testCase.name}`);
            console.log(`${'='.repeat(60)}`);
            console.log(`❌ 网络错误: ${error.message}`);
            failCount++;
        }
        
        // 在测试之间添加延迟
        if (i < TEST_CASES.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // 输出测试总结
    console.log(`\n${'='.repeat(60)}`);
    console.log(`测试总结`);
    console.log(`${'='.repeat(60)}`);
    console.log(`总测试数: ${TEST_CASES.length}`);
    console.log(`成功: ${successCount}`);
    console.log(`失败: ${failCount}`);
    console.log(`成功率: ${((successCount / TEST_CASES.length) * 100).toFixed(1)}%`);
}

/**
 * 单独测试函数
 */
async function testSingle(data) {
    console.log(`发送单个测试请求...`);
    try {
        const result = await sendRequest(data);
        formatResult({ name: '单个测试', data }, result);
    } catch (error) {
        console.log(`❌ 网络错误: ${error.message}`);
    }
}

// 主程序
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
        // 如果提供了参数，进行单个测试
        const testData = {};
        if (args[0].startsWith('http')) {
            testData.url = args[0];
        } else {
            testData.htmlFilePath = args[0];
        }
        testSingle(testData);
    } else {
        // 运行所有测试
        runTests();
    }
}

// 导出函数供其他模块使用
module.exports = {
    sendRequest,
    testSingle,
    runTests,
    TEST_CASES
};
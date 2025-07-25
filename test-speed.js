/**
 * 速度优化测试脚本
 * 测试不同配置下的抓取速度
 */

const http = require('http');

const SERVER_URL = 'http://localhost:3001/grab-dialog';
const GEMINI_URL = 'https://gemini.google.com/share/c4471bf54153';

// 测试配置
const TEST_CONFIGS = [
    {
        name: '快速模式（推荐）',
        config: {
            url: GEMINI_URL,
            options: {
                waitTime: 2000,
                timeout: 20000,
                headless: true,
                useCache: true
            }
        }
    },
    {
        name: '平衡模式',
        config: {
            url: GEMINI_URL,
            options: {
                waitTime: 3000,
                timeout: 30000,
                headless: true,
                useCache: true
            }
        }
    },
    {
        name: '保守模式',
        config: {
            url: GEMINI_URL,
            options: {
                waitTime: 5000,
                timeout: 45000,
                headless: true,
                useCache: true
            }
        }
    },
    {
        name: '无缓存模式',
        config: {
            url: GEMINI_URL,
            options: {
                waitTime: 2000,
                timeout: 20000,
                headless: true,
                useCache: false
            }
        }
    }
];

async function testConfig(testCase) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const postData = JSON.stringify(testCase.config);
        
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
        
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                try {
                    const result = JSON.parse(responseData);
                    resolve({
                        duration,
                        success: result.success,
                        dialogCount: result.count || 0,
                        error: result.error
                    });
                } catch (parseError) {
                    resolve({
                        duration,
                        success: false,
                        dialogCount: 0,
                        error: 'JSON解析失败'
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            resolve({
                duration: Date.now() - startTime,
                success: false,
                dialogCount: 0,
                error: error.message
            });
        });
        
        req.write(postData);
        req.end();
    });
}

async function runSpeedTests() {
    console.log('='.repeat(70));
    console.log('🚀 对话抓取速度优化测试');
    console.log('='.repeat(70));
    console.log(`目标URL: ${GEMINI_URL}`);
    console.log('');
    
    const results = [];
    
    for (let i = 0; i < TEST_CONFIGS.length; i++) {
        const testCase = TEST_CONFIGS[i];
        console.log(`📊 测试 ${i + 1}/${TEST_CONFIGS.length}: ${testCase.name}`);
        console.log('配置:', JSON.stringify(testCase.config.options, null, 2));
        
        try {
            const result = await testConfig(testCase);
            results.push({ name: testCase.name, ...result });
            
            if (result.success) {
                console.log(`✅ 成功 - 耗时: ${result.duration}ms, 对话数: ${result.dialogCount}`);
            } else {
                console.log(`❌ 失败 - 耗时: ${result.duration}ms, 错误: ${result.error}`);
            }
        } catch (error) {
            console.log(`❌ 测试失败: ${error.message}`);
            results.push({ 
                name: testCase.name, 
                duration: 0, 
                success: false, 
                dialogCount: 0, 
                error: error.message 
            });
        }
        
        console.log('');
        
        // 在测试之间等待一下，避免过载
        if (i < TEST_CONFIGS.length - 1) {
            console.log('等待 2 秒后进行下一个测试...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // 输出测试总结
    console.log('='.repeat(70));
    console.log('📈 测试结果总结');
    console.log('='.repeat(70));
    
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length > 0) {
        // 按速度排序
        successfulResults.sort((a, b) => a.duration - b.duration);
        
        console.log('🏆 成功的测试（按速度排序）:');
        successfulResults.forEach((result, index) => {
            const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            console.log(`${rank} ${result.name}: ${result.duration}ms (${result.dialogCount} 条对话)`);
        });
        
        const fastest = successfulResults[0];
        const slowest = successfulResults[successfulResults.length - 1];
        const speedImprovement = ((slowest.duration - fastest.duration) / slowest.duration * 100).toFixed(1);
        
        console.log('');
        console.log(`⚡ 最快配置: ${fastest.name} (${fastest.duration}ms)`);
        console.log(`🐌 最慢配置: ${slowest.name} (${slowest.duration}ms)`);
        console.log(`📊 速度提升: ${speedImprovement}%`);
    }
    
    const failedResults = results.filter(r => !r.success);
    if (failedResults.length > 0) {
        console.log('');
        console.log('❌ 失败的测试:');
        failedResults.forEach(result => {
            console.log(`   ${result.name}: ${result.error}`);
        });
    }
    
    console.log('');
    console.log('💡 建议:');
    if (successfulResults.length > 0) {
        const fastest = successfulResults[0];
        console.log(`- 使用 "${fastest.name}" 配置以获得最佳性能`);
        console.log(`- 预期抓取时间: ${fastest.duration}ms`);
    }
    console.log('- 浏览器缓存可以显著提升后续请求的速度');
    console.log('- 根据网络状况调整 timeout 和 waitTime 参数');
    
    console.log('');
    console.log('='.repeat(70));
}

// 运行测试
runSpeedTests().catch(console.error);
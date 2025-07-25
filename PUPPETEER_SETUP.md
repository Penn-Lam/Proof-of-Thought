# Puppeteer 安装和配置指南

## 安装 Puppeteer

为了支持动态网站（如 Gemini）的对话抓取，需要安装 Puppeteer：

```bash
npm install puppeteer
```

或者如果你想要更轻量的版本（需要手动安装 Chrome）：

```bash
npm install puppeteer-core
```

## 验证安装

安装完成后，重启服务器：

```bash
node index.js
```

如果看到以下信息，说明 Puppeteer 已成功加载：
```
Warp listening at http://localhost:3001
```

如果看到以下警告，说明 Puppeteer 未安装：
```
Puppeteer 未安装，将使用基础 HTTP 请求方式
```

## 使用方式

### 1. 通过 API 测试

```bash
curl -X POST http://localhost:3001/grab-dialog \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://gemini.google.com/share/c4471bf54153",
    "options": {
      "waitTime": 8000,
      "waitForSelector": ".message-content",
      "headless": true,
      "timeout": 30000
    }
  }'
```

### 2. 通过测试页面

访问：`http://localhost:3001/test-grab-dialog.html`

- 输入 Gemini URL
- 勾选"使用 Puppeteer"
- 设置等待时间（建议 5000-10000ms）
- 可选择等待特定选择器
- 点击测试

### 3. 配置选项说明

- **waitTime**: 页面加载后的额外等待时间（毫秒）
- **waitForSelector**: 等待特定 CSS 选择器出现（可选）
- **headless**: 是否无头模式运行（true = 不显示浏览器窗口）
- **timeout**: 页面加载超时时间（毫秒）

## 常见问题

### 1. Puppeteer 安装失败

如果在中国大陆，可能需要设置镜像：

```bash
npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
npm install puppeteer
```

### 2. Chrome 启动失败

在 Linux 服务器上可能需要安装额外依赖：

```bash
# Ubuntu/Debian
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# CentOS/RHEL
sudo yum install -y alsa-lib.x86_64 atk.x86_64 cups-libs.x86_64 gtk3.x86_64 ipa-gothic-fonts libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXrandr.x86_64 libXScrnSaver.x86_64 libXtst.x86_64 pango.x86_64 xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-fonts-cyrillic xorg-x11-fonts-misc xorg-x11-fonts-Type1 xorg-x11-utils
```

### 3. 权限问题

如果遇到权限问题，可以添加启动参数：

```javascript
// 在 grabWithPuppeteer 函数中
browser = await puppeteer.launch({ 
    headless,
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
```

## 性能优化建议

1. **设置合适的等待时间**：不同网站加载速度不同，建议从 5000ms 开始调试
2. **使用选择器等待**：比盲目等待更高效
3. **启用无头模式**：生产环境建议使用 headless: true
4. **复用浏览器实例**：如果频繁抓取，可以考虑复用浏览器实例

## 支持的网站

目前自动检测以下网站并使用 Puppeteer：

- gemini.google.com
- chat.openai.com  
- claude.ai
- poe.com
- character.ai

其他网站默认使用 HTTP 请求，如需要 JavaScript 渲染，请手动指定使用 Puppeteer。
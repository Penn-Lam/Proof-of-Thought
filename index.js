require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { URL } = require("url");
const app = express();
const port = process.env.PORT || 3001;
const analyzeThinking = require("./public/kimiChat");

const { generatePath } = require("./util");
const grabDialog = require("./public/grabDialog");

const Link = require("./model/link");

// 只在非测试环境下连接数据库
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect("mongodb://localhost:27017/POT", {
        // mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.post("/create", async (req, res) => {
    const { url, path, scene, potData, copyTemplate } = req.body;

    // 验证必填字段
    if (!url) {
        return res.status(400).send("URL is required.");
    }
    if (!scene) {
        return res.status(400).send("Scene selection is required.");
    }
    if (!potData) {
        return res.status(400).send("Proof of Thought data is required.");
    }
    if (!copyTemplate) {
        return res.status(400).send("Copy template is required.");
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).send("Invalid URL provided to establish link.");
    }

    // 生成或使用自定义路径
    const linkPath = path ? path : generatePath(6);


    let exists = await Link.findOne({ path: linkPath });
    if (exists) {
        return res.status(400).send("Warp has already been linked.");
    }

    try {
        let link = new Link({
            path: linkPath,
            url,
            scene,
            potData,
            copyTemplate
        });
        console.log("Link saved:", link);
        await link.save();
        // 返回短链接给前端（前端期望的是文本格式）
        res.send(`${req.protocol}://${req.get("host")}/${link.path}`);
        console.log(`✅ 短链接已保存: ${req.protocol}://${req.get("host")}/${link.path}`);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send(error.message);
        }
        if (error.code === 11000) {
            return res.status(400).send("Warp has already been linked.");
        }
        return res.status(500).send("Internal server error.");
    }

});

// 添加对话抓取路由
app.post("/grab-dialog", async (req, res) => {
    const { htmlFilePath, url, options = {} } = req.body;
    const source = htmlFilePath || url;

    if (!source) {
        return res.status(400).json({
            success: false,
            error: "HTML file path or URL is required."
        });
    }

    try {
        const dialogs = await grabDialog(source, options);
        res.json({
            success: true,
            dialogs,
            count: dialogs.length,
            source: source,
            method: source.startsWith('http') ? 'puppeteer_or_http' : 'file'
        });
    } catch (error) {
        console.error('Error grabbing dialog:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            source: source
        });
    }
});


// 添加分析思考过程
app.post("/analyze-thinking", async (req, res) => {
    const { dialog } = req.body;
    if (!dialog || !Array.isArray(dialog) || dialog.length === 0) {
        return res.status(400).json({ success: false, error: "dialog不能为空且必须为数组" });
    }
    try {
        const result = await analyzeThinking(dialog);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('思维分析失败:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 为已存在的链接添加对话数据
app.post("/add-dialog/:linkPath", async (req, res) => {
    const { linkPath } = req.params;
    const { htmlFilePath, url } = req.body;
    const source = htmlFilePath || url;

    if (!source) {
        return res.status(400).json({
            success: false,
            error: "HTML file path or URL is required."
        });
    }

    try {
        // 查找链接
        const link = await Link.findOne({ path: linkPath });
        if (!link) {
            return res.status(404).json({
                success: false,
                error: "Link not found."
            });
        }

        // 抓取对话
        const dialogs = await grabDialog(source);

        // 更新链接数据
        link.dialogData = dialogs;
        await link.save();

        res.json({
            success: true,
            message: "Dialog data added successfully",
            dialogs,
            count: dialogs.length,
            linkPath: linkPath
        });
    } catch (error) {
        console.error('Error adding dialog to link:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 添加测试路由
app.get("/test-grab", async (req, res) => {
    try {
        const dialogs = await grabDialog('./example/_Gemini - 思想钢印：AI 时代的证明.html');
        res.json({ success: true, dialogs, count: dialogs.length });
    } catch (error) {
        console.error('Error grabbing dialog:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/:id", async (req, res) => {
    const dest = await Link.findOne({
        path: req.params.id,
    });

    if (dest === null) {
        return res.status(404).send("URL not found");
    }

    // 增加访问计数
    await Link.updateOne(
        { path: req.params.id },
        { $inc: { views: 1 } }
    );

    res.render("warp", {
        dest,
    });
});

// 只在非测试环境下启动服务器
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Warp listening at http://localhost:${port}`);
    });
}

// 导出app以供测试使用
module.exports = app;

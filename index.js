require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { URL } = require("url");
const app = express();
const port = process.env.PORT || 3000;

const { generatePath } = require("./util");

const Link = require("./model/link");

// 只在非测试环境下连接数据库
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URL, {
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
        await link.save();

        res.send(`${req.protocol}://${req.get("host")}/${link.path}`);
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

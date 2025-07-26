#!/bin/bash

echo "🚀 开始部署 PoT Landing Page..."

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在landing目录下运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
yarn install

# 构建项目
echo "🔨 构建项目..."
yarn build

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 构建成功!"
    echo "📁 构建文件位于 .next 目录"
    echo ""
    echo "部署选项:"
    echo "1. Vercel: npx vercel --prod"
    echo "2. Netlify: 将.next目录上传到Netlify"
    echo "3. 本地测试: yarn start"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

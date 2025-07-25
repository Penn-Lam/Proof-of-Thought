#!/bin/bash

# 对话抓取功能 curl 测试脚本
# 使用方法: chmod +x test-grab-dialog.sh && ./test-grab-dialog.sh

SERVER_URL="http://localhost:3001/grab-dialog"

echo "========================================"
echo "对话抓取功能测试"
echo "========================================"
echo "服务器地址: $SERVER_URL"
echo ""

# 测试 1: 本地 HTML 文件
echo "测试 1: 本地 HTML 文件"
echo "----------------------------------------"
curl -X POST "$SERVER_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "htmlFilePath": "./example/_Gemini - 思想钢印：AI 时代的证明.html"
  }' \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "JSON 解析失败或 jq 未安装"

echo -e "\n"

# 测试 2: URL（可能失败，取决于网络）
echo "测试 2: URL 测试"
echo "----------------------------------------"
curl -X POST "$SERVER_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://gemini.google.com/share/c4471bf54153"
  }' \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "JSON 解析失败或 jq 未安装"

echo -e "\n"

# 测试 3: 空请求（应该失败）
echo "测试 3: 空请求（预期失败）"
echo "----------------------------------------"
curl -X POST "$SERVER_URL" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "JSON 解析失败或 jq 未安装"

echo -e "\n"

# 测试 4: 不存在的文件（应该失败）
echo "测试 4: 不存在的文件（预期失败）"
echo "----------------------------------------"
curl -X POST "$SERVER_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "htmlFilePath": "./nonexistent-file.html"
  }' \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "JSON 解析失败或 jq 未安装"

echo -e "\n"

# 测试 5: 同时提供文件路径和 URL
echo "测试 5: 同时提供文件路径和 URL"
echo "----------------------------------------"
curl -X POST "$SERVER_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "htmlFilePath": "./example/_Gemini - 思想钢印：AI 时代的证明.html",
    "url": "https://example.com"
  }' \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "JSON 解析失败或 jq 未安装"

echo -e "\n========================================"
echo "测试完成"
echo "========================================"

# 提示信息
echo ""
echo "提示:"
echo "- 如果看到 'JSON 解析失败或 jq 未安装'，可以安装 jq 来美化 JSON 输出"
echo "- 在 Windows 上可以使用 Git Bash 或 WSL 运行此脚本"
echo "- 确保服务器在 localhost:3001 上运行"
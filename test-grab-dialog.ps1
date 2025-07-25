# 对话抓取功能 PowerShell 测试脚本
# 使用方法: .\test-grab-dialog.ps1

$ServerUrl = "http://localhost:3001/grab-dialog"

Write-Host "========================================"
Write-Host "对话抓取功能测试"
Write-Host "========================================"
Write-Host "服务器地址: $ServerUrl"
Write-Host ""

# 测试函数
function Test-GrabDialog {
    param(
        [string]$TestName,
        [hashtable]$RequestBody,
        [bool]$ExpectSuccess = $true
    )
    
    Write-Host "测试: $TestName"
    Write-Host "----------------------------------------"
    
    try {
        $jsonBody = $RequestBody | ConvertTo-Json -Depth 10
        Write-Host "请求数据: $jsonBody"
        
        $response = Invoke-RestMethod -Uri $ServerUrl -Method Post -Body $jsonBody -ContentType "application/json" -ErrorAction Stop
        
        Write-Host "✅ 请求成功"
        Write-Host "成功: $($response.success)"
        Write-Host "来源: $($response.source)"
        Write-Host "对话数量: $($response.count)"
        
        if ($response.dialogs -and $response.dialogs.Count -gt 0) {
            Write-Host "对话预览:"
            for ($i = 0; $i -lt [Math]::Min(2, $response.dialogs.Count); $i++) {
                $dialog = $response.dialogs[$i]
                $preview = if ($dialog.text.Length -gt 100) { 
                    $dialog.text.Substring(0, 100) + "..." 
                } else { 
                    $dialog.text 
                }
                Write-Host "  $($i + 1). [$($dialog.role)]: $preview"
            }
            if ($response.dialogs.Count -gt 2) {
                Write-Host "  ... 还有 $($response.dialogs.Count - 2) 条对话"
            }
        }
        
        if ($response.success -eq $ExpectSuccess) {
            Write-Host "✅ 测试结果符合预期" -ForegroundColor Green
        } else {
            Write-Host "⚠️ 测试结果不符合预期" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ 请求失败: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "状态码: $statusCode"
            
            try {
                $errorResponse = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorResponse)
                $errorBody = $reader.ReadToEnd()
                $errorJson = $errorBody | ConvertFrom-Json
                Write-Host "错误信息: $($errorJson.error)"
            } catch {
                Write-Host "无法解析错误响应"
            }
        }
        
        if (-not $ExpectSuccess) {
            Write-Host "✅ 预期失败，测试通过" -ForegroundColor Green
        }
    }
    
    Write-Host ""
}

# 执行测试
Test-GrabDialog -TestName "本地 HTML 文件" -RequestBody @{
    htmlFilePath = "./example/_Gemini - 思想钢印：AI 时代的证明.html"
}

Test-GrabDialog -TestName "URL 测试" -RequestBody @{
    url = "https://gemini.google.com/share/c4471bf54153"
}

Test-GrabDialog -TestName "同时提供文件路径和 URL" -RequestBody @{
    htmlFilePath = "./example/_Gemini - 思想钢印：AI 时代的证明.html"
    url = "https://example.com"
}

Test-GrabDialog -TestName "空请求（预期失败）" -RequestBody @{} -ExpectSuccess $false

Test-GrabDialog -TestName "不存在的文件（预期失败）" -RequestBody @{
    htmlFilePath = "./nonexistent-file.html"
} -ExpectSuccess $false

Write-Host "========================================"
Write-Host "测试完成"
Write-Host "========================================"
Write-Host ""
Write-Host "提示:"
Write-Host "- 确保服务器在 localhost:3001 上运行"
Write-Host "- 可以访问 http://localhost:3001/test-grab-dialog.html 进行可视化测试"
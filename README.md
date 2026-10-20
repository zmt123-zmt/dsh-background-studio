# DSH Background Studio

DSH 桌面版的多媒体动态背景与启动动画插件。

支持**视频 / GIF / 图片背景**、**独立音频**、**播放列表/自动轮播**、**背景透明度**、**启动动画**，并针对 4K 启动视频做过首帧与后台解码时序优化。

## 功能

- **背景**
  - MP4 视频、GIF、图片
  - 视频原声、独立音频队列、音量/循环
  - 背景透明度、缩放/填充模式
  - 参考导入或复制导入；丢失文件重新定位
- **播放列表**
  - 多素材轮播、停留时长、当前索引持久化
  - 启动时恢复上次播放位置
- **启动动画**
  - 全屏式启动画面或背景渐显模式
  - MP4 / GIF，随机选择，每次启动/仅首次启动
  - 跳过按钮、预览
  - 真实首帧检测：`requestVideoFrameCallback`，不以 `loadeddata/canplay` 冒充首帧
  - 启动视频与背景视频同时存在时，背景延后到片尾前预热，避免两个 4K 解码器争抢资源
- **桌面体验**
  - 通过 `webserver/index-inject` 在页面早期注入启动层
  - 启动层先占屏，主界面和背景在后方初始化
  - 页面刷新不会重复播放启动动画
- **数据**
  - 所有素材、缩略图、播放列表和设置保存在 DSH Home 的 `background-studio/` 下
  - 不把大视频写入配置，不使用 Base64

## 安装

要求：

- DSH 桌面版 `0.2.1-rc.2`（Electron 44，Windows 11 已验证）
- Node.js 22+（仅构建/测试需要）

方式一：DSH 插件管理

1. 克隆或下载本仓库到任意本地目录；
2. 在 DSH 的插件管理中选择**从本地目录安装**；
3. 重启 DSH，在左侧打开「背景工作室」。

方式二：作为 profile 依赖

```json
{
  "dependencies": {
    "dsh-background-studio": "link:E:/path/to/dsh-background-studio"
  }
}
```

然后将 `dsh-background-studio` 加入 profile 的 bundle 列表。具体字段以你使用的 DSH 版本为准。

## 使用

1. 打开「背景工作室」；
2. 添加图片、GIF 或视频；
3. 选择背景，调整透明度、音频和播放模式；
4. 在「启动动画」中启用并添加 MP4/GIF；
5. 可选择全屏式/背景渐显、触发方式、时长和跳过按钮；
6. 完全退出并重新打开 DSH 后生效。

启动动画设置保存在 Host 状态中；普通页面刷新不会重复播放，只有真正重启 DSH 才重新判断。

## 启动时序（当前实现）

```text
页面解析
  → 注入启动覆盖层
  → 加载启动视频元数据
  → requestVideoFrameCallback 确认真实首帧
  → 首帧淡入，启动时长计时
  → 主界面与背景在后方初始化
  → 背景视频在片尾前约 0.9s 预热
  → 动画结束/跳过
  → 主界面正常接管
```

已知限制：

- 4K 启动视频的首帧仍受磁盘/解码/主界面初始化影响；实际测试约 0.6–1.2s。
- `test_video.mp4` 这类非 faststart MP4 会拖慢元数据读取；本项目不会为了提速擅自转码用户素材。
- 启动覆盖层是页面内覆盖层，不是 Windows 原生 splash；主窗口显示时机由 DSH 宿主控制。
- GIF 启动素材不能像 `<video>` 一样暂停归零。
- 背景视频延后加载只针对「启动视频 + 视频背景」；图片/GIF 背景会立即准备。

## 开发

```bash
node build.mjs
node --check client.js
node --test tests/host.test.mjs
```

目录：

```text
index.js                 Host 插件入口
client.js                构建后的客户端 bundle
lib/host/                Host 状态、媒体、HTTP 路由、注入
runtime/                 启动覆盖层 CSS/JS
src/client/              客户端源码（Studio/Renderer/Audio/Playlist/UI）
tests/host.test.mjs      Host 自动化测试
```

修改 `src/client/**` 或 `runtime/**` 后运行 `node build.mjs` 重新生成 `client.js`。

## 技术说明

- 背景与启动层都存在于 DSH 窗口内部，不是 Windows 桌面壁纸。
- 启动注入通过 DSH 的 `webserver/index-inject` 行完成：先样式、后 body 内联脚本，不使用 `script-src`。
- 视频首帧使用 `requestVideoFrameCallback`；不支持时退化为 `playing + timeupdate`。
- 背景视频在启动阶段延后创建，避免两个 4K 视频同时解码造成丢帧。
- 本项目没有复制参考项目的源码；注入机制参考了 MIT 许可的
  [dsh-video-skin](https://github.com/Something11235/dsh-video-skin) 的公开思路，代码为本项目独立实现。

## 版本

当前仓库版本：**0.2.2**（回退兼容版）。

版本历史：

- `0.2.2`：启动动画首帧 ready 后立即计时，修复特定环境下启动层可能一直不结束的问题
- `0.2.3`：启动视频首帧清晰度、背景解码错峰优化
- `0.2.4`：原生窗口门控实验未合并（Electron 在窗口未显示前不会完成页面启动工作，已记录为限制）

## 许可证

[MIT](LICENSE)

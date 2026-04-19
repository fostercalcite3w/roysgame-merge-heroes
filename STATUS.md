# 專案狀態 — 合成王

最後更新：2026-04-19

## 目前階段

**Tier 1 Core 實作中** — 進行到 Task 2（繼承管線檔）

## 遊戲設定

- 遊戲名：合成王（Merge King）
- 類型：塔防 × 自動戰鬥 × 合成消除
- 引擎：Phaser 3 + Vite（HTML5 網頁遊戲）
- 格子：5×5，底 2 排 10 隻英雄
- 合成規則：B4（職業或元素任一相同即可合）
- 合成階級：3→史詩 / 4→傳奇 / 5→神話 / 6→秘密
- 失敗：城堡 HP 500 歸零
- 怪物：從上/左/右三邊進入
- GitHub: fostercalcite3w/roysgame-merge-heroes

## 分期目標

- **Tier 1**（1-2 週）：核心戰鬥可玩 — 目前階段
- **Tier 2**（再 3-4 週）：加入抽卡、拼圖、活動、升級選擇
- **Tier 3**（2-3 個月）：對標參考遊戲完整版（6×6、金幣、輪盤、副本）

## 已完成的功能

- ✅ T1：資料夾 + git init + GitHub repo 建立
- 🔄 T2：繼承管線檔（進行中）

## 下次要做的

按 Plan A（`../docs/superpowers/plans/2026-04-19-merge-king-tier1-core.md`）順序進行：
T3 → T4 → ... → T16

## 已知問題

尚無（還沒開始寫程式碼）

## 參考文件

- 設計 spec：父 repo `docs/superpowers/specs/2026-04-19-merge-heroes-design.md`
- 實作 plan A：父 repo `docs/superpowers/plans/2026-04-19-merge-king-tier1-core.md`
- 父專案規則：`../CLAUDE.md`（hero-survivors 的規則，大多可參考）
- hero-survivors 程式碼：`../hero-survivors/src/`（同引擎，可借鑒 pattern）

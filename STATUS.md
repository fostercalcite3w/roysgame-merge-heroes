# 專案狀態 — 合成王

最後更新: 2026-04-19

## 目前階段

**Tier 1 Phaser UI 完成** — 可玩的 10 波 demo, dev server + build 通過

## 已完成

- Tier 1 Core (Plan A — 43 tests)
- Tier 1 Phaser UI (Plan B — 14 tasks)
  - TitleScene / BattleScene / GameOverScene
  - 5×5 grid + hero sprite + tier 徽章 + 移動 tween
  - 鍵盤 WASD/方向 + Space/Enter 選取 + ESC 取消
  - 觸控 HTML overlay (rule 5b) — 5×5 tap zones
  - 合成偵測 chain + 粒子/閃光/scale pop 動畫
  - 怪物 spawn 上/左/右三邊 + path 走向城堡
  - Hero auto-attack 投射物 + 怪物 stun
  - HUD (波數/HP/步數) + wave clear toast
  - GameOverScene 城堡陷落／通關
  - Web Audio 合成音效 (6 種)
- 新增單元測試: GameState (14) + MonsterPath (5) + CombatSystem (8) = 27 新增
- 總測試: 70 passed / 12 test files

## 下次要做的 (Tier 2)

- 抽卡 / 拼圖系統
- 每 3 波 3 選 1 升級
- 限定活動 + 開發者面板
- 擴展到 25 波 + Boss (每 10 波)
- 英雄收藏頁面
- 存檔系統
- AI 生成 Q 版英雄圖

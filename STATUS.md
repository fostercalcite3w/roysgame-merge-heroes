# 專案狀態 — 合成王

最後更新：2026-04-19

## 目前階段

**Tier 1 Core 完成** ✅ — 所有核心演算法以 TDD 寫完，`npm test` 43/43 綠

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

- **Tier 1**（1-2 週）：核心戰鬥可玩
  - ✅ Tier 1 Core（無 UI，純邏輯 + 測試）
  - ⏳ Tier 1 Phaser（Plan B，尚未開始）
- **Tier 2**（再 3-4 週）：加入抽卡、拼圖、活動、升級選擇
- **Tier 3**（2-3 個月）：對標參考遊戲完整版（6×6、金幣、輪盤、副本）

## 已完成的功能（Tier 1 Core）

- ✅ T1：資料夾 + git init + GitHub repo 建立
- ✅ T2：繼承管線檔（CLAUDE.md / PLAYBOOK.md / STATUS.md / verify-ui.sh）
- ✅ T3：Vite + Phaser + Vitest scaffold
- ✅ T4：16 基礎英雄（4 職業 × 4 元素）+ 6 tests
- ✅ T5：3 種普通怪（slime / goblin / orc）
- ✅ T6：balance.js 集中數值
- ✅ T7：10 波 demo 配置
- ✅ T8：Grid class（5×5 容器）+ 6 tests
- ✅ T9：initialSpawn（避免 3 相連）+ 3 tests（含 100 seed）
- ✅ T10：MergeDetector（BFS 找群組）+ 7 tests
- ✅ T11：MergeExecutor（合成升階）+ 3 tests
- ✅ T12：StepCounter（累計 5 步觸發）+ 5 tests
- ✅ T13：MonsterSpawner（上/左/右 三邊）+ 5 tests
- ✅ T14：Castle（HP 500）+ 5 tests
- ✅ T15：整合測試 + 3 tests
- 🔄 T16：STATUS 更新 + push（進行中）

**測試總計：43 passed / 9 test files**

## 下次要做的（Plan B）

Plan B 需要寫：

1. Phaser BattleScene — 5×5 視覺化
2. 英雄 sprite + 移動動畫
3. 玩家輸入（鍵盤 + 觸控）
4. 合成視覺回饋
5. 怪物 sprite + 走位 + 自動攻擊
6. 城堡 HP UI
7. GameOverScene
8. 10 波 demo 串接
9. 基本音效
10. 可玩驗收：你和 Roy 玩完 10 波覺得「還想再玩」→ Tier 1 完成

## 已知問題

- plan 原本的 MergeDetector BFS 有 bug（共用 visited set 造成同屬性不同 value 群組互相干擾），實作時已修正
- plan 原本的 MergeExecutor 測試 size=6 會超出 5-col grid 邊界，實作時已改成 L 形 wrap

## 參考文件

- 設計 spec：父 repo `docs/superpowers/specs/2026-04-19-merge-heroes-design.md`
- 實作 plan A：父 repo `docs/superpowers/plans/2026-04-19-merge-king-tier1-core.md`
- 父專案規則：`../CLAUDE.md`（hero-survivors 的規則，大多可參考）
- hero-survivors 程式碼：`../hero-survivors/src/`（同引擎，可借鑒 pattern）

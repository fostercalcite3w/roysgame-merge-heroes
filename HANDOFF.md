# 合成王 — Session Handoff

**建立日期：** 2026-04-19
**建立者：** Claude Opus 4.7（在本次 session 結束前寫）
**適用情境：** 下一個 session 接手繼續開發時先讀這份

---

## 遊戲是什麼

**合成王**（Merge King） — 塔防 × 自動戰鬥 × 合成消除的 2D 網頁遊戲。

- 5×5 格子戰鬥
- 底 2 排（10 格）開場就有 10 隻英雄（從 16 基礎隨機挑）
- 玩家操縱英雄移動，走 5 步觸發怪物從上/左/右三邊進來
- 3 個同屬性（職業或元素任一相同）相鄰自動合成升階（史詩→傳奇→神話→秘密）
- 英雄不會死；怪物穿越格子打到城堡，HP 500 歸零 = 遊戲結束
- 目標：打到第 100 關通關

完整設計見 `../docs/superpowers/specs/2026-04-19-merge-heroes-design.md`（父 repo 內）。

---

## 現在的狀態（2026-04-19）

### 已完成：Plan A — Tier 1 Core（純邏輯 + 單元測試）

**14 個 commits，43 個測試全綠，已 push 到 main。**

| Task | 內容 | Commit |
|------|------|--------|
| T1 | 資料夾 + git init + 遠端 repo | `f1a1408` / `7cd7485`(父) |
| T2 | 繼承管線檔（CLAUDE.md / PLAYBOOK / STATUS / verify-ui.sh） | `41bc1f2` |
| T3 | Vite + Phaser + Vitest scaffold | `44f6bcd` |
| T4 | 16 基礎英雄資料 + 6 tests | `05ad188` |
| T5+T6+T7 | 怪物 / balance.js / 10 波配置 | `e42a297` |
| T8 | Grid class（5×5 容器）+ 6 tests | `5ed11e4` |
| T9 | initialSpawn（避 3 相連，100 seed 驗證）+ 3 tests | `72d3b72` |
| T10 | MergeDetector（BFS）+ 7 tests | `8f0eb49` |
| T11 | MergeExecutor（合成升階）+ 3 tests | `5bea786` |
| T12 | StepCounter（累計 5 步）+ 5 tests | `312ba86` |
| T13 | MonsterSpawner（上/左/右 三邊）+ 5 tests | `e519e5d` |
| T14 | Castle（HP 500）+ 5 tests | `4040764` |
| T15 | 整合測試 + 3 tests | `d9b31ba` |
| T16 | STATUS 更新 + push | `89691b7` |

Branch：`main`，遠端：`github.com/fostercalcite3w/roysgame-merge-heroes`

### 沒做的：Plan B — Tier 1 Phaser UI（讓遊戲可玩）

Plan B 尚未撰寫也未執行。要做的事：

1. Phaser BattleScene — 5×5 格子視覺化
2. 英雄 sprite + 移動動畫
3. 玩家輸入（鍵盤 WASD + 觸控搖桿）
4. 合成視覺回饋（閃光 / 爆炸 effect）
5. 怪物 sprite + 走位 + 自動攻擊動畫
6. 城堡 HP UI（底部長條）
7. GameOverScene（城堡血歸零）
8. 主選單（開始戰鬥 / 結束）
9. 10 波 demo 串接
10. 基本音效（Web Audio 合成）

**Plan B 接在 Plan A 之上**，把核心演算法接到 Phaser Scene 上。所有純邏輯模組已測試過，Plan B 只需要視覺層 + 輸入層。

---

## 專案結構

```
/Users/chih/Projects/roy-game/                        # 父 repo (roysgame-hero-survivors)
├── .gitignore                                        # 有 merge-heroes/ 被忽略
├── hero-survivors/                                   # 第一款遊戲（活的、已部署）
├── site/                                             # 獨立 repo（landing page）
├── merge-heroes/                                     # 第二款遊戲 = 合成王
│   ├── .git/                                         # 自己的 git（roysgame-merge-heroes）
│   ├── CLAUDE.md                                     # 合成王專屬規則
│   ├── PLAYBOOK.md                                   # 開發 SOP
│   ├── STATUS.md                                     # 當前進度
│   ├── HANDOFF.md                                    # 這份文件
│   ├── index.html                                    # HTML entry
│   ├── package.json                                  # npm scripts
│   ├── vite.config.js
│   ├── vitest.config.js
│   ├── src/
│   │   ├── main.js                                   # 目前只有 console.log，Plan B 要擴
│   │   ├── data/
│   │   │   ├── heroes.js                             # 16 基礎英雄
│   │   │   ├── monsters.js                           # slime / goblin / orc
│   │   │   ├── balance.js                            # 所有數值公式集中
│   │   │   └── waves.js                              # 10 波配置
│   │   └── systems/
│   │       ├── Grid.js                               # 5×5 容器
│   │       ├── initialSpawn.js                       # 10 英雄避 3 連
│   │       ├── MergeDetector.js                      # BFS 找群組
│   │       ├── MergeExecutor.js                      # 執行合成升階
│   │       ├── StepCounter.js                        # 累計 5 步
│   │       ├── MonsterSpawner.js                     # 三邊生成
│   │       └── Castle.js                             # HP 管理
│   ├── tests/
│   │   └── *.test.js                                 # 對應 9 組測試，共 43 tests
│   └── scripts/
│       └── verify-ui.sh                              # UI 驗收腳本（還未用到，src/ 空）
└── docs/
    ├── design-decisions.md
    ├── pipeline-evolution.md                         # 踩坑紀錄（我剛加了 #27-29）
    └── superpowers/
        ├── specs/2026-04-19-merge-heroes-design.md   # 設計 spec
        └── plans/2026-04-19-merge-king-tier1-core.md # Plan A（已執行完）
```

---

## 重要技術決策

### 合成規則（B4 — 任一屬性相同）

一個群組「相鄰」= 4 方向連通，**3+ 格子同 `attack_class` 或同 `element`** 就會合成。

例：`火劍士 + 水劍士 + 草劍士` 相連 → 合成（共同屬性=劍）
例：`火劍士 + 火弓手 + 火法師` 相連 → 合成（共同屬性=火）

在 `src/systems/MergeDetector.js` 裡實作：每個 attribute 獨立掃一遍，用 BFS 找同 value 的連通成分，size ≥ 3 就加入結果。

### 合成後的英雄身分

保留共同屬性（`type` / `value`），另一屬性從群組中隨機挑一個。例：
- 3 個「劍」英雄合成 → 共同屬性是劍，元素從火/水/草裡面隨機挑一
- 合成後位置 = 群組座標平均最近的格子
- 階級依群組大小：3→epic / 4→legendary / 5→mythic / 6→secret

### 怪物生成

- 觸發：累計走 5 格
- 位置：`row=-1`（上邊緣外）、`col=-1`（左邊緣外）、`col=5`（右邊緣外）
- 隨機分配三邊
- 怪物有 hp / attack / speed / reward（拼圖機率、金幣）

### 數值集中管理

**所有數值在 `src/data/balance.js`**。改數值先改這個檔案，然後 `npm test` 驗證。

---

## 本次 session 踩的坑（下次避免）

### 1. Plan 裡的演算法有 bug

MergeDetector BFS 原本共用 `visited` Set 在整個 attribute pass，造成 `water` BFS 的探索會污染 `fire` BFS（標成 visited 後後面 fire 走不到那格）。

**修正後做法：** 每次 BFS 用自己的 `visited`；外層用 `groupedCells` 追蹤已分組格子，只避免同群組重複報告。

**教訓：** Plan 裡的非純資料演算法 task，self-review 要 dry-run（在腦中跑一個 non-trivial 例子），不能只肉眼 code review。

### 2. 測試資料超出 grid 邊界

MergeExecutor 測試 `size=6` 時把 cells 放在 `(4,0)~(4,5)`，`(4,5)` 超出 5-col grid。Grid.set 會靜默 ignore，但 group.cells 還是 6 個，造成 BFS 撿到 null。

**修正後做法：** `size=6` 時把第 6 個英雄放到 `(3,0)` 形成 L 形。

**教訓：** 測試裡用到 grid 座標，要確認不超出 balance.js 定義的 rows/cols。

### 3. Codex subagent 的限制

- **沒網路：** `npm install`、`gh repo create`、任何 `https://` 外部請求都失敗。這類工作由 Claude 直接跑。
- **不能跨 repo 寫：** 派 Codex 給 merge-heroes/ 的任務，它無法修改父 repo 的 `.git/`。要跨 repo 的操作（例如父 `.gitignore` 改動 + 父 repo commit）由 Claude 處理。
- **不一定會 commit：** 即使在 prompt 裡明寫「commit 是必做步驟」，Codex 還是常常只做完 src + test 就回報。Claude 收到回報後必須親自 `ls` + `npm test` + `git commit`。
- **回報常是空白：** agent 回 "Subagent completed but returned no output." 不代表沒做完，要自己去 repo 查狀態。

這些寫在 `merge-heroes/CLAUDE.md`（本 repo 規則），還有父 repo 的 `docs/pipeline-evolution.md` 第 #27-29 條。

---

## 跑起來看看

```bash
cd /Users/chih/Projects/roy-game/merge-heroes

# 跑所有測試
npm test
# 預期：43 passed / 9 test files

# 啟動 dev server（Plan A 階段只會 console.log）
npm run dev
# http://localhost:5174 — 會看到 console 有「合成王 Tier 1 Core — scaffold ready」

# Build
npm run build
# 產生 dist/index.html + dist/assets/*.js
```

---

## 下一步行動

### 選項 A：進 Plan B（撰寫 Phaser UI 實作計畫）

用 `superpowers:writing-plans` skill 寫 Plan B。Plan B 要處理：
- Phaser scene 架構（Title / Battle / GameOver）
- 格子視覺化 + 英雄 sprite
- 輸入（鍵盤 + 觸控 HTML overlay — 參考 hero-survivors 的做法，CLAUDE.md 硬規則 5b）
- 合成動畫 / 怪物攻擊動畫
- 城堡 HP UI
- 10 波串接

寫完 plan → commit → 執行（subagent-driven 或直接）。

### 選項 B：暫停，先玩測 hero-survivors

Tier 1 Core 完成但**沒人能玩**（沒 UI）。可以先放著，等下一個 session 再接 Plan B。merge-king 的 repo 已經 push，任何 session 都能接手。

### 選項 C：用 Plan B 做 MVP 可玩版本前，先寫別的東西

例如素材生成（AI 生 16 英雄的 Q 版頭像），這可以和 Plan B 平行。

---

## 父 repo 的 dirty state（未處理）

Session 開始時父 repo 就有以下改動（非本次 session 造成）：
- `CLAUDE.md` — 加了 Roy 資料和 maker/UX 提醒（我看過 diff 是合理的）
- `docs/design-decisions.md` — 未看 diff
- `site` — submodule dirty

這些**我沒動**也**沒 commit**，留給用戶自己處理。

## 父 repo 本次 session 新增（已 commit）

- `docs/superpowers/specs/2026-04-19-merge-heroes-design.md` — 設計 spec（commit `e75c0c4` + 更新 `bbb6073`）
- `docs/superpowers/plans/2026-04-19-merge-king-tier1-core.md` — Plan A（commit `2f16145`）
- `.gitignore` 加 `merge-heroes/`（commit `7cd7485`）
- `docs/pipeline-evolution.md` — 加 #27-29 條教訓（**待 commit**，下次 session 接手可以 commit）

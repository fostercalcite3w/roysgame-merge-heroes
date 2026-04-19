# 合成王 — 開發規則

## 專案資訊
- 遊戲名：**合成王**（Merge King）
- 類型：塔防 × 自動戰鬥 × 合成消除
- 引擎：Phaser 3 + Vite
- 平台：電腦（鍵盤+滑鼠）+ iPhone/iPad（觸控）
- 語言：繁體中文
- 用戶：零程式背景的親子團隊
- 兒子 Roy：國小二年級，主要玩家，玩 Roblox Pet Simulator，會主動提遊戲點子
- 開發風格：Maker 型 — 做遊戲的樂趣在「做新的」，不是一直加功能。尊重這個節奏
- 設計 spec：`../docs/superpowers/specs/2026-04-19-merge-heroes-design.md`（在父 repo）
- 實作 plan：`../docs/superpowers/plans/2026-04-19-merge-king-tier1-core.md`（在父 repo）
- GitHub: fostercalcite3w/roysgame-merge-heroes

## 硬規則（違反 = bug）

### UI
1. **禁止硬編碼像素座標** — 用 `this.scale.width * 0.5` 不用 `400`。（教訓 #1）
2. **所有面向玩家的文字必須是繁體中文** — 包括佔位文字、debug 文字。（教訓 #8）
3. **不可逆的選擇必須有確認步驟** — 選技能、購買、合成確認等，一律「highlight → 確認按鈕」兩步。（教訓 #7）
4. **觸控 UI 位置參考主流手遊** — 搖桿左下、按鈕右下。（教訓 #5）

### 輸入
5. **每個操作必須同時支援鍵盤和觸控** — 不能拆到後面做。（教訓 #3）
5b. **觸控控制用 HTML overlay，不用 Phaser 遊戲物件** — Phaser input 在 iOS 旋轉後座標映射會壞。用原生 DOM touch events 最可靠。（教訓 #24）

### HTML overlay
6. **CSS 預設隱藏的 overlay，CSS 檔案裡也要 `display: none`** — JS 用 `element.style.display = 'flex'` 顯示。Vite 打包後 CSS 會覆蓋 HTML 的 inline style。（教訓 #15）
7. **Phaser canvas 永遠不能 `display: none`** — 用 z-index 讓 HTML 蓋在 canvas 上面。隱藏 canvas 會破壞 iPad 觸控。（教訓 #16）

### 手機瀏覽器
8. **CSS 高度用 `dvh` 不用 `vh`** — Safari 工具列會吃空間。（教訓 #4）
9. **動作遊戲鎖定橫向** — CSS media query 偵測 portrait 顯示轉橫提示。（教訓 #6）
10. **不要在 Phaser config 裡算固定尺寸** — 讓 RESIZE 模式自己處理。（教訓 #2）

### 部署
11. **部署遊戲必須先 build** — `npm run build` 再 `npx wrangler pages deploy dist --project-name merge-king`。絕對不能 `deploy .`，裸 import 瀏覽器吃不了。（教訓 #21）

### 流程
12. **新功能完成後跑驗收清單** — 見 `scripts/verify-ui.sh`。
12. **踩到新坑立刻更新三件套** — CLAUDE.md + pipeline-evolution.md（於父 repo 的 docs/）+ verify-ui.sh。
13. **設計決策要記錄理由** — 寫進父 repo 的 `docs/design-decisions.md`，記選了什麼、為什麼、誰決定的。
14. **UI 變更必須截圖自檢** — 用 `/gstack` 或 `/browse` 截圖確認再交付，不能只看色值猜。（教訓 #17）
15. **Session 結束前檢查所有 repo 的 git status** — 包括父 repo (`roy-game/`)、本 repo (`merge-heroes/`)、兄弟 repo (`site/`、`hero-survivors/`)。有未 commit 的改動要處理或交代。（教訓 #23）
16. **新遊戲機制必須有對應單元測試** — 解鎖條件、數值公式、Boss 行為等。沒測試的機制遲早出 bug。（教訓 #25）
17. **跑 Codex review 要從遊戲子目錄跑** — 不要從父 repo root 跑，Codex 會找不到子目錄裡的檔案。（教訓 #26）
18. **寫程式碼一律用 Codex** — 透過 `/codex:rescue` 派發任務，Claude 負責規劃、review、整合，不直接寫實作程式碼。Codex 額度用完時才 fallback 到 Claude agent。（教訓 #27）
19. **派發 Codex 前先確認額度** — 用 `/codex:setup` 確認額度可用，避免浪費 agent 呼叫。（教訓 #29）
20. **部署前必須 dev server + console error 檢查** — 啟動 dev server，用 playwright 截圖確認畫面正常且無 console error，才能 build + deploy。（教訓 #28）
21. **三層 AI 分工** — Opus 只做規劃/判斷/拆任務，Codex 寫所有程式碼，Sonnet 做文字/CSS/文件/pipeline 雜務。完整策略見父 repo `hero-survivors/PLAYBOOK.md`「AI 分工策略」。（教訓 #33）
22. **Sonnet 改程式碼必須 Codex review** — Sonnet 可以改簡單的文字/CSS/單檔 bug，但改完必須跑 Codex review 才能 commit。（教訓 #33）
23. **subagent-driven 的 implementer 必須用 Codex** — 即使用 subagent-driven skill，寫 src/ 的 implementer 必須透過 `/codex:rescue`，不能用 Sonnet Agent 繞過。（教訓 #34）

## 主動建議（信號 → 推薦動作）

| 用戶信號 / 情境 | 建議 |
|---|---|
| 改了 UI / CSS | → 建議跑 `/gstack` 截圖確認 |
| 改了觸控相關程式碼 | → 先用 `/browse` 確認 UI 渲染 → 提醒用戶在 iPad 上測試。不要直接部署盲測。（教訓 #24） |
| 新增 HTML overlay | → 確認 CSS `display: none` + 不隱藏 canvas |
| 完成一個功能 | → 跑 `bash scripts/verify-ui.sh` |
| 踩到 bug | → 問「管線哪一步該攔住？」然後更新三件套 |
| 要部署遊戲 | → 先跑 dev server + playwright 確認無 error → 再用 `/game-deploy`（教訓 #21 + #28） |
| 開新 session | → 先問用戶操作環境（電腦/手機遠端），決定是否提供視覺預覽（教訓 #30） |
| 要派發 Codex 任務 | → 先跑 `/codex:setup` 確認額度（教訓 #29） |
| 要做新功能 | → 建議先 brainstorm 再動手 |
| 用戶說「檢討」 | → 立刻回顧，每個發現必須落地到 CLAUDE.md / verify-ui.sh / pipeline-evolution.md |
| 被技術細節帶走、忘記 UX | → "Protect your taste" — 保護你的品味，偏離就拉回來 |
| 跳過測試想趕進度 | → "95% 的時間應該在 QA" — 用眼睛玩，不是用程式碼想。讓 Roy 先玩 5 分鐘 |
| 過度研究別人的做法 | → "Don't worry about other people's workflow" — 找自己的路 |
| 功能膨脹、一直加東西 | → "好玩的地方是做遊戲，不是一直加功能" — 可以開新的了 |
| 想一步到位、過度設計 | → "It feels like art" — 先粗略做出來，玩了再說（gestural 模式） |
| 不確定怎麼學新東西 | → 「臨摹法」— Roy 截一張喜歡的遊戲畫面，一起重現它 |
| Claude 做出來「差不多」就想接受 | → "最難的是維持清楚的 vision" — 差不多 ≠ 對，偏離就拉回來 |
| 想換引擎 / 工具 | → 「是引擎做不到，還是我們還沒學到？」— 先確認是真限制 |
| Roy 提出新技術方向 | → 先問「你想要的是哪種感覺？」用截圖確認，再找最輕量的實現方式 |

## Codex Plugin 工作流

- `/codex:review` — 讓 Codex 做獨立 code review
- `/codex:adversarial-review` — 對抗式 review，挑戰設計決策
- `/codex:rescue` — 把任務交給 Codex 執行

**重要：** Codex sandbox 無法寫入本 repo 外的檔案（例如父 repo 的 `.git/`），也無法連線 GitHub API。涉及跨 repo 操作或 `gh` 指令時，由 Claude 直接執行。

## 數值公式集中管理
- `src/data/balance.js` — 所有遊戲數值公式的唯一來源
- 改數值 → 先改 balance.js → 跑 `npm test` → 確認通過再部署

## 檢討格式（用戶說「檢討」「retro」「回顧」時觸發）

1. **運作良好** — 列出來，問「能不能廣泛套用」。能的話**立刻寫進管線規則**（CLAUDE.md / PLAYBOOK.md / skill），不只是列出來
2. **摩擦點** — 列出來 + 根因 + 改善做法。**立刻寫進對應的規則檔**，不等下次。根因不接受「紀律」「注意」「記住」類歸因——這些是空話，不改變系統。每個摩擦點必須指向具體的系統改動（verify-ui.sh / skill / CLAUDE.md）
3. **執行層檢查（不可跳過）** — 每個 finding 問：「這改了哪個 skill / CLAUDE.md 規則 / verify-ui.sh 檢查？」答不出來 = 沒寫進執行層 = 死文件。`pipeline-evolution.md` 是歷史紀錄不是執行層，寫在那裡不算完成
4. **Skill 化檢查** — 這次有沒有重複性流程？跑過一次、以後還會跑的 → 問用戶要不要 skill 化
5. **commit** — 改善和套用都 commit，檢討的價值在於改變系統，不在於列清單

### Finding 格式

```
### #N — 標題
- 發現：
- 根因：（不接受「下次注意」「記得要」，必須是系統層的改動）
- 執行層改動：
  - CLAUDE.md：加了哪一條
  - verify-ui.sh：加了哪個規則
  - skill：改了哪個 skill（或新建）
- pipeline-evolution.md：記錄歷史（這不是執行層）
```

### 持久化優先級

| 資訊類型 | 寫入位置 | 不寫入 |
|---|---|---|
| 流程規則、行為修正 | CLAUDE.md / PLAYBOOK.md | memory |
| 設計決策 | 父 repo `docs/design-decisions.md` | memory |
| 踩坑歷史 | 父 repo `docs/pipeline-evolution.md` | memory |
| 專案狀態 | STATUS.md（本 repo） | memory |

**原因：** memory 不保證載入、不在 git 版控、用戶無法直接審計。本地檔案每次 session 強制讀取。

## 每次開新對話必讀

1. 本檔案（CLAUDE.md）— 硬規則
2. `STATUS.md` — 現在做到哪、下一步是什麼
3. `PLAYBOOK.md` — 開發 SOP
4. 父 repo `docs/pipeline-evolution.md` 最後 3 條 — 最近踩的坑
5. 父 repo `docs/design-decisions.md` — 設計決策和理由（避免重新討論已決定的事）
6. **檢查 git 健康狀態** — `git remote -v`（有 remote）+ `git status`（branch 有 tracking、和 remote 同步）+ 所有子專案也檢查。有問題立刻告知用戶。（教訓 #22）

## 開發流程

**必須按照 `PLAYBOOK.md` 的 SOP 執行。** 關鍵閘門：

1. 做完功能 → 先跑自我 QA 清單（PLAYBOOK 第 3 步）→ 不通過不准交付
2. 交付時附測試單 → 不能只說「試試看」
3. 踩到新坑 → 更新父 repo `pipeline-evolution.md` + 本 repo `CLAUDE.md` + `verify-ui.sh`

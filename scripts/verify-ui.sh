#!/bin/bash
# UI 驗收腳本 — 每次改 UI 後跑一次
# 用法: bash scripts/verify-ui.sh

FAIL=0
SRC="src"

echo "========================================="
echo "  合成王 — UI 驗收檢查"
echo "========================================="
echo ""

# 若 src 還不存在，就只做基本檢查
if [ ! -d "$SRC" ]; then
  echo "⚠️  src/ 尚未建立，跳過 UI 檢查（僅檢查 git remote）"
  echo ""
  echo "【規則 22】檢查 git remote..."
  REMOTE=$(git remote -v 2>/dev/null | grep origin || true)
  if [ -z "$REMOTE" ]; then
    echo "  ❌ 沒有 git remote origin！請用 git remote add origin <url> 加回"
    FAIL=1
  else
    echo "  ✅ git remote origin 存在"
  fi
  echo ""
  echo "========================================="
  [ $FAIL -eq 0 ] && echo "  ✅ 基本檢查通過" || echo "  ❌ 請修正"
  echo "========================================="
  exit $FAIL
fi

# 規則 1: 禁止硬編碼座標
echo "【規則 1】檢查硬編碼座標..."
HARDCODED=$(grep -rn "\.text([[:space:]]*[0-9]\{3\}," $SRC/scenes/ $SRC/ui/ 2>/dev/null | grep -v "test" | grep -v node_modules || true)
if [ -n "$HARDCODED" ]; then
  echo "  ⚠️  可能有硬編碼座標:"
  echo "$HARDCODED" | head -10
  echo ""
else
  echo "  ✅ 沒有發現明顯的硬編碼座標"
fi

# 規則 2: 檢查英文 UI 文字
echo ""
echo "【規則 2】檢查英文 UI 文字..."
ENGLISH=$(grep -rn "'[A-Z][a-z]*'" $SRC/scenes/ $SRC/ui/ 2>/dev/null | grep -E "(Label|text|Text|title)" | grep -v "import\|require\|console\|//\|fontSize\|fill\|fontStyle\|align\|Phaser\|Scene\|pointerover\|pointerout\|pointerdown" || true)
if [ -n "$ENGLISH" ]; then
  echo "  ⚠️  可能有英文 UI 文字:"
  echo "$ENGLISH" | head -10
  echo ""
else
  echo "  ✅ 沒有發現英文 UI 文字"
fi

# 規則 5: 鍵盤事件對應觸控
echo ""
echo "【規則 5】檢查觸控支援..."
HAS_KEYBOARD=$(grep -rn "keyboard\|KeyCodes\|isDown\|JustDown" $SRC/scenes/ $SRC/entities/ 2>/dev/null | wc -l)
HAS_TOUCH=$(grep -rn "touchControls\|TouchControls\|pointerdown" $SRC/scenes/ $SRC/entities/ $SRC/ui/ 2>/dev/null | wc -l)
echo "  鍵盤事件: $HAS_KEYBOARD 處"
echo "  觸控事件: $HAS_TOUCH 處"
if [ "$HAS_TOUCH" -eq 0 ] && [ "$HAS_KEYBOARD" -gt 0 ]; then
  echo "  ❌ 有鍵盤操作但沒有觸控支援！"
  FAIL=1
else
  echo "  ✅ 有觸控支援（或尚未加鍵盤）"
fi

# 規則 6: vh vs dvh
echo ""
echo "【規則 6】檢查 CSS 高度單位..."
VH_USAGE=$(grep -rn "[0-9]vh" index.html $SRC/ 2>/dev/null | grep -v "dvh" || true)
if [ -n "$VH_USAGE" ]; then
  echo "  ❌ 使用了 vh 而不是 dvh:"
  echo "$VH_USAGE"
  FAIL=1
else
  echo "  ✅ 沒有使用 vh（或已改用 dvh）"
fi

# 規則 7: 橫向鎖定
echo ""
echo "【規則 7】檢查橫向鎖定..."
PORTRAIT=$(grep -rn "orientation: portrait" index.html 2>/dev/null || true)
if [ -z "$PORTRAIT" ]; then
  echo "  ⚠️  沒有橫向鎖定的 CSS media query（Tier 1 尚可缺，Tier 2 前要補）"
else
  echo "  ✅ 有橫向鎖定"
fi

# 規則 15: CSS overlay 預設 display: none
echo ""
echo "【規則 15】檢查 CSS overlay 預設 display..."
CSS_DISPLAY_BAD=""
if [ -d "$SRC/ui" ]; then
  for cssfile in $SRC/ui/*.css; do
    [ -e "$cssfile" ] || continue
    SCREEN_DISPLAY=$(awk '/#[a-z]+-screen[[:space:]]*\{/{found=1} found && /display:/{print FILENAME":"NR": "$0; found=0} found && /\}/{found=0}' "$cssfile" 2>/dev/null | grep -v "display:.*none" || true)
    if [ -n "$SCREEN_DISPLAY" ]; then
      CSS_DISPLAY_BAD="$CSS_DISPLAY_BAD
$SCREEN_DISPLAY"
    fi
  done
fi
if [ -n "$CSS_DISPLAY_BAD" ]; then
  echo "  ❌ CSS screen 預設不是 display:none:"
  echo "$CSS_DISPLAY_BAD"
  FAIL=1
else
  echo "  ✅ CSS screen 預設都是 display:none（或尚無 overlay）"
fi

# 規則 16: JS 不能 canvas.style.display
echo ""
echo "【規則 16】檢查 canvas 是否被隱藏..."
CANVAS_HIDE=$(grep -rn "canvas\.style\.display" $SRC/ 2>/dev/null || true)
if [ -n "$CANVAS_HIDE" ]; then
  echo "  ❌ 有程式碼在隱藏/顯示 canvas（會破壞 iPad 觸控）:"
  echo "$CANVAS_HIDE"
  FAIL=1
else
  echo "  ✅ 沒有隱藏 canvas"
fi

# 規則 22: git remote
echo ""
echo "【規則 22】檢查 git remote..."
REMOTE=$(git remote -v 2>/dev/null | grep origin || true)
if [ -z "$REMOTE" ]; then
  echo "  ❌ 沒有 git remote origin！請用 git remote add origin <url> 加回"
  FAIL=1
else
  echo "  ✅ git remote origin 存在"
fi

echo ""
echo "========================================="
if [ $FAIL -eq 0 ]; then
  echo "  ✅ 全部通過"
else
  echo "  ❌ 有項目未通過，請修正"
fi
echo "========================================="

exit $FAIL

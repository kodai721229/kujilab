#!/usr/bin/env python3
"""
くじ解析ラボ - 抽選データ自動更新スクリプト

【重要な注意】
このスクリプトの SOURCES に設定した URL は、Leo(レオ)が web検索できない環境で
作成したため、まだ実際に動作確認ができていません。
GitHub Actions を初めて実行したとき、Actions タブのログでエラーが出た場合は、
- 「このゲームのデータ取得に失敗しました」という警告が出ているだけなら、
  そのゲームだけ更新をスキップして他のゲームは処理を続けます(安全設計)。
- 全部失敗する場合は、正しい取得先 URL を調べる必要があります。
  web検索できるセッションで Leo に「update_data.py の SOURCES を直して」と
  頼んでください。

【処理の流れ】
1. 各ゲームの CSV を SOURCES の URL から取得
2. 開催回・本数字・ボーナス数字をパース
3. 既存の public/data/<game>.json と付き合わせて、新しい回だけ追加
4. 変更があったゲームだけ書き戻す
"""

import csv
import io
import json
import sys
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "public" / "data"

# ==========================================================================
# 取得先 URL(要検証 - 上記の注意書き参照)
# 値が None のゲームは自動更新の対象外(手動更新のまま)。
# ==========================================================================
SOURCES = {
    "loto6": None,      # 例: "https://example.com/data/loto6.csv"
    "loto7": None,
    "miniloto": None,
    "bingo5": None,
    "numbers3": None,
    "numbers4": None,
}

# 各ゲームの列レイアウト設定(ユーザーが過去にアップロードしたCSV形式に準拠)
# nums: 本数字の列インデックス(0始まり、日付・回号を除いた実データ部分)
GAME_LAYOUT = {
    "loto6": {"pick": 6, "bonus": 1},
    "loto7": {"pick": 7, "bonus": 2},
    "miniloto": {"pick": 5, "bonus": 1},
    "bingo5": {"pick": 8, "bonus": 0},
    "numbers3": {"digits": 3},
    "numbers4": {"digits": 4},
}


def load_existing(game):
    path = DATA_DIR / f"{game}.json"
    if not path.exists():
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_data(game, data):
    path = DATA_DIR / f"{game}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"), ensure_ascii=False)


def fetch_csv(url):
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    # 日本語CSVはShift_JIS(cp932)の場合が多い
    try:
        text = resp.content.decode("cp932")
    except UnicodeDecodeError:
        text = resp.content.decode("utf-8")
    return text


def parse_number_game(text, layout):
    """ロト6/ロト7/ミニロト/ビンゴ5用パーサー。
    想定ヘッダー: 開催回,日付,第1数字,...,第N数字,[BONUS数字1,BONUS数字2]
    """
    reader = csv.reader(io.StringIO(text))
    header = next(reader)
    rows = []
    pick = layout["pick"]
    bonus = layout["bonus"]
    for row in reader:
        try:
            round_no = int(row[0])
            nums = sorted(int(row[2 + i]) for i in range(pick))
            bonus_nums = [int(row[2 + pick + i]) for i in range(bonus)]
            rows.append([round_no] + nums + bonus_nums)
        except Exception:
            continue
    return rows


def parse_digit_game(text, layout):
    """ナンバーズ3/4用パーサー。
    想定ヘッダー: 開催回,日付,当せん番号
    """
    reader = csv.reader(io.StringIO(text))
    header = next(reader)
    rows = []
    digits = layout["digits"]
    for row in reader:
        try:
            round_no = int(row[0])
            num_str = row[2].strip().zfill(digits)
            rows.append([round_no, num_str])
        except Exception:
            continue
    return rows


def merge(existing, new_rows):
    existing_rounds = {r[0] for r in existing}
    added = 0
    merged = list(existing)
    for row in new_rows:
        if row[0] not in existing_rounds:
            merged.append(row)
            existing_rounds.add(row[0])
            added += 1
    merged.sort(key=lambda r: r[0])
    return merged, added


def update_game(game):
    url = SOURCES.get(game)
    if not url:
        print(f"[skip] {game}: 取得先URLが未設定のためスキップ")
        return False

    layout = GAME_LAYOUT[game]
    try:
        text = fetch_csv(url)
    except Exception as e:
        print(f"[warn] {game}: データ取得に失敗しました ({e})")
        return False

    try:
        if "digits" in layout:
            new_rows = parse_digit_game(text, layout)
        else:
            new_rows = parse_number_game(text, layout)
    except Exception as e:
        print(f"[warn] {game}: パースに失敗しました ({e})")
        return False

    if not new_rows:
        print(f"[warn] {game}: パース結果が0件でした(CSV形式が変わった可能性)")
        return False

    existing = load_existing(game)
    merged, added = merge(existing, new_rows)

    if added > 0:
        save_data(game, merged)
        print(f"[update] {game}: {added}件追加(合計{len(merged)}件)")
        return True
    else:
        print(f"[ok] {game}: 変更なし(既に最新)")
        return False


def main():
    any_updated = False
    for game in SOURCES:
        if update_game(game):
            any_updated = True

    if not any_updated:
        print("更新はありませんでした。")
    return 0


if __name__ == "__main__":
    sys.exit(main())

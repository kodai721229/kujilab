#!/usr/bin/env python3
"""
くじ解析ラボ - 抽選データ自動更新スクリプト

【データ取得元について】
mk-mode.com が個人配布している全回まとめCSVを使用しています
(https://www.mk-mode.com/rails/loto)。開発者本人の注記:
「データは当方が個人的に利用するためのデータですので、一切保証はいたしません」
とのことなので、非商用・個人利用の範囲で使うこと。ビンゴ5(BINGO5)は
このサイトに存在しないため対象外(Noneのまま)。

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
# 取得先 URL
# 値が None のゲームは自動更新の対象外(手動更新のまま)。
# ==========================================================================
SOURCES = {
    "loto6": "https://www.mk-mode.com/rails/loto/LOTO6_ALL.csv",
    "loto7": "https://www.mk-mode.com/rails/loto/LOTO7_ALL.csv",
    "miniloto": "https://www.mk-mode.com/rails/loto/MINILOTO_ALL.csv",

    # ビンゴ5はmk-mode.comに無いため、vnox.net配布のzipを使用(毎週水曜20:10更新目安)。
    # ★注意: 列の並び順・文字コードは未検証。ZIP_SOURCESで扱い、fetch_zip_csv()で解凍する。
    "bingo5": None,
    "numbers3": "https://www.mk-mode.com/rails/loto/NUMBERS3_ALL.csv",
    "numbers4": "https://www.mk-mode.com/rails/loto/NUMBERS4_ALL.csv",
}

# zip配布のソース(ダウンロード後に解凍してCSVを取り出す)
ZIP_SOURCES = {
    "bingo5": "http://kuji.vnox.net/files/bingo5-csv.zip",
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


def fetch_zip_csv(url):
    """zip配布のCSVを取得して解凍し、中身のテキストを返す(最初に見つかったCSVを使用)。"""
    import zipfile

    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(resp.content)) as zf:
        csv_names = [n for n in zf.namelist() if n.lower().endswith(".csv")]
        if not csv_names:
            raise ValueError("zip内にCSVファイルが見つかりません")
        raw = zf.read(csv_names[0])
    try:
        return raw.decode("cp932")
    except UnicodeDecodeError:
        return raw.decode("utf-8")


def parse_number_game(text, layout):
    """ロト6/ロト7/ミニロト用パーサー。
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


def parse_bingo5(text, layout):
    """ビンゴ5(vnox.net)用パーサー。ヘッダー行なし、列順は未検証のため
    「最初の列=回号(整数)、そこから本数字っぽい8個の整数を拾う」という
    緩やかなルールで解析する。実データを見て列インデックスがずれていたら
    ここを直接調整すること。
    """
    reader = csv.reader(io.StringIO(text))
    pick = layout["pick"]
    rows = []
    for row in reader:
        try:
            round_no = int(row[0])
            nums = []
            for cell in row[1:]:
                cell = cell.strip()
                if cell.isdigit() and 1 <= int(cell) <= 40:
                    nums.append(int(cell))
                if len(nums) == pick:
                    break
            if len(nums) == pick:
                rows.append([round_no] + sorted(nums))
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
    zip_url = ZIP_SOURCES.get(game)

    if not url and not zip_url:
        print(f"[skip] {game}: 取得先URLが未設定のためスキップ")
        return False

    layout = GAME_LAYOUT[game]
    try:
        if zip_url:
            text = fetch_zip_csv(zip_url)
        else:
            text = fetch_csv(url)
    except Exception as e:
        print(f"[warn] {game}: データ取得に失敗しました ({e})")
        return False

    try:
        if "digits" in layout:
            new_rows = parse_digit_game(text, layout)
        elif game == "bingo5":
            new_rows = parse_bingo5(text, layout)
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
    for game in list(SOURCES) + [g for g in ZIP_SOURCES if g not in SOURCES]:
        if update_game(game):
            any_updated = True

    if not any_updated:
        print("更新はありませんでした。")
    return 0


if __name__ == "__main__":
    sys.exit(main())

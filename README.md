# くじ解析ラボ — デプロイ手順

このフォルダには、Vercelで公開するために必要なファイルが全部入っています。

## 今回のアップデート内容

- データを `src/App.jsx` から `public/data/*.json` という別ファイルに分離しました。アプリはこれらを起動時に読み込みに行く形になっています。
- `.github/workflows/update-data.yml` と `scripts/update_data.py` を追加しました。GitHub Actionsで自動的に最新の抽選結果を取得し、データを更新できる仕組みの土台です。

**⚠️ 自動更新の取得先URLはまだ未設定です。** `scripts/update_data.py` の`SOURCES`という部分に、実際の取得先URLを入れる必要があります(下記「自動更新を有効にするには」を参照)。

## 手順①：GitHubにアップロードする

1. https://github.com でアカウントを作る（無料）
2. 右上の「+」→「New repository」→ 名前を`kujilab`などにして作成
3. 「uploading an existing file」からこのフォルダの中身をまるごとドラッグ＆ドロップ
   - `node_modules`、`dist` は含めなくてOK（`.gitignore`で自動除外）
4. 「Commit changes」

## 手順②：Vercelと連携する

1. https://vercel.com で「Continue with GitHub」からアカウント作成
2. 「Add New...」→「Project」→ `kujilab`リポジトリを選んで「Import」
3. そのまま「Deploy」

数十秒でURLが発行されます（例：`https://kujilab-xxxxx.vercel.app`）。

## 更新のしかた(手動・今まで通り)

新しい抽選結果が出たら、これまで通りレオに伝えてもらえれば、`public/data/<ゲーム名>.json`だけを新しくして渡す。GitHub上でそのファイルを開き、鉛筆アイコン（Edit）から中身を差し替えて「Commit changes」。Vercelが自動で再デプロイします。

**今回からは`src/App.jsx`を丸ごと差し替える必要はありません。** データファイルだけの更新で済むので、コミットが軽くなりました。

## 自動更新を有効にするには(発展)

`scripts/update_data.py` の中の`SOURCES`という辞書に、各ゲームの最新結果CSVを取得できるURLを設定すると、GitHub Actionsが平日夜に自動でチェックして、新しい結果があればデータを更新・コミットしてくれます。

```python
SOURCES = {
    "loto6": "https://example.com/data/loto6.csv",  # ← ここに実際のURLを入れる
    ...
}
```

この取得先URLは、レオがweb検索できるセッションで一緒に調べて確認するのがおすすめです。設定さえ入れば、以降は完全に自動化されます。

手動でテストしたいときは、GitHubリポジトリの「Actions」タブ →「抽選データ自動更新」→「Run workflow」ボタンでいつでも手動実行できます。

## データ更新について(2026年更新版)

今回、ロト6は第2120回、ロト7は第686回まで反映済みです。

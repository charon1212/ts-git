# フォーマット

## Notation

- `<space>`: space`" "`
- `<null>`: null char `\0`

## GitObject

GitObjectのフォーマットを以下に示す。なお、`[space]`は半角スペースを、`[null]`はヌル文字（`\x00`）を示す。

- `{content-type}[space]{content-length}[null]{content}`
  - `{content-type}`: `blob`, `tree`, `commit`,...
  - `{content-length}`: `{content}`のバイト数
  - `{content}`: 後述（[BlobObjectContent](#blobobjectcontent),[TreeObjectContent](#treeobjectcontent),[CommitObjectContent](#commitobjectcontent)）

## BlobObjectContent

BlobObjectのcontentのフォーマットを以下に示す。

- `{buffer}`
  - `{buffer}`: Blobが示すファイル等バイナリ

## TreeObjectContent

TreeObjectのcontentのフォーマットを以下に示す。

- `{entry1}{entry2}...`

各`{entry}`のフォーマットを以下に示す。

- `{mode}[space]{path}[null]{hash}`
  - `{mode}`: エントリのモード。`100644`等、6桁の数値列。
  - `{path}`: エントリのパス。ファイルやディレクトリ名。
  - `{hash}`: 参照先のBlobObjectまたはTreeObjectのハッシュ値。

## CommitObjectContent

CommitObjectのcontentのフォーマットを以下に示す。`[]`で示す行は省略可能である。`...`で示す行は、複数指定可能。

```plain
tree {tree-hash}
[parent {parent-hash}]...
[author {author-name} <{author-email}> {author-date-seconds} {author-date-timezone}]
[committer {committer-name} <{committer-email}> {committer-date-seconds} {committer-date-timezone}]

{message}
```

- `{tree-hash}`: このコミットが示すリポジトリのTopTreeのハッシュ値
- `{parent-hash}`: 親コミットのハッシュ値
- `{author-name}`: 執筆者の名前
- `{author-email}`: 執筆者のメールアドレス
- `{author-date-seconds}`: 執筆の時間
- `{author-date-timezone}`: 執筆時のタイムゾーン
- `{committer-*}`: `{author-*}`と同様。（コミッター/コミット時の情報）
- `{message}`: コミットメッセージ

<https://stackoverflow.com/questions/22968856/what-is-the-file-format-of-a-git-commit-object-data-structure>

## index

- `{index} => {index-header}{index-entries}{extensions}{hash}`
  - `{index-header} => {index-signature}{version}{number-entries}`: 計12バイトのヘッダー部
    - `{index-signature}`: 固定値"DIRC"
    - `{version}`: バージョンを表す数値（4バイト）。Gitのサポートは2,3,4。
    - `{number-entries}`: 後述する`{index-entries}`のエントリ数（4バイト長）
  - `{index-entries} => {index-entry}...`: 各インデックスエントリのリスト。name列、stage列の昇順でソートする。
    - `{index-entry} => {ctime-seconds}{ctime-nanosecond-fractions}{mtime-seconds}{mtime-nanosecond-fractions}{dev}{ino}{mode}{uid}{gid}{file-size}{hash}{flag}{path-name}{pad-null}`
      - `{ctime-seconds}`: 32bitのファイルステータスが最後に変更された時刻
      - `{ctime-nanosecond-fractions}`: 32bitのファイルステータスが最後に変更された時刻(ナノ秒)
      - `{mtime-seconds}`: 32bitのファイルのデータが最後に修正された時刻
      - `{mtime-nanosecond-fractions}`: 32bitのファイルのデータが最後に修正された時刻(ナノ秒)
      - `{dev}`: 32bitのファイルを含むデバイスの数値 ID
      - `{ino}`: 32bitのファイルの i ノード番号
      - `{mode} => {16-bit-unused}{object-type}{3-bit-unused}{unix-permission}`
        - `{object-type}`: 4bitのオブジェクトタイプ。有効な値は、1000(通常のファイル)、1010(シンボリックリンク)、1110(gitリンク)。
        - `{unix-permission}`: ファイル権限。通常のファイルに対しては、0755と0644のみが有効。シンボリックリンクとgitリンクでは0。
      - `{uid}`: 32bitのファイルの所有者のユーザID
      - `{gid}`: 32bitのファイルのグループID
      - `{file-size}`: ディスク上のサイズ(32bit以上の場合は切り捨て。)
      - `{hash}`: このファイルのBlobオブジェクトのハッシュ値
      - `{flag} => {assume-valid-flag}{extended-flag}{stage}{path-name-length}`: 以下から構成される16bitフラグ
        - `{assume-valid-flag}`: 1bitのフラグ。基本的に"0"で良いが、`git update-index --assume-unchanged`コマンドなどを実行した際の情報を保持するフラグ列。
        - `{extended-flag}`: 1bitのフラグ。ただし、バージョン2の書き方では"0"固定。
        - `{stage}`: 2bitのstage状態フラグ。以下のとおり。
          - `0`: regular file, not in a merge conflict
          - `1`: base
          - `2`: ours
          - `3`: theirs
        - `{path-name-length}`: 後述の`{path-name}`の長さを示す12bit。ただし、12bit(4096)を超える場合は4096。
      - `{path-name}`: パス名。
      - `{pad-null}`: 1-8個のnul文字。`{index-entry}`が全体として8バイトの整数倍のバイト長となるよう、nul文字でpaddingする。なお、パス名の終わりを示すために少なくとも1つのnul文字を含めること。
  - `{extensions}`: Indexの様々な拡張。複雑なのでこの資料上では省略。未指定可。
  - `{hash}`: 検証用のハッシュ値。indexのバイナリ全体の内、このハッシュ値より手前までのバイナルのSha1ハッシュ。

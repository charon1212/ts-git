# pathspec

<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-aiddefpathspecapathspec>

----日本語訳----

Gitコマンドでパスを限定するための表現。

pathspecsは、`git ls-files`, `git ls-tree`, `git add`, `git grep`, `git diff`, `git checkout`などの多くのコマンドで、捜査対象をWorking Treeの一部に限定するために利用する。パスがカレントディレクトリからの相対パスなのか、リポジトリのトップレベルからの相対パスなのかは、各コマンドのドキュメントを参照すること。pathspecの文法は以下のとおり。

- いかなるパスも、それ自身にマッチする。
- 最後に/で終わるpathspecは、ディレクトリprefixを意味する。pathspecの対象は、そのディレクトリ配下に限定される。
- pathspec の残りの部分は、パス名の残りの部分のパターン。
the rest of the pathspec is a pattern for the remainder of the pathname. Paths relative to the directory prefix will be matched against that pattern using fnmatch(3); in particular, * and ? can match directory separators.

例えば、`Documentation/*.jpg`はDocumentationサブツリーの中のすべての.jpgファイルにマッチし、`Documentation/chapter_1/figure_1.jpg`のようなパスも含まれます。

コロン`:`から始まるpathspecは特殊な意味があります。short-formでは、`:`の後に"マジックシグネチャ"文字が続き(場合によっては`:`で終わります)、残りの部分はパスにマッチします。"マジックシグネチャ"はASCIIシンボルで構成され、英数字・glob表現・正規表現・コロンのいずれでもありません。"マジックシグネチャ"の最後の`:`は、そのパターンが"マジックシグネチャ"に属さない文字から始まり、かつコロンでない場合は省略すること
ができます。

long-formでは、`:`の後に`(`が続き、カンマで分けられたいくつかの"マジックワード"が並び、`)`で閉じた後、残りの部分はパスにマッチします。

コロンのみからなるpathspecは、pathspecが何もないことを意味します。この形式を他のpathspecと組み合わせることはできません。

## top

マジックワード`top`(マジックシグネチャ `/`)は、working treeのルートからのパスにマッチすることを表します。これは例えば、サブディレクトリ内からコマンドを実行していてもです。

## literal

パターン内のワイルドカード(`*`や`?`)は、リテラル文字として扱われます。

## icase

大文字と小文字を区別しません。

## glob

Gitはパターンを、shellのglobとして扱います。パターン内のワイルドカードは、パス名内の`/`にマッチしません。例えば、パターン"Documentation/*.html"は"Documentation/git.html"にマッチしますが、"Documentation/ppc/ppc.html"や"tools/perf/Documentation/perf.html"にはマッチしません。

逆に、パターン内の連続するアスタリスク`**`はすべてのパス名にマッチし、次の特別な意味を持ちます。

- スラッシュの前の`**`は全てのディレクトリにマッチします。`**/foo`は、全ての`foo`ファイル/ディレクトリにマッチし、`foo`というパターンと同じ挙動になります。`**/foo/bar`は`foo`ディレクトリ直下の`bar`ファイル/ディレクトリにマッチします。
- 末尾の`**`はその中のすべてにマッチすることを意味します。例えば、`abc/**`は、`abc`ディレクトリ内のすべてにマッチします。
- スラッシュ・連続アスタリスク・スラッシュの並びは、0個、またはそれ以上のディレクトリにマッチします。`a/**/b`というパターンは、`a/b`、`a/x/b`、`a/x/y/b`等にマッチします。
- その他の連続アスタリスクは不正な使い方と見なされます。

マジックワード`glob`とマジックワード`literal`は互換性がありません。

## attr

`attr:`に続いて、スペース区切りで"要求するattribute"を記述します。パスが一致すると判定されるためには、これらの要求をすべて満たす必要があります。これは、通常のpathspecによるマッチングに追加して判定します。attributeについては、[gitattributes](https://git-scm.com/docs/gitattributes)を参照してください。

各attribute要求は、以下のいずれかの形式をとります。

- "`ATTR`" は`ATTR`attributeが設定されていることを要求します。
- "`-ATTR`" は`ATTR`attributeが設定されていないことを要求します。
- "`ATTR=VALUE`" は`ATTR`attributeに`VALUE`値が設定されていることを要求します。
- "`!ATTR`" は`ATTR`attributeが不特定であることを要求します。

ツリーオブジェクトにマッチした場合、これらのattributeの判定はworking treeのattributeから判定し、ツリーオブジェクト自体のattributeから判定するわけではない点に注意してください。

## exclude

他のexcludeでないpathspecにマッチしたパスは、続いて全てのexclud pathspecで検査します。（マジックシグネチャは`!`、またはそのシノニムの`^`）。もしexclude pathspecにマッチした場合、そのパスは無視されます。excludeでないpathspecがない場合は、pathspecが全くない場合と同様に動作します。

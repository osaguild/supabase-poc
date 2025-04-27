# pocアプリケーションの実装
- このrepositoryでpocアプリケーションを実装し、フィジビリティ検証を行いたいです。
- 具体的な技術stackと検証すべき技術について以下に記述します。pocアプリを実装してください。
- pocアプリとして必要な要件も以下に記述します。

# 要件
- シンプルが画面が1つあり、画面には性、名という2つのtext boxがあります。送信ボタンを押すと、text boxに入力した内容をapiに送信します。
- apiはリクエストを受け取ると、性、名をデータベースに登録します。また、queueに性、名をpublishします。
- consumerはqueueをsubscribeして、性、名を取得し、性+名をデータベースに登録します。
- 画面には登録した性、名、性+名を表示します。

# 技術stack
- front-end, api, consumer, queue, databaseで構築されるアプリケーションです。
- すべてtypescriptで実装します。
- deploy用のworkflowはgithub actionsを使用します。
- infraのコードはterraformで管理します。
- linter, formatterはbiomeを使用します。
- package managerはyarnを使用します。

## front-end
- next.jsのpage routerを使用します。
- ui componentはchakra uiを使用します。
- vercelにhostingします。githubのrepositoryにvercelのpluginが設定されているので、pushすると自動でデプロイされます。

## api / consumer
- nestjsを使用します。
- ORMにはprismaを使用します。
- gcpのcloud runにデプロイします。

## queue
- gcpのpub/subを使用します。

## database
- supabaseを使用します。



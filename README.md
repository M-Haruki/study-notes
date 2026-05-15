# study-notes

simple notes app for studying react &amp; go

## 開発環境構築
### Dev Container環境の構築
[Docker Desktop](https://www.docker.com/products/docker-desktop/)、[Visual Studio Code(VSCode)](https://code.visualstudio.com/download)、[git](https://git-scm.com/)をインストールし、適宜設定を行います。  
VSCodeに[Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)拡張機能を入れます。  
このリポジトリをCloneし、VSCodeからリポジトリを開発コンテナとして(再度)開きます。

### Frontend開発
次のコマンドでバックエンドの開発用サーバーを立ち上げます。
```shell
cd /workspace/backend
go run .
```

別のプロセスとして、次のコマンドでフロントエンドの開発用サーバーを立ち上げます。  
viteのproxyを利用することで、特別な設定無しに、別ポートのバックエンドサーバーへアクセスが可能です。
```shell
cd /workspace/frontend/
npm install
npm run dev
```

[http://localhost:5173/study-notes/](http://localhost:5173/study-notes/)からページを見られます。

### Backend開発
次のコマンドでフロントエンドをビルドします。
```shell
cd /workspace/frontend/
npm install
npm run build
mv dist/ ../backend/dist/
```

次のコマンドで、バックエンドの開発用サーバーを立ち上げます。  
先ほどビルドしたフロントエンドも、バックエンドサーバーによりホストされます。
```shell
cd /workspace/backend
go run .
```

[http://localhost:1323/study-notes/](http://localhost:1323/study-notes/)からページを見られます。

## ビルド
必要に応じて[.env](.env)を書き換えます。  
`APP_PORT`は、Docker Composeでホスト側に公開するポートです。アプリ本体はコンテナ内の 1323 番で待ち受けます。  
なお、Composeではホスト側のバインドを`127.0.0.1`にしているため、外部からは直接アクセスできず、ローカルからのみ接続できます。

[.env.local.template](.env.local.template)をコピーして`.env.local`というファイルを作り、内容の環境変数を書き換えます。

次のコマンドで、`.env`と`.env.local`を利用して、Dockerコンテナを立ち上げます。  
PostgreSQLコンテナも一緒に立ち上げられるため、すでにあるPostgreSQLなどを使いたい場合は[compose.yaml](compose.yaml)を編集してください。
```shell
docker compose --env-file .env --env-file .env.local up
```

なお、代わりに次のコマンドでリビルドします。
```shell
docker compose --env-file .env --env-file .env.local up --build
```

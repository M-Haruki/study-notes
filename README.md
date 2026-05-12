# study-notes

simple notes app for studing react &amp; go

## 開発環境
### Dev Container
[Docker Desktop](https://www.docker.com/products/docker-desktop/)、[Visual Studio Code(VSCode)](https://code.visualstudio.com/download)、[git](https://git-scm.com/)をインストールし、適宜設定を行います。  
VSCodeに[Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)拡張機能を入れます。  
このリポジトリをCloneし、VSCodeから開発コンテナを再度開きます。

### Frontend
次のコマンドでフロントエンドの開発用サーバーを立ち上げます。
```shell
cd /workspace/frontend/
npm run dev
```

別のプロセスとして次のコマンドで、バックエンドの開発用サーバーを立ち上げます。  
viteのproxyを利用することで、特別な設定無しに、別ポートの開発サーバーへアクセスが可能です。
```shell
cd /workspace/backend
go run .
```

### Backend
次のコマンドでフロントエンドをビルドします。
```shell
cd /workspace/frontend/
npm run build
mv dist/ ../backend/dist/
```

次のコマンドで、バックエンドの開発用サーバーを立ち上げます。  
先ほどビルドしたフロントエンドも、バックエンドサーバーによりホストされます。
```shell
cd /workspace/backend
go run .
```

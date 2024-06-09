const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.ts"], // エントリーポイントを指定
    outfile: "dist/index.js", // 出力ファイル名を指定
    bundle: true, // 依存関係をバンドル
    platform: "node",
    target: "node20", // LambdaのNode.jsバージョンに合わせてください
    external: ["@aws-sdk", "@sparticuz"], // Lambda環境に既に存在するモジュールを除外
    loader: {
      ".ts": "ts",
    },
  })
  .catch(() => process.exit(1));

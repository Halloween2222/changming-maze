# 参与开发

先读：

- [接口文档](docs/接口文档.md)
- [提交与协作说明](docs/提交与协作说明.md)

最短流程：

```bash
git switch dev
git pull --ff-only
git switch -c feat/<成员>-<模块>
# 改代码 / 跑 npm run build / 自测
git add <只加自己的文件>
git commit -m "feat(<scope>): <一句话>"
git push -u origin HEAD
```

然后在 GitHub 向 `dev` 开 PR，等 1 个 approve 后 squash merge。不要直接推 `main`，不要 force push 共享分支。

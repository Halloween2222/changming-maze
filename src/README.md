# 源码结构

| 目录 | 负责 | 内容 |
| --- | --- | --- |
| `engine/` | 林子涵 | 渲染循环、构建、输入、资源、性能 |
| `maze/` | 王圣杰 | DFS 生成、墙体合批、碰撞、区域 |
| `world/` | 王圣杰 | 灯塔外景、礁岛、露天石阵俯视、外海 |
| `render/` | 黄勇杰 | 光照、阴影、体积光、水面、雨、后期、shader |
| `game/` | 张洋 | 玩家、交互、火种、灯塔大门、结局镜头 |
| `ui/` | 张洋 | HUD、菜单、小地图、设置 |
| `audio/` | 吴嘉晔 | WebAudio 风雨、脚步、机关、结尾 |

接口第 1 周定死：`GameState` / `Interactable` / `Maze` / `EndingSequence` / `Diagnostics`。

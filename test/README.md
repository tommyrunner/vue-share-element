# Vue Share Element 测试用例

## 说明

此目录包含 Vue Share Element 组件的测试用例，展示了两个页面之间的元素共享动画效果。

## 运行方法

### 安装依赖

```bash
npm install
```

### 本地开发服务器启动

```bash
# 使用项目提供的脚本运行测试
npm run test
```

## 测试内容

1. **列表页到详情页的共享动画**
   - 点击列表项会触发共享元素动画，平滑过渡到详情页
   - 支持多对一的共享元素情况

2. **详情页到列表页的共享动画**
   - 点击返回按钮会回到列表页，同样伴随着共享元素动画

## 项目结构

```
test/
├── components/           # 组件目录
│   ├── ListPage.vue      # 列表页组件
│   └── DetailPage.vue    # 详情页组件
├── routers/              # 路由目录
│   └── index.ts          # 路由配置
├── App.vue               # 应用根组件
├── index.html            # 入口HTML
├── main.ts               # 应用入口
├── style.css             # 样式文件
├── tsconfig.json         # TS配置
└── vite.config.ts        # Vite配置
```

## 注意事项

- 此测试用例依赖 vue-router 实现路由跳转
- 共享元素的标识使用 `share` 属性
- 使用 @vitejs/plugin-vue 处理 .vue 文件 
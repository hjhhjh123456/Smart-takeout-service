# Smart Takeout Service · 智能外卖服务

> 一体化外卖平台：用户微信小程序 + 商家管理后台 + 智能外卖柜取餐，一个 Spring Boot 后端全部打通。

面向中小型连锁餐饮门店。服务三类用户：顾客、门店员工、配送员。智能外卖柜是差异化能力——把骑手当面交接变成无接触、取件码验证的取餐体验，硬件对接待后续接入。

---

## 核心能力

- **用户端**（`/user/**`）：微信 OAuth 登录、菜品浏览、购物车、地址簿、订单提交、微信支付 V3（JSAPI + 退款）、催单、取件码验证
- **管理端**（`/admin/**`）：员工 / 配送员 CRUD、菜品 / 套餐 / 分类管理、订单全流程（接单 / 拒单 / 派送 / 完成）、指派配送员、营业数据报表、Excel 导出、WebSocket 推送
- **柜端 / 配送端**（`/delivery_worker/**`）：`POST /apply_box` 申请空柜、生成 6 位取件码、柜状态追踪

横切：管理端 / 用户端两套独立 JWT；切面自动填充审计字段；全局异常体系；订单超时定时任务；Knife4j 接口文档。

---

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 后端 | Spring Boot 2.7.3、Java 17、Maven 多模块（common / pojo / server） |
| 持久化 | MyBatis-Spring-Boot 2.2.0、MySQL 5.7+、Druid 1.2.1、PageHelper 1.3.0 |
| 缓存 / 鉴权 | Spring Data Redis、JJWT 0.9.1（双端密钥） |
| 实时 / 支付 | spring-boot-starter-websocket、wechatpay-apiv3 0.4.8 |
| 存储 / Office | Aliyun OSS SDK 3.10.2、Apache POI 3.16 |
| 切面 / 文档 / JSON | AspectJ 1.9.4、Knife4j 3.0.2、Fastjson 1.2.76、Jackson 2.9.2 |
| 小程序 | uni-app（Vue 2）、微信 SDK 2.24.2 |

---

## API 路由

| 前缀 | 用途 | 鉴权 |
| --- | --- | --- |
| `/admin/**` | 商家管理后台 | JWT（`token` header，登录放行） |
| `/user/**` | 用户小程序 | JWT（`authentication` header，登录与状态查询放行） |
| `/delivery_worker/**` | 配送员小程序 | JWT |
| `/notify/**` | 微信支付回调 | 服务端对服务端，**无 JWT**，签名校验 |
| `ws://.../ws/{sid}` | 管理后台 | WebSocket 推送新订单 / 催单 |

Knife4j：`http://localhost:8080/doc.html`

---

## 本地运行

**环境**：JDK 17、Maven 3.6+、MySQL 5.7+、Redis 5+

```bash
# 1. 初始化数据库（DDL 需自行按 entity/ 生成；最小表见下方）
# 2. 复制并填写环境变量
cp .env.example .env

# 3. 编译并启动
cd smart-takeout-backend
mvn -DskipTests clean package
mvn -pl smart-takeout-server spring-boot:run
```

数据库最小表：`employee` / `category` / `dish` / `dish_flavor` / `setmeal` / `setmeal_dish` / `user` / `address_book` / `shopping_cart` / `orders` / `order_detail` / `delivery_workers` / `boxs`。`orders` 表额外带 `box_id` / `box_code` / `delivery_worker_id` 用于外卖柜流程。

小程序：用微信开发者工具打开 `smart-takeout-miniapp/`，把 `common/vendor.js` 里的 base URL 改为本地后端地址，关闭 URL 合法性校验。

---

## 配置项

所有敏感值通过环境变量注入，完整列表见 `.env.example`。主要分组：DB、Redis、Aliyun OSS、WeChat（AppID / Secret / 商户号 / 商户私钥 / 证书 / 回调 URL）、JWT（管理端 / 用户端各自的 secret + TTL + token 名）、业务（`SMART_SHOP_ADDRESS` / `SMART_BAIDU_AK`）。

---

## 演进路线

| 阶段 | 目标 |
| --- | --- |
| 0 | 项目结构与文档（**当前**） |
| 1 | 命名收尾：把 `sky-*` 模块目录同步为 `smart-takeout-*` |
| 2 | 密钥治理：移除占位默认值，强制走环境变量 / 配置中心 |
| 3 | 引入 Flyway：提交 `V1__init.sql` |
| 4 | 柜机硬件：定义 `CabinetGateway`，对接 MQTT / SDK（当前仅有应用层调度） |
| 5 | 服务拆分：admin / user / cabinet 三个微服务 + Spring Cloud Gateway |
| 6 | 可观测性：Micrometer + Prometheus + OpenTelemetry + Loki/ELK |
| 7 | 工程升级：Spring Boot 3.x、Jakarta EE、JDK 21 LTS |

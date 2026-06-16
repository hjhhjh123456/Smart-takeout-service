# Smart Takeout Service

> End-to-end takeout platform: customer mini-program, merchant admin console, and smart delivery-cabinet pickup — wired together with a single Spring Boot backend.

Smart Takeout Service is an integrated food-ordering and last-mile delivery platform for small and mid-sized restaurant chains. It serves three audiences from one codebase:

- **Customers** place orders from a WeChat mini-program.
- **Store staff** manage dishes, setmeals, orders, and business reports from an admin console.
- **Delivery workers** drop orders into a smart cabinet; customers retrieve them with a pickup code.

The smart-cabinet feature is the differentiator: it converts a courier handoff into a contactless, code-verified pickup, with the application layer already wired up for hardware integration (see [Roadmap](#roadmap)).

---

## Features

### Customer mini-program (`/user/**`)

- WeChat OAuth login (openid → JWT)
- Browse categories, dishes, setmeals
- Shopping cart with add / decrement / clear
- Address book CRUD with default address
- Order submission, simulated payment, history, reorder, cancel, reminder
- WeChat Pay V3 (JSAPI) and refund callback
- **Pickup-code verification** for cabinet retrieval (`POST /user/user/getTakeout`)

### Merchant admin console (`/admin/**`)

- Employee & delivery worker CRUD
- Dish, flavor, setmeal, and category management
- Order search, statistics, confirm / reject / cancel / deliver / complete
- **Delivery worker assignment** for orders
- Daily / weekly business reports and Excel export (Apache POI)
- Shop open / close toggle (Redis-cached)
- Real-time order-arrival and reminder push over WebSocket

### Smart cabinet & delivery (`/delivery_worker/**`)

- `POST /delivery_worker/apply_box` — assign a free box, generate 6-digit pickup code, MD5-stored on the order
- Cabinet status tracking (`box_status`: 0 free / 1 occupied)
- Order ↔ cabinet linkage (`orders.box_id`, `orders.box_code`, `orders.delivery_worker_id`)

### Cross-cutting

- Two independent JWT schemes (admin / user) with separate signing keys
- Aspect-driven audit field population (`createTime`, `updateTime`, `createUser`, `updateUser`)
- Global exception handler with domain-specific business exceptions
- Scheduled jobs: order timeout cancellation, in-progress delivery timeout
- Knife4j (Swagger) API documentation

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend framework | Spring Boot 2.7.3 |
| Build | Maven 3.6+ |
| Language | Java 17 |
| Persistence | MyBatis-Spring-Boot 2.2.0, MySQL 5.7 / 8.0 |
| Connection pool | Alibaba Druid 1.2.1 |
| Paging | PageHelper 1.3.0 |
| Cache | Spring Data Redis |
| Auth | JJWT 0.9.1 (dual signing keys for admin / user) |
| Real-time | spring-boot-starter-websocket |
| Object storage | Aliyun OSS SDK 3.10.2 |
| Payment | wechatpay-apiv3 (Apache HttpClient) 0.4.8 |
| Office | Apache POI 3.16 (Excel export) |
| API docs | Knife4j (Swagger) 3.0.2 |
| AOP | AspectJ 1.9.4 |
| JSON | Alibaba Fastjson 1.2.76, Jackson 2.9.2 |
| Mini-program | uni-app (Vue 2), WeChat SDK 2.24.2 |

---

## Architecture

```
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Customer            │    │  Merchant            │    │  Delivery worker     │
│  WeChat mini-program │    │  admin console       │    │  WeChat mini-program │
└──────────┬───────────┘    └──────────┬───────────┘    └──────────┬───────────┘
           │ /user/**                 │ /admin/**                │ /delivery_worker/**
           └──────────────────────────┴──────────────────────────┘
                                      │
                          ┌───────────▼────────────┐
                          │   Spring Boot          │
                          │   smart-takeout-server │
                          │   (REST + WebSocket)   │
                          └──────┬──────────┬──────┘
                                 │          │
                  ┌──────────────┘          └──────────────┐
                  │                                         │
       ┌──────────▼──────────┐                  ┌──────────▼──────────┐
       │  MySQL              │                  │  Redis              │
       │  smart_takeout      │                  │  shop status, JWT,  │
       │  14+ tables         │                  │  captcha, locks     │
       └─────────────────────┘                  └─────────────────────┘

       ┌─────────────────────┐                  ┌─────────────────────┐
       │  Aliyun OSS         │                  │  WeChat Pay V3      │
       │  dish / setmeal     │                  │  JSAPI + refund     │
       │  images             │                  │  + callback         │
       └─────────────────────┘                  └─────────────────────┘
```

---

## Repository Layout

```
.
├── smart-takeout-backend/         # Spring Boot backend
│   ├── pom.xml
│   ├── smart-takeout-common/      # Constants, exceptions, result wrappers, utilities
│   ├── smart-takeout-pojo/        # Entities, DTOs, VOs
│   └── smart-takeout-server/      # Controllers, services, mappers, config, tasks
├── smart-takeout-miniapp/         # WeChat mini-program (uni-app build output)
├── .env.example                   # Environment variable template
├── .gitignore
├── LICENSE
└── CHANGELOG.md
```

---

## Backend Module Map

| Module | Purpose |
| --- | --- |
| `smart-takeout-common` | Shared constants (`StatusConstant`, `MessageConstant`, `JwtClaimsConstant`), exception hierarchy, `Result<T>` / `PageResult` wrappers, `@ConfigurationProperties` holders, `JwtUtil` / `AliOssUtil` / `HttpClientUtil` / `WeChatPayUtil` |
| `smart-takeout-pojo` | `entity` (13 tables), `dto` (19 input shapes), `vo` (17 output shapes) |
| `smart-takeout-server` | Spring Boot entry point; `controller/` (admin / user / notify), `service/`, `mapper/` (with XML mappers in `resources/mapper/`), `aspect/`, `interceptor/`, `config/`, `task/`, `websocket/`, `handler/` |

> The original `sky-*` directory names are kept for IDE / Git history compatibility. Source Java packages remain `com.smart.*`. See the [Roadmap](#roadmap) for the rename roadmap.

---

## API Surface

| Prefix | Audience | Notes |
| --- | --- | --- |
| `/admin/**` | Merchant console | JWT-protected (header `token`); excludes `/admin/employee/login` |
| `/user/**` | Customer mini-program | JWT-protected (header `authentication`); excludes `/user/user/login`, `/user/shop/status` |
| `/delivery_worker/**` | Delivery worker mini-program | JWT-protected; current endpoint: `POST /apply_box` |
| `/notify/**` | WeChat Pay callback | Server-to-server, signature-verified, **no JWT** |
| `ws://.../ws/{sid}` | Admin console | WebSocket push for new-order and reminder events |

Knife4j UI: `http://localhost:8080/doc.html` (dev only).

---

## Getting Started

### Prerequisites

- JDK 17
- Maven 3.6+
- MySQL 5.7 / 8.0
- Redis 5+
- (Optional) `cpolar` or another tunnel for receiving WeChat Pay callbacks

### 1. Initialize the database

Create the `smart_takeout` schema. The DDL is **not** included in this repository — derive it from the `entity/` classes or generate it via reverse-engineering tooling. The minimum table set is listed in [Database](#database).

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
# edit .env
```

All sensitive values (DB password, Redis password, Aliyun OSS keys, WeChat Pay merchant keys, JWT secrets) **must** be supplied via environment variables. Defaults in `application.yml` are intentionally weak and meant to be overridden.

### 3. Build & run

```bash
cd smart-takeout-backend
mvn -DskipTests clean package
mvn -pl smart-takeout-server spring-boot:run
```

Or with the env file:

```bash
set -a; source .env; set +a
mvn -pl smart-takeout-server spring-boot:run
```

The server starts on `http://localhost:8080`.

### 4. Open the mini-program

Open `smart-takeout-miniapp/` in WeChat DevTools. Point the API base URL (inside `common/vendor.js`) at your local backend. Enable **"Skip URL legality check"** during development.

---

## Database

DDL is intentionally not committed. Minimum table set (corresponding to `entity/` classes):

| Table | Entity | Notes |
| --- | --- | --- |
| `employee` | `Employee` | Store staff |
| `category` | `Category` | Type 1 = dish, type 2 = setmeal |
| `dish` / `dish_flavor` | `Dish` / `DishFlavor` | Dish + flavor (JSON value list) |
| `setmeal` / `setmeal_dish` | `Setmeal` / `SetmealDish` | Setmeal + many-to-many dishes |
| `user` | `User` | C-end user, linked by WeChat openid |
| `address_book` | `AddressBook` | Per-user address list |
| `shopping_cart` | `ShoppingCart` | Per-user cart |
| `orders` / `order_detail` | `Orders` / `OrderDetail` | Order + line items; order also carries `box_id`, `box_code`, `delivery_worker_id` for cabinet flow |
| `delivery_workers` | `DeliveryWorker` | Delivery staff (separate from `employee`) |
| `boxs` | `DeliveryBox` (partial) | Physical cabinet boxes; `box_status` 0 = free, 1 = occupied |

> Recommend placing the DDL under `smart-takeout-server/src/main/resources/db/migration/` and managing it with Flyway. See [Roadmap](#roadmap).

---

## Configuration Reference

All keys are environment-variable driven. See `.env.example` for the full list.

| Group | Variables |
| --- | --- |
| Database | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` |
| Redis | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB` |
| Aliyun OSS | `SMART_ALIOSS_ENDPOINT`, `SMART_ALIOSS_ACCESS_KEY_ID`, `SMART_ALIOSS_ACCESS_KEY_SECRET`, `SMART_ALIOSS_BUCKET_NAME` |
| WeChat | `SMART_WECHAT_APPID`, `SMART_WECHAT_SECRET`, `SMART_WECHAT_MCHID`, `SMART_WECHAT_MCH_SERIAL_NO`, `SMART_WECHAT_PRIVATE_KEY_FILE_PATH`, `SMART_WECHAT_API_V3_KEY`, `SMART_WECHAT_PAY_CERT_FILE_PATH`, `SMART_WECHAT_NOTIFY_URL`, `SMART_WECHAT_REFUND_NOTIFY_URL` |
| JWT | `SMART_JWT_ADMIN_SECRET_KEY`, `SMART_JWT_ADMIN_TTL`, `SMART_JWT_ADMIN_TOKEN_NAME`, `SMART_JWT_USER_SECRET_KEY`, `SMART_JWT_USER_TTL`, `SMART_JWT_USER_TOKEN_NAME` |
| Business | `SMART_SHOP_ADDRESS`, `SMART_BAIDU_AK` |

---

## Deployment

- Build: `mvn -DskipTests clean package` produces `smart-takeout-server/target/smart-takeout-server-1.0-SNAPSHOT.jar`.
- Run: `java -jar smart-takeout-server-1.0-SNAPSHOT.jar`.
- Inject secrets via your platform's secret store (K8s Secret, Vault, Nacos, Spring Cloud Config). **Do not** commit `.env` or any file containing real keys.
- WeChat Pay callbacks require a publicly reachable URL — use a tunnel (`cpolar`, `frp`) or a public domain with a valid TLS certificate.
- Redis must be reachable from the application; configure eviction policy for the keys used (`SHOP_STATUS`, captcha, JWT blacklist if added).

---

## Roadmap

| Phase | Goal | Notes |
| --- | --- | --- |
| 0 | Project structure & docs | **In progress** |
| 1 | Naming alignment | Move Java package from `com.smart.takeout` to a more domain-specific root; rename `sky-*` module directories to match `smart-takeout-*` |
| 2 | Secret management | Remove placeholder defaults in `application.yml`; require all secrets via environment variables or a config server |
| 3 | Schema migrations | Introduce Flyway; commit `V1__init.sql` for the tables listed above |
| 4 | Cabinet hardware | Define a `CabinetGateway` interface; integrate with the real cabinet vendor (MQTT, SDK, or serial) — currently only the application-side scheduling exists |
| 5 | Service decomposition | Split into `admin` / `user` / `cabinet` micro-services; share `smart-takeout-common` and `smart-takeout-pojo` as jars; introduce Spring Cloud Gateway |
| 6 | Observability | Micrometer + Prometheus for metrics; OpenTelemetry for tracing; Loki or ELK for logs |
| 7 | Platform upgrade | Spring Boot 3.x, Jakarta EE namespace, JDK 21 LTS |

---

## License

[MIT](./LICENSE)

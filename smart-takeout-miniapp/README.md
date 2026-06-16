# smart-takeout-miniapp

WeChat mini-program client for Smart Takeout Service.

## Stack

- uni-app (Vue 2) compiled to WeChat mini-program
- WeChat SDK `2.24.2`
- AppID: `wxd8c422b0870d45d1`

> The committed source is the webpack build output (`common/vendor.js`, `common/main.js`). For ongoing development, clone the original uni-app source and import via HBuilderX or `@dcloudio/vue-cli-plugin-uni`.

## Tab bar

| Page | Purpose |
| --- | --- |
| `pages/index/index` | Browse menu (categories, dishes, setmeals) |
| `pages/map/map` | Locker location map |
| `pages/uploadcode/uploadcode` | Takeout pickup code entry |
| `pages/mine/mine` | Delivery worker home (apply box, BLE debug) |

Other registered pages: `order`, `pay`, `success`, `details`, `my`, `historyOrder`, `address`, `addOrEditAddress`, `remark`, `nonet`, `showQrcode`.

## Backend integration

- All encapsulated API calls go through the bundled `request()` helper in `common/vendor.js`.
- The API base URL is configured in the `env.js` chunk of `common/vendor.js` (default `http://localhost:8080`).
- Cabinet / BLE-specific endpoints in `pages/mine/mine.js` are hard-coded to a separate controller — they are not part of the public REST API.

## Local development

1. Open the project in WeChat DevTools.
2. Update the API base URL inside `common/vendor.js` to point at your local backend.
3. In WeChat DevTools, enable **"不校验合法域名"** (Skip URL合法性校验) during development, or add your domain to the `request 合法域名` list in the WeChat MP admin console.

## Build artifacts

- `common/vendor.js` (≈ 760 KB) — bundled Vue runtime, Vuex, API client, and page chunks
- `common/main.js` — application entry, App.vue
- `common/runtime.js` — webpack runtime
- `common/main.wxss` — global styles

## Static assets

Icons and illustrations live under `static/`. Tab bar uses 8 PNG files (4 active/inactive pairs). See `app.json` `tabBar.list` for the exact mapping.

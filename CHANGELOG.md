# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-16

### Added

- Initial release of Smart Takeout Service: a Spring Boot backend, WeChat mini-program client, and smart delivery-cabinet integration.
- Three user-facing surfaces: customer mini-program (`/user/**`), merchant admin console (`/admin/**`), delivery worker mini-program (`/delivery_worker/**`).
- WeChat Pay V3 integration with JSAPI payment and refund callback.
- JWT-based authentication with separate signing keys for admin and customer endpoints.
- WebSocket-based order-arrival and reminder push.
- Apache POI-powered Excel export for business reports.
- Knife4j (Swagger) API documentation.
- Scheduled jobs for order timeout cancellation and in-progress delivery timeout.
- Aspect-driven audit field population for create / update operations.
- Cabinet assignment flow: `POST /delivery_worker/apply_box` assigns a free box and generates a 6-digit pickup code (MD5-hashed on the order row).
- Pickup verification: `POST /user/user/getTakeout` validates the pickup code against the order.

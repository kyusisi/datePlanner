# TASK-01 작업 보고서

후속 Git 연동: `https://github.com/kyusisi/datePlanner.git`를 origin으로 연결하고 TASK-01 변경을 Workspace, shared, API, web, DB 인프라, 문서 단위로 나누어 커밋합니다. 아래 초기 상태 설명은 TASK-01 구현 당시의 기록입니다.

검증일: 2026-10-21 (Asia/Seoul). 개발 서버와 홈 화면 브라우저 탭을 실행 상태로 남겼습니다.

추가 재현성 확인: `pnpm install --frozen-lockfile` 성공(종료 코드 0), lockfile 변경 없음.

## 결과

Monorepo 코드 기반 구성을 완료했습니다. 설치·빌드·lint·typecheck·자동 테스트·개발 서버 동시 실행·웹 브라우저 화면과 Health 200 응답을 확인했습니다. **Docker가 설치되어 있지 않아 전체 완료 기준 중 Compose 검증/실행과 실제 PostgreSQL 연결 성공은 미검증입니다.** DB Health 실패 경로는 실제 HTTP 503으로 확인했습니다.

## 초기 상태와 보존

작업 폴더 `C:/projects/coupleProject`는 비어 있었고 `git status --short`는 Git 저장소가 아니라는 오류를 반환했습니다. 기존 파일 삭제·덮어쓰기, Git 초기화·커밋·push는 하지 않았습니다. `.env.example`에서 로컬 `.env`를 새로 만들었으며 `.gitignore`에서 제외했습니다. 실제 외부 API 키는 없습니다.

## 주요 구현

- `apps/web`, `apps/api`, `packages/shared` pnpm Workspace와 루트 개발·빌드·검사 스크립트.
- React Router 6개 페이지, Query Provider, 모바일 공통 레이아웃과 홈/장소/일정/지도 하단 내비게이션.
- 로딩·오류 컴포넌트, 전역 React 오류 경계와 공통 API 요청 유틸리티.
- Tailwind CSS, PWA manifest와 임시 SVG, 개발 SW 비활성화, 프로덕션 정적 셸 precache, Share Target 확장 문서.
- NestJS prefix/CORS/ValidationPipe/환경변수 검증/공통 오류 필터/shutdown hook.
- Health 및 실제 Prisma raw query 기반 DB Health, 연결 실패 시 안전한 503 응답.
- PostgreSQL 18.6 Compose(로컬 바인딩, 영구 볼륨, healthcheck), Prisma 7 ESM Client + PostgreSQL adapter, 모델 없는 스키마.
- 공유 응답·오류 타입과 상수. 비즈니스 도메인 모델·기능은 구현하지 않았습니다.

## 설치된 주요 버전

| 항목                                        | 버전                 |
| ------------------------------------------- | -------------------- |
| Node.js (앱·컴파일 실행)                    | 22.14.0              |
| pnpm                                        | 11.25.0              |
| TypeScript                                  | 5.9.3                |
| React / React DOM                           | 19.3.1               |
| Vite / React plugin                         | 8.3.5 / 6.1.2        |
| Tailwind CSS / Vite plugin                  | 4.3.3                |
| React Router                                | 7.18.4               |
| TanStack Query                              | 5.104.5              |
| vite-plugin-pwa                             | 2.0.0                |
| Lucide React                                | 1.61.0               |
| NestJS common/core/platform-express/testing | 11.2.7               |
| @nestjs/config                              | 4.0.4                |
| Prisma CLI / Client / pg adapter            | 7.10.1               |
| pg                                          | 8.23.1               |
| class-validator / class-transformer         | 0.14.4 / 0.5.1       |
| ESLint / @eslint/js                         | 10.13.0 / 10.0.1     |
| typescript-eslint / Prettier                | 8.72.0 / 3.9.10      |
| Vitest / Supertest                          | 5.0.5 / 7.3.1        |
| PostgreSQL 이미지(실행 미검증)              | postgres:18.6-alpine |

pnpm 실행기 자체는 번들 Node 24.19.0을 사용하며, 패키지 스크립트의 시스템 Node는 22.14.0입니다. peer dependency 검사를 엄격하게 활성화했고 전체 해석 결과를 `pnpm-lock.yaml`에 고정했습니다. Prisma 8 RC는 제외했으며 Prisma 관련 패키지는 같은 안정 버전으로 맞췄습니다. React Router 8의 Node 요구 조건, typescript-eslint의 TypeScript 지원 범위를 고려해 Router 7과 TypeScript 5.9를 사용합니다.

## 실행한 검증과 결과

| 명령 / 검사                                   | 결과                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| `pnpm install`                                | 성공, lockfile 생성 및 peer 검사 통과                |
| `pnpm build`                                  | 성공, shared/API/web 및 PWA SW 생성                  |
| `pnpm lint`                                   | 성공, 경고 0                                         |
| `pnpm typecheck`                              | 성공, API 테스트 코드 포함                           |
| `pnpm test`                                   | 성공, API 7개 + 웹 3개 = 10개                        |
| `pnpm format` / `pnpm format:check`           | 적용 및 검사 성공                                    |
| `pnpm db:generate`                            | build/typecheck/test에서 성공                        |
| `pnpm db:validate`                            | 성공                                                 |
| `pnpm dev`                                    | 성공, shared watch + Vite 5173 + Nest 3000 동시 실행 |
| 웹 6개 경로 HTTP 요청                         | 전부 200                                             |
| 브라우저 렌더링 및 메뉴 이동                  | 홈, 장소, 일정, 지도, 설정, 로그인 확인              |
| `GET /api/v1/health`                          | 실제 서버 200, 명세와 동일한 JSON                    |
| `GET /api/v1/health/db`                       | 실제 서버 503, DB 없음. 연결 성공 200은 미검증       |
| `docker --version` / `docker compose version` | 실패, docker 명령 없음                               |
| `docker compose config --quiet`               | 실행 불가, Docker 미설치                             |
| `docker compose up -d --wait postgres`        | 실행 불가, Docker 미설치                             |

자동 테스트는 Nest HTTP 라우팅·서비스와 오류 필터를 실제로 사용하되 DB provider만 mock으로 대체합니다. 성공·실패 응답, CORS, 404 오류 형식, 환경변수 기본값·거부 조건을 검사합니다. 실제 PostgreSQL 연결 성공 검증과 구분해야 합니다. 웹 테스트는 API URL과 정상 JSON, 공통 오류 및 비 JSON 오류 처리를 검사합니다.

설치 중 `@eslint/js`의 본체와 다른 릴리스 번호를 수정했습니다. pnpm 11의 `allowBuilds` 정책으로 Prisma 설치 스크립트를 명시적으로 허용한 후 설치에 성공했습니다. strict 타입 검사에서 발견한 `ArgumentsHost` type import를 수정한 후 빌드가 통과했습니다. 샌드박스의 registry·사용자 캐시/임시 폴더 접근 제한으로 설치와 Prisma 관련 검증은 승인된 확장 권한에서 실행했습니다. 이는 일반 프로젝트 명령 외에 필요한 이 실행 환경의 제약입니다.

## 생성 파일 목록

아래는 직접 작성한 소스·설정·문서입니다. 기존 변경 파일은 없습니다.

```text
.env.example
.gitignore
.npmrc
.prettierignore
.prettierrc.json
compose.yaml
eslint.config.mjs
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.base.json
README.md
docs/PRD.md
docs/API.md
docs/DATABASE.md
docs/TASK-01-REPORT.md
packages/shared/package.json
packages/shared/tsconfig.json
packages/shared/src/index.ts
apps/api/package.json
apps/api/tsconfig.json
apps/api/tsconfig.test.json
apps/api/prisma.config.ts
apps/api/prisma/schema.prisma
apps/api/src/main.ts
apps/api/src/app.module.ts
apps/api/src/setup-app.ts
apps/api/src/config/environment.ts
apps/api/src/common/http-exception.filter.ts
apps/api/src/prisma/prisma.module.ts
apps/api/src/prisma/prisma.service.ts
apps/api/src/health/health.module.ts
apps/api/src/health/health.controller.ts
apps/api/src/health/health.service.ts
apps/api/test/health.test.ts
apps/web/package.json
apps/web/tsconfig.json
apps/web/vite.config.ts
apps/web/index.html
apps/web/public/icon.svg
apps/web/src/main.tsx
apps/web/src/router.tsx
apps/web/src/styles.css
apps/web/src/vite-env.d.ts
apps/web/src/components/Layout.tsx
apps/web/src/components/Feedback.tsx
apps/web/src/components/ErrorBoundary.tsx
apps/web/src/pages/Pages.tsx
apps/web/src/lib/api.ts
apps/web/src/lib/api.test.ts
apps/web/src/pwa/README.md
```

로컬 생성물: `.env`, `node_modules`, pnpm 로컬 캐시, shared/web/API `dist`, API `dist-test`, `apps/api/src/generated/prisma`. 생성물과 비밀 파일은 `.gitignore`로 제외합니다. lockfile은 커밋 대상입니다.

## TASK-02 시작 전 확인

1. Docker Desktop과 Compose v2를 설치·실행합니다.
2. `.env`의 DB 비밀번호와 URL을 일치시킵니다.
3. `docker compose config --quiet`, `docker compose up -d --wait postgres`, `docker compose ps`를 실행합니다.
4. `pnpm dev` 실행 후 `/api/v1/health/db`가 실제 200 / connected인지 확인합니다.
5. User/Couple/멤버십/Place/Plan 관계, 커플별 데이터 격리, 삭제 정책과 유니크 제약을 확정한 후 최초 migration을 생성합니다.
6. Git 저장소를 사용할 경우 초기화/remote 설정 후 `.env`가 제외되는 것을 확인하고 소스와 lockfile을 커밋합니다.

실제 기기 PWA 설치, 공유 수신, 인증, 지도, 운영 배포는 이 작업의 검증 범위 밖입니다. PWA 실배포 전에는 임시 SVG를 보완할 PNG/maskable 아이콘이 필요합니다.

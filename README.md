# Date Planner

저장소: [kyusisi/datePlanner](https://github.com/kyusisi/datePlanner). 작업은 기능·수정·설정 단위로 나누고 커밋 메시지와 PR 제목·설명은 한국어로 작성합니다. 커밋 분류는 [커밋 정책](docs/커밋-정책.md), 작업 규칙은 [AGENTS.md](AGENTS.md)를 따릅니다.

여러 커플이 함께 장소를 저장하고 데이트 일정을 관리할 모바일 웹 / PWA입니다. TASK-01은 개발 기반만 구성합니다. 로그인, 커플 연결, 장소 저장, 일정 편집, 지도 검색은 구현하지 않았습니다.

## 사전 설치

- Node.js 22.14 이상(22.x) 또는 24 이상 LTS 권장
- pnpm 11.25.0 (`corepack enable`, `corepack prepare pnpm@11.25.0 --activate` 또는 pnpm 공식 설치 방식)
- Docker Desktop + Docker Compose v2, Docker 엔진 실행
- Git (버전 관리 시)

Node, pnpm, Docker 버전은 `node -v`, `pnpm -v`, `docker compose version`으로 확인합니다. Vite 8, Tailwind 4, React 19, NestJS 11, Prisma 7, TypeScript 5.9를 사용합니다. React Router 8은 현재 Node 22.14 환경보다 높은 버전을 요구하여 7을 사용합니다. TypeScript는 typescript-eslint peer 범위를 만족하는 5.9를 사용합니다. 직접 의존성 버전과 전체 해석 결과는 각 `package.json`과 `pnpm-lock.yaml`에서 확인합니다.

## 구조

```text
apps/web          React / Vite / PWA
apps/api          NestJS REST API / Prisma / Health 테스트
packages/shared   공통 타입 및 상수 (브라우저에서도 사용 가능한 ESM)
docs              PRD, API, Database, 검증 결과
```

## 환경변수

저장소 루트에서 다음을 실행합니다 (PowerShell):

```powershell
Copy-Item .env.example .env
pnpm install
```

이미 `.env`가 있으면 복사하지 말고 필요한 항목만 추가하세요. `.env`는 Git에서 제외되며 실제 키를 저장소에 커밋하지 않습니다. 예제 비밀번호는 로컬 개발용이므로 변경하세요. `POSTGRES_PASSWORD`와 `DATABASE_URL`의 비밀번호를 일치시키고 URL 안의 특수문자는 퍼센트 인코딩합니다.

| 변수                                            | 용도                                            |
| ----------------------------------------------- | ----------------------------------------------- |
| DATABASE_URL                                    | 호스트에서 PostgreSQL에 연결할 Prisma URL       |
| POSTGRES_DB / POSTGRES_USER / POSTGRES_PASSWORD | Compose DB 초기 생성 값                         |
| API_PORT / WEB_PORT                             | 기본 3000 / 5173                                |
| CORS_ORIGIN                                     | 허용할 웹 Origin, 쉼표로 구분, 마지막 `/` 제외  |
| VITE_API_BASE_URL                               | 웹 API URL, 기본 `http://localhost:3000/api/v1` |
| KAKAO_REST_API_KEY                              | TASK-03/05용 서버 키, 현재 빈 값                |
| VITE_KAKAO_JAVASCRIPT_KEY                       | TASK-05용 공개 브라우저 키, 현재 빈 값          |

Vite는 루트 `.env`를 읽고 `VITE_` 변수만 브라우저에 노출합니다. 서버 비밀 값에 `VITE_`를 붙이지 마세요. API는 패키지 작업 폴더 기준 루트 `.env`를 읽습니다. 루트 또는 패키지 pnpm 스크립트로 실행하세요.

## PostgreSQL 및 Prisma

```powershell
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps
pnpm db:validate
pnpm db:generate
```

스키마는 `apps/api/prisma/schema.prisma`, 연결 설정은 `apps/api/prisma.config.ts`입니다. Prisma 7의 PostgreSQL adapter를 사용하고 Client는 `apps/api/src/generated/prisma`에 생성합니다. `build`, `typecheck`, `test`에서 자동 생성하므로 생성물을 커밋하지 않습니다. TASK-01에는 비즈니스 모델과 migration이 없으며 DB 확인은 Prisma의 실제 `SELECT 1`로 수행합니다.

TASK-02에서 모델을 작성한 후:

```powershell
pnpm db:migrate --name initial_domain
pnpm db:generate
pnpm db:deploy
pnpm db:studio
# 임의 Prisma CLI 명령
pnpm --filter @date-planner/api exec prisma migrate status
```

`db:migrate`는 개발 환경 전용, `db:deploy`는 커밋한 migration을 배포 환경에 적용하는 명령입니다. 생성된 SQL을 검토하고 migration 폴더를 커밋하세요. 상세 내용은 [DATABASE](docs/DATABASE.md)를 참고하세요.

## 개발 서버

```powershell
pnpm dev
```

공통 패키지 및 API를 먼저 빌드한 후 shared 감시, 웹, API를 동시에 실행합니다. API 변경 시 TypeScript 재컴파일 후 Node watch가 재시작합니다. Ctrl+C로 전체 프로세스를 종료합니다. API는 shutdown hook에서 Prisma 연결을 정리합니다.

- 웹: [localhost:5173](http://localhost:5173)
- API: [health](http://localhost:3000/api/v1/health)
- DB: [health/db](http://localhost:3000/api/v1/health/db)
- 웹 경로: `/`, `/login`, `/places`, `/plans`, `/map`, `/settings`

DB가 없어도 일반 health와 웹을 실행할 수 있습니다. DB health는 연결을 시도하며 실패하면 503입니다. 건강 상태 응답은 별도 `data` 래퍼 없이 반환합니다.

## 빌드 및 검사

```powershell
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
```

`pnpm test`는 Nest HTTP 테스트(정상 health, DB 성공/실패, 404, CORS, 환경변수 검증)와 웹 API 요청 테스트를 실행합니다. 자동 테스트의 DB 경계는 mock이므로 실제 DB 확인을 대체하지 않습니다. 실제 DB는 Compose 실행 후 HTTP로 확인합니다:

```powershell
Invoke-RestMethod http://localhost:3000/api/v1/health
Invoke-RestMethod http://localhost:3000/api/v1/health/db
```

`pnpm --filter @date-planner/api start`는 빌드한 API를 실행합니다. `pnpm --filter @date-planner/web preview`는 웹 빌드 결과를 미리 봅니다. 정적 호스팅은 SPA 경로를 `index.html`로 재작성해야 합니다. PWA는 HTTPS 또는 localhost에서 확인합니다. 개발 서비스 워커는 꺼져 있으며 프로덕션 API 캐시는 사용하지 않습니다. SVG는 임시 아이콘이므로 실제 배포 전 PNG 및 maskable 아이콘을 추가하세요. Share Target 확장 지점은 `apps/web/src/pwa/README.md`에 설명했습니다.

## 자주 발생하는 오류

- `docker` 명령 없음 / daemon 연결 실패: Docker Desktop을 설치·실행하고 터미널을 다시 여세요. Windows에서는 WSL2 구성을 확인하세요.
- 5432 포트 충돌: 기존 PostgreSQL을 확인하세요. Compose host 포트를 바꾸면 `DATABASE_URL`도 수정해야 합니다.
- DB 인증 실패: `.env` 값을 확인하세요. 기존 볼륨에는 최초 비밀번호가 유지되므로 환경변수 수정만으로 비밀번호가 바뀌지 않습니다. 데이터가 있는 볼륨을 임의로 삭제하지 마세요.
- `Invalid environment`: `DATABASE_URL`, `CORS_ORIGIN`, 유효한 `API_PORT`를 확인하세요. 비밀 값은 오류 로그에 출력하지 않습니다.
- 웹 CORS 오류: 웹 접속 Origin(프로토콜·호스트·포트)을 `CORS_ORIGIN`에 정확히 추가하고 API를 재시작하세요.
- 웹/API 포트 충돌: `.env`의 포트를 바꾸고 `VITE_API_BASE_URL`, `CORS_ORIGIN`도 맞추세요.
- Prisma Client 없음: `pnpm db:generate`를 실행하세요. DB 없이 생성 가능합니다.
- 설치 네트워크 오류: npm registry와 Prisma 엔진 다운로드 접근, 프록시 정책을 확인하세요.
- 오래된 PWA 화면: 개발자 도구 Application에서 서비스 워커 등록 해제 및 사이트 데이터를 삭제하세요.

검증 환경 및 미검증 사항은 [TASK-01 보고서](docs/TASK-01-REPORT.md)를 참고하세요.

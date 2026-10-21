# PostgreSQL / Prisma

## 개발 연결

| 항목          | 기본값                                      |
| ------------- | ------------------------------------------- |
| 컨테이너      | date-planner-postgres                       |
| 이미지        | postgres:18.6-alpine                        |
| 호스트 / 포트 | localhost / 5432 (127.0.0.1에만 바인딩)     |
| 데이터베이스  | date_planner                                |
| 사용자        | date_planner                                |
| 비밀번호      | 루트 .env의 POSTGRES_PASSWORD               |
| 영구 볼륨     | postgres_data (Compose project prefix 적용) |

API는 호스트에서 실행하므로 `DATABASE_URL` 호스트가 `localhost`입니다. 추후 API를 Compose에 넣으면 컨테이너 내부 연결 호스트를 `postgres`로 변경합니다. 로컬 개발용 DB 계정이며 운영 비밀·계정 정책은 배포 작업에서 별도 설정합니다.

PostgreSQL 18 이미지에 맞춰 볼륨은 `/var/lib/postgresql`에 마운트합니다. 버전과 경로는 [PostgreSQL 지원 정책](https://www.postgresql.org/support/versioning/)과 [Docker 공식 이미지 문서](https://hub.docker.com/_/postgres)를 기준으로 선택했습니다. Docker 미설치 환경에서는 이미지 pull 및 실제 실행을 검증하지 못했습니다.

```powershell
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps
docker compose logs postgres
```

`pg_isready`로 컨테이너 health를 확인합니다. 실제 앱 인증·쿼리는 `/api/v1/health/db`가 확인합니다. `docker compose down`은 컨테이너만 내리며 기본적으로 볼륨을 보존합니다. `down -v`는 데이터를 삭제하므로 데이터가 불필요하다고 명시적으로 판단하기 전 실행하지 마세요.

## Prisma 설정

Prisma CLI/Client/adapter는 동일 버전입니다. Prisma 7의 `prisma-client` ESM generator를 사용하며 생성 경로는 `apps/api/src/generated/prisma`입니다. PostgreSQL datasource의 URL은 스키마가 아닌 `prisma.config.ts`에서 설정하고 루트 `.env`를 읽습니다. Client 생성·스키마 검증에는 DB 연결이 필요 없으며 CLI의 기본 URL은 생성 작업을 위한 비밀 없는 fallback입니다. 실제 API 시작에는 유효한 `DATABASE_URL`이 필수입니다.

TASK-01 스키마는 모델이 없습니다. Client의 raw query로 `SELECT 1`을 실행하고 성공 시 DB health 200, 실패 시 503을 반환합니다. DB 접속을 애플리케이션 시작 시 강제하지 않아 liveness와 DB health를 구분할 수 있습니다. shutdown 시 Prisma pool을 종료합니다.

```powershell
pnpm db:generate
pnpm db:validate
pnpm db:studio
pnpm --filter @date-planner/api exec prisma --help
```

## Migration

TASK-01에서는 초기 빈 migration이나 임시 비즈니스 테이블을 만들지 않습니다. TASK-02에서 모델 설계 후 개발 DB에서 아래를 실행합니다:

```powershell
pnpm db:migrate --name initial_domain
pnpm db:generate
pnpm --filter @date-planner/api exec prisma migrate status
```

생성 SQL과 관계/인덱스/삭제 정책을 검토하고 `apps/api/prisma/migrations`를 커밋합니다. 개발 migration은 shadow database 생성 권한이 필요할 수 있습니다. 배포에서는 검토된 migration만 `pnpm db:deploy`로 적용합니다. 운영 DB에서 `migrate dev`, `db push`, `migrate reset`을 실행하지 않습니다.

## TASK-02 예정 스키마

User의 외부 인증 식별자, Couple과 멤버십·초대, Place의 저장 범위와 외부 장소 식별자, Plan과 일정별 장소·순서를 설계합니다. 모든 도메인 접근에 커플 권한 경계를 명시합니다. 개인정보 최소 수집, 유니크 제약, 생성·수정 시각, 탈퇴·커플 해제 및 cascade 정책도 검토합니다. 이 문서는 설계 후보이며 TASK-01에는 해당 모델을 구현하지 않습니다.

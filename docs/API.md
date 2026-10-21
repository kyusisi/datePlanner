# API

기본 주소: `http://localhost:3000/api/v1`. Prefix는 `/api/v1`입니다. TASK-01 Health API는 인증 없이 호출합니다.

## GET /health

프로세스 생존 여부를 확인합니다. DB 연결 여부와 독립적입니다. HTTP 200:

```json
{ "status": "ok", "service": "date-planner-api" }
```

## GET /health/db

Prisma와 PostgreSQL adapter를 통해 `SELECT 1`을 실행합니다. 연결·쿼리 timeout은 각각 3초입니다. HTTP 200:

```json
{ "status": "ok", "database": "connected" }
```

연결 실패 시 HTTP 503:

```json
{
  "statusCode": 503,
  "code": "SERVICE_UNAVAILABLE",
  "message": "Database connection unavailable",
  "path": "/api/v1/health/db",
  "timestamp": "2026-10-21T00:00:00.000Z"
}
```

오류에 DB 접속 정보나 내부 stack을 포함하지 않습니다. 이 endpoint는 TASK-01에서 필수 연결 상태 확인용이며 외부 운영 노출 정책은 배포 시 결정합니다.

## 공통 응답

`packages/shared`에서 `ApiResponse<T>`, `ApiError`, Health 응답 타입과 API 상수를 export합니다. 향후 비즈니스 API의 기본 성공 envelope는 `{ "data": T }`로 준비했습니다. TASK-01 Health는 위의 명세대로 평문 JSON 객체를 반환하며 성공 envelope를 강제로 적용하는 interceptor는 없습니다.

모든 HTTP 예외는 `ApiError` 구조를 따릅니다. `message`는 문자열 또는 DTO 검증 메시지 배열입니다. 일반 HTTP 오류 코드는 `HTTP_400`, `HTTP_404` 등이며 500은 `INTERNAL_SERVER_ERROR`입니다. 예상하지 못한 오류 메시지는 외부에 노출하지 않습니다.

전역 ValidationPipe는 DTO 변환, whitelist, 알 수 없는 필드 거부를 활성화합니다. 실제 입력 DTO는 후속 작업에서 추가합니다. CORS Origin은 환경변수의 명시적인 Origin 목록만 허용하며 인증 cookie 정책은 TASK-03에서 확정합니다.

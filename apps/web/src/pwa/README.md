# PWA 확장 지점

Manifest와 Workbox 설정은 `vite.config.ts`에서 관리합니다. 개발 서버에서는 서비스 워커를 등록하지 않습니다. 프로덕션에서는 기본 정적 셸만 사전 캐시하며 API 응답 캐시는 설정하지 않습니다.

TASK-01에는 Share Target manifest 항목이나 공유 수신 라우트가 없습니다. 추후 `share_target`과 수신 라우트, 파일/URL 검증, 인증 후 복귀 동작을 함께 설계합니다. 실제 기기 배포 전 PNG 192/512 아이콘 및 maskable 아이콘을 추가하고 설치 호환성을 검증합니다.

배포 버전 테스트 후 개발 환경으로 돌아왔을 때 오래된 서비스 워커가 남았다면 브라우저 개발자 도구의 Application → Service Workers → Unregister와 Clear site data를 사용합니다.

# TODO

맥북 전원 온보딩 흐름 기반 포트폴리오 UI를 완성한다.

## Done So Far

- [x] `App` 레벨에서 `splash -> lock -> desktop` 화면 전환 연결
- [x] Splash / Lock / Desktop 기본 화면 구현 및 전환 애니메이션 정리
- [x] 공통 시간 소스(`timeKeeper`) 및 날짜 포맷 유틸 정리
- [x] 메뉴바 기본 UI 구성 + Apple 로고 컴포넌트 연동
- [x] Dock 기본 UI 구성
- [x] Apple 로고 SVG 자산을 `src/assets/icons`로 이관
- [x] `yarn icons` 기반 아이콘 생성 자동화 스크립트 구축
- [x] light/dark 아이콘 쌍 자동 래퍼(`mode: light | dark | system`) 생성
- [x] 아이콘 템플릿 파일을 `scripts/` 하위로 정리
- [x] 로컬 기준 동기화(삭제 반영 포함) 작업 규칙 확정

## Current Sprint (Priority)

- [ ] MenuBar hover 시 하단 메뉴(드롭다운/패널) 노출 인터랙션 구현
- [ ] Window 공통 컴포넌트 제작 (`titlebar`, `traffic light`, `content`)
- [ ] Window 최소화/최대화/복원 애니메이션 구현
- [ ] Launchpad 화면/레이아웃/열기-닫기 모션 구현
- [ ] Desktop 아이콘/윈도우 Drag & Drop 인터랙션 구현

## Next Backlog

- [ ] 프리로드 실패 시 Splash fallback UX 정리
- [ ] 포트폴리오 앱(소개/프로젝트/연락처) window 연결
- [ ] 포트폴리오 컨텐츠(소개/기술스택/프로젝트/링크) 실데이터 반영
- [ ] 창 포커스/active z-index 규칙 고도화
- [ ] 접근성(키보드 탐색, aria, focus ring) 점검

## Tech / Quality

- [ ] `yarn icons` 생성 결과에 대한 최소 스모크 테스트 규칙 추가
- [ ] 인터랙션 많은 컴포넌트(Dock/Window/MenuBar) 단위 테스트 기반 추가
- [ ] 스타일 토큰(간격/색상/radius/blur) 공통화

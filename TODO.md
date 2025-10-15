# TODO

맥북 전원 온보딩 흐름 기반 포트폴리오 UI를 완성한다.

## Done So Far

- [x] `App` 레벨에서 `splash -> lock -> desktop` 화면 전환 연결
- [x] Splash / Lock / Desktop 기본 화면 구현 및 전환 애니메이션 정리
- [x] 공통 시간 소스(`timeKeeper`) 및 날짜 포맷 유틸 정리
- [x] 메뉴바 기본 UI 구성 + Apple 로고 컴포넌트 연동
- [x] Dock 기본 UI 구성
- [x] 디자인 토큰 기반 색상/타이포그래피 정리 및 메뉴/패널 반영
- [x] 메뉴바 활성 메뉴 상태 + 서브메뉴 패널 인터랙션 구현
- [x] Launchpad 오버레이(열기/닫기/검색/페이지/드래그 스와이프) 구현
- [x] Launchpad 검색 UX(포커스 애니메이션, 결과 하이라이트) 반영
- [x] Launchpad 구조 분리 시작
- [x] `features/launchpad/model`에 레이아웃/검색/페이지네이션 로직 분리
- [x] `features/launchpad/ui`에 `LaunchpadSearchBar`, `LaunchpadIcon` 분리
- [x] `shared/dnd/reorder.ts` 공통 정렬 유틸 추가(추후 desktop/dock 재사용 예정)
- [x] Launchpad 레이아웃 localStorage 저장 기반(`useLaunchpadLayout`) 연결

## Current Sprint (Priority)

- [ ] Launchpad 아이콘 Drag & Drop 정렬 구현 + localStorage 반영
- [ ] Launchpad 그룹 생성/해제(폴더) 데이터 모델 설계 및 구현
- [ ] Dock/Desktop에서도 재사용 가능한 공통 DnD 이벤트 계층 분리
- [ ] Window 공통 컴포넌트 제작 (`titlebar`, `traffic light`, `content`)
- [ ] Window 최소화/최대화/복원 애니메이션 구현

## Next Backlog

- [ ] Launchpad 페이지 간 드래그 이동(아이콘 끌고 페이지 넘김)
- [ ] Desktop 아이콘/윈도우 Drag & Drop 인터랙션 구현
- [ ] Dock 아이템 재정렬/고정(고정 앱 vs 최근 앱) 모델링
- [ ] 창 포커스/active z-index 규칙 고도화
- [ ] 접근성(키보드 탐색, aria, focus ring) 점검

## Tech / Quality

- [ ] Launchpad model/UI 단위 테스트 추가
- [ ] 인터랙션 많은 컴포넌트(Dock/Window/MenuBar) 단위 테스트 기반 추가
- [ ] 아이콘 자산 로딩 전략 최적화(초기 mount 버벅임 최소화)

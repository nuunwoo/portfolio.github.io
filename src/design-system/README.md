# Design System

현재 프로젝트의 디자인 시스템은 아래 4계층으로 구성됩니다.

1. `tokens/`
- 디자인 토큰(CSS variables)
- 현재: `menu.tokens.css`

2. `components/`
- 재사용 가능한 UI 컴포넌트
- 현재:
  - `menu/MenuRow`
  - `window/WindowFrame`, `window/WindowTrafficLights`
  - `search/SearchField`
  - `dock/OsDock`
  - `button/OsButton`
  - `toolbar/Toolbar`
  - `sidebar/Sidebar`
  - `tabs/Tabs`
  - `popover/PopoverSurface`
  - `dialog/DialogSurface`
  - `sheet/SheetSurface`
  - `progress/ProgressBar`
  - `badge/Badge`
  - `split-view/SplitView`
  - `list/ListView`
  - `control/Switch`, `control/Checkbox`, `control/Radio`
  - `form/TextField`, `form/SelectField`, `form/Slider`
  - `navigation/Breadcrumbs`
  - `data/TableView`
  - `overlay/Tooltip`, `overlay/ContextMenuSurface`
  - `pattern/SpotlightOverlay`, `pattern/NotificationCenter`, `pattern/LaunchpadGrid`, `pattern/MissionControlView`

3. `icons/`
- 디자인시스템 컴포넌트 전용 아이콘 진입점
- 현재: `AppleLogoIcon`, `MenuChevronIcon`, `SearchMagnifyingglassIcon`, `WindowCloseIcon`, `WindowMinimizeIcon`, `WindowZoomIcon`

4. `index.css`
- 토큰 진입점
- `src/index.css`에서 전역 import

## 원칙
- 토큰은 `--ds-*` prefix 사용
- 컴포넌트 상태(`hover`, `disabled`, `selected`)는 컴포넌트 모듈 CSS에서 관리
- 앱 화면 컴포넌트는 디자인시스템 컴포넌트를 조합하는 역할만 담당

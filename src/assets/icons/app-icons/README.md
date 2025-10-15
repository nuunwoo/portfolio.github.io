# app-icons naming

Launchpad / Dock 앱 아이콘은 `kebab-case`로 관리합니다.

Dock 기본 세트

- `finder.svg`
- `launchpad.svg`
- `mail.svg`
- `calendar.svg`
- `notes.svg`
- `terminal.svg`
- `trash.svg`

Launchpad 기본 세트

- `finder.svg`
- `mail.svg`
- `calendar.svg`
- `notes.svg`
- `terminal.svg`
- `system-settings.svg`
- `app-store.svg`
- `photos.svg`
- `music.svg`
- `maps.svg`
- `preview.svg`

규칙

- 공백은 `-`로 변환
- 약어도 소문자 유지 (`app-store`, `system-settings`)
- 아이콘 의미가 중복되는 이름은 단순화 (`folder-icon` -> `folder`, `document-icon` -> `document`)
- 기존 파일명 변경 시 `src/components/icons/app-icons/index.tsx`의 매핑도 함께 수정

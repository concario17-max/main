# 모바일 스크롤 이슈 해결 파업 (plan.md)

## 목표
데스크톱 프리미엄 UI(1안 뷰, 스크롤 없는 물리 기반 카드 렌더링)는 완벽하게 훼손 없이 유지하되, 모바일 환경(작은 뷰포트)에서 카드 레이아웃이 화면 밖으로 밀려날 때 자연스러운 수직 스크롤을 허용한다.

## 원인 분석 (상세 내용은 `research.md` 참조)
1. `body` 태그의 하드코딩된 `h-screen`, `overflow-hidden`
2. `main` 태그의 하드코딩된 `overflow-hidden`
3. 모바일 스크롤 발생 시 커스텀 스크롤바(`src/style.css`)의 패딩 문제

## Todo 리스트 (실행 계획)

### 1단계: 마크업 분기 처리 (`index.html` 수정)
- [ ] `body` 요소의 클래스 속성 수정:
  - 기존: `h-screen overflow-hidden`
  - 변경: `min-h-screen md:h-screen overflow-x-hidden overflow-y-auto md:overflow-hidden`
  - 목적: 모바일에서는 콘텐츠 길이에 맞춰 높이가 늘어나고 수직 스크롤 렌더링을 허용하며, 데스크톱(`md:` 브레이크포인트 이상)에서는 기존 `hidden` 상태를 강제.

- [ ] `main` 요소의 클래스 속성 수정:
  - 기존: `overflow-hidden`
  - 변경: `overflow-visible md:overflow-hidden`
  - 목적: 부모 컨테이너(body)로 카드 영역의 높이를 온전히 전달하기 위함.

### 2단계: CSS & 레이아웃 디테일 보정 (`index.html` & `src/style.css`)
- [ ] 모바일 환경에서 위아래 여백(Padding) 추가:
  - `main` 태그나 내부 `grid` 박스의 상/하단 여백(`py-10` 등)을 추가하여 끝까지 스크롤 시 카드가 잘리지 않도록 보호.
- [ ] 커스텀 스크롤바 다듬기:
  - `src/style.css`에서 `::-webkit-scrollbar` 관련 CSS가 모바일 오버플로우 트랙에 이질감을 주지 않는지 점검 및 필요 시 `md:` 분기 미디어 쿼리 적용 검토 (바닐라 CSS 지원 여부 확인 필요, 기본적으로는 유지).

### 3단계: 렌더링 및 물리 엔진 검증
- [ ] 로컬 빌드 후 브라우저 개발자 도구의 Device Toolbar 켜기.
- [ ] 375px (iPhone SE) 규격에서 수직 스크롤이 정상 동작하는지 테스트.
- [ ] 1024px 이상 (Desktop) 해상도에서 기존 JS 물리 엔진(Hover Tilt & Magnetic CTA)이 스크롤 없이 원본 그대로 동작하는지 회귀 테스트.

### 4단계: TDD 기반 강제 Commit
- [ ] 변경 사항 이상 없음을 확인 후, Ray Standard에 의거한 `git auto-commit` 진행 (`docs: write implementation plan for mobile scroll fix`).

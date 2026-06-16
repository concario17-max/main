# plan.md

## 목적
Simsang Archive 랜딩 페이지를 감도 높은 프리미엄 포털로 유지하면서도, 구조적으로 읽기 쉽고 수정하기 쉬운 정적 사이트로 관리한다.

## 완료된 작업

### 모바일 스크롤 레이아웃
- [x] `body`를 모바일에서 `min-h-screen` + 세로 스크롤이 가능한 구조로 조정
- [x] `main`을 모바일에서 `overflow-visible`로 변경해 카드 영역이 자연스럽게 확장되도록 수정
- [x] 모바일 기준 헤더와 카드 그리드 간격 조정
- [x] 모바일 전용 광원, 그레인, 그림자 강도 완화

### 구조 리팩터링
- [x] 카드 콘텐츠를 [src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js)로 분리
- [x] SVG 아이콘을 [src/data/cardIcons.js](/C:/Users/roadsea/Desktop/main/src/data/cardIcons.js)로 분리
- [x] 카드 렌더링을 [src/modules/renderCards.js](/C:/Users/roadsea/Desktop/main/src/modules/renderCards.js)로 분리
- [x] 카드 인터랙션을 [src/modules/cardEffects.js](/C:/Users/roadsea/Desktop/main/src/modules/cardEffects.js)로 분리
- [x] 파티클 효과를 [src/modules/stardust.js](/C:/Users/roadsea/Desktop/main/src/modules/stardust.js)로 분리
- [x] 테마 토글을 [src/modules/theme.js](/C:/Users/roadsea/Desktop/main/src/modules/theme.js)로 분리
- [x] 비밀번호 게이트를 [src/modules/entryGate.js](/C:/Users/roadsea/Desktop/main/src/modules/entryGate.js)로 분리
- [x] 스타일을 `base/components/effects/animations` 계층으로 분리
- [x] 미사용 포털 오버레이 제거
- [x] inline 이벤트 제거

### UI/카피 개선
- [x] 첫 카드 1장을 featured 구조로 승격
- [x] 카드별 tone/CTA 차별화
- [x] 헤더 보조 문장을 이해 가능한 카피로 정리
- [x] 카드 설명과 라벨 문구를 구조화된 카피로 정리
- [x] 메타/OG/Twitter/manifest 문구 정리
- [x] 한글 카드 라벨과 pill 문구 정상화

### 접근성/상태
- [x] 테마 토글 `aria-label` 추가
- [x] 외부 링크에 `rel="noopener noreferrer"` 적용
- [x] 테마 상태 `localStorage` 저장
- [x] 엔트리 게이트 `role`, `aria-labelledby`, `aria-describedby` 추가
- [x] 엔트리 게이트 포커스 트랩과 앱 셸 `inert` 처리 추가
- [x] `prefers-reduced-motion` 대응 추가
- [x] 포커스 스타일 보강

### 검증
- [x] `npm run build` 기준 빌드 확인
- [x] [scripts/smoke-check.mjs](/C:/Users/roadsea/Desktop/main/scripts/smoke-check.mjs) 추가 및 확장
- [x] [scripts/browser-smoke.mjs](/C:/Users/roadsea/Desktop/main/scripts/browser-smoke.mjs) 추가
- [x] 카드 개수, slug, 링크, 메타 문구, featured 카드, reduced-motion 대응, 스타일 import, `delay-*` 매핑 검증
- [x] 엔트리 게이트, theme toggle, 카드 렌더, 외부 링크 popup까지 브라우저 수준 스모크 검증
- [x] 카드 스타일의 `nth-child` 의존 제거 여부 검증

## 현재 QA 체크리스트
1. `npm run build`
2. `npm run check:smoke`
3. `npm run check:browser`
4. 데스크톱에서 카드 hover tilt, spotlight, CTA 모션 확인
5. 모바일에서 헤더 밸런스와 카드 간격 확인
6. 다크 모드 토글과 저장 상태 확인
7. 공유 메타(title, description, OG/Twitter) 문구 확인

## 현재 상태 요약
- 랜딩 페이지는 단일 [index.html](/C:/Users/roadsea/Desktop/main/index.html) + Vite 기반 정적 구조다.
- 카드 데이터와 아이콘은 데이터 계층으로 분리되어 있다.
- 렌더링, 인터랙션, 테마, 비밀번호 게이트는 모듈화되어 있다.
- 스타일은 역할별 파일로 분리되어 있다.
- featured 카드, 모바일 밀도 조정, reduced-motion 대응, 엔트리 게이트 안정화, 브라우저 스모크 체크까지 반영된 상태다.

## 구현 전 상세 TODO

우선순위 기준: 인코딩/문서 위생 -> 비밀번호 게이트 안정화 -> 카드 데이터 품질

### 1. 인코딩/문서 위생 정리
- [x] `index.html`, `src/data/cards.js`, `plan.md`, `research.md`의 한글 깨짐 여부를 다시 점검한다.
- [x] UTF-8 기준으로 실제 파일 인코딩 상태를 확인하고, 파일별 이상 여부를 기록한다.
- [x] 브라우저 표시 문제와 터미널 출력 문제를 분리해서 기록한다.
- [x] 사용자 노출 텍스트와 메타 문구의 최종 원문 목록을 확정한다.

### 2. 비밀번호 게이트 안정화 점검
- [x] 현재 게이트 진입 흐름을 데스크톱과 모바일 기준으로 다시 검토한다.
- [x] 캐시 영향 가능성, `sessionStorage` 의존성, 버튼 클릭과 엔터 입력 흐름을 각각 점검한다.
- [x] 클라이언트 전용 보호라는 한계를 문서화한다.
- [x] 서버 또는 엣지 보호로 전환할 필요가 있는지 후속 과제로 분리한다.

### 3. 카드 데이터 품질 점검
- [x] 각 카드의 `label`, `portal`, `heading`, `cta`, `description` 최종 표기를 확정한다.
- [x] 긴 한글 부제목의 `compactLabel` 적용 기준을 재검토한다.
- [x] 카드별 `tone`과 실제 의미 매칭이 자연스러운지 점검한다.
- [x] 외부 링크 도메인과 목적지 유효성을 다시 확인한다.

### 4. 헤더/메타/공유 문구 정리
- [x] 헤더 본문, pill, OG/Twitter, manifest 문구의 언어 정책을 확정한다.
- [x] 카드 수가 늘어나도 깨지지 않는 일반화 문구를 유지할지 확인한다.
- [x] 카카오톡과 OG 공유 제목, 설명, 이미지 조합을 점검한다.
- [x] 메타 문구와 실제 화면 카피 사이의 불일치를 정리한다.

### 5. UI 가독성/레이아웃 QA
- [x] 긴 카드 라벨 잘림 여부를 데스크톱과 모바일에서 각각 점검한다.
- [x] featured 카드와 일반 카드의 시각 위계가 과하거나 약하지 않은지 검토한다.
- [x] pill, subtitle, description의 명도 대비를 확인한다.
- [x] 작은 화면에서 카드 간격, 패딩, 헤더 밀도를 다시 점검한다.

### 6. 인터랙션/접근성 점검
- [x] `prefers-reduced-motion` 대응이 실제 모든 주요 모션에 적용되는지 확인한다.
- [x] 키보드 포커스 이동과 `focus-visible` 표시를 점검한다.
- [x] 비밀번호 게이트 오버레이의 `role`, `aria-*` 속성을 재검토한다.
- [x] 다크/라이트 전환 시 텍스트 대비와 배경 효과 균형을 확인한다.

### 7. 검증 체계 보강 후보
- [x] 현재 smoke check가 문자열 검증 중심이라는 점을 문서에 명시한다.
- [x] 실제 브라우저 수준 E2E 또는 최소 UI 스모크 테스트 도입 후보를 정리한다.
- [x] entry gate, 카드 클릭, theme toggle을 브라우저 테스트 우선순위로 지정한다.
- [x] 시각 회귀 테스트가 필요한지 별도 판단 항목으로 남긴다.

### 8. 정리 대상 파일/산출물 관리
- [x] `.compare` 폴더를 계속 보관할지 삭제할지 결정 항목을 추가한다.
- [x] `design/` 디렉터리의 유지 목적을 명시한다.
- [x] `dist/`는 빌드 산출물로만 취급한다는 점을 재확인한다.
- [x] `plan.md`, `research.md`를 현재 코드 상태와 계속 동기화하는 규칙을 명시한다.

## 후속 작업 후보
1. 클라이언트 비밀번호 게이트를 서버 또는 엣지 보호로 대체
2. 브라우저 스모크를 시각 회귀나 모바일 에뮬레이션까지 확장
3. `.compare` 보관 정책 확정 후 정리
## 2026-03-20 Detailed TODO

Goal: fix the remaining functional and architectural issues without starting implementation until the plan is reviewed.

### A. Entry Gate Persistence Bug
- [ ] Reproduce the refresh problem and confirm whether the gate reappears because the unlock state is not being read, not being written, or being cleared unexpectedly.
- [ ] Trace the exact lifecycle of `initEntryGate()` from first load, successful unlock, reload, and failure states.
- [ ] Verify the current storage key, storage medium, and fallback behavior in normal browsing and storage-restricted cases.
- [ ] Decide the correct persistence contract:
- [ ] persist across reloads in the same browser
- [ ] optionally persist across browser restarts
- [ ] define expected behavior when storage is unavailable
- [ ] Plan a regression test update for refresh persistence.

### B. Real Korean Text and Encoding Hygiene
- [ ] Audit all user-facing Korean strings in:
- [ ] `index.html`
- [ ] `src/data/cards.js`
- [ ] `src/modules/entryGate.js`
- [ ] `public/manifest.json`
- [ ] `scripts/smoke-check.mjs`
- [ ] `scripts/browser-smoke.mjs`
- [ ] `plan.md`
- [ ] `research.md`
- [ ] Identify which files contain actual mojibake in source versus only terminal-display corruption.
- [ ] Define the canonical Korean copy for header pills, meta text, gate text, and all card labels.
- [ ] Plan a UTF-8 normalization pass so source files, smoke tests, and docs all use the same strings.
- [ ] Add verification steps that compare file contents instead of trusting console rendering.

### C. Entry Gate Security Boundary
- [ ] Document the current client-side-only gate as insecure behavior.
- [ ] Decide the target mitigation level:
- [ ] keep UX-only gate but make limitations explicit
- [ ] move enforcement to hosting/edge/infrastructure
- [ ] remove the fake protection entirely
- [ ] If infrastructure protection is not possible in this repo, plan the strongest safe in-repo mitigation and documentation updates.

### D. Theme Storage Robustness
- [ ] Review `src/modules/theme.js` for failure cases when `localStorage` is unavailable.
- [ ] Define graceful fallback behavior for:
- [ ] blocked storage
- [ ] private browsing edge cases
- [ ] malformed stored values
- [ ] Plan to make theme initialization and theme toggling use the same defensive storage pattern as the entry gate.

### E. Behavior Hooks Coupled to Style Classes
- [ ] Review `src/modules/cardEffects.js` selectors and identify every behavior that depends on utility classes such as `.mt-auto`.
- [ ] Decide dedicated behavior hooks or data attributes for:
- [ ] CTA magnetic motion target
- [ ] card motion binding
- [ ] any future interactive child elements
- [ ] Plan the renderer and CSS changes needed so behavior selectors remain stable even if layout classes change later.

### F. Browser Smoke Reliability
- [ ] Reproduce the `spawn EPERM` failure path in the current environment and confirm whether it is caused by sandboxed process spawning, Vite preview startup, or Playwright launch.
- [ ] Decide whether `scripts/browser-smoke.mjs` should:
- [ ] stay as-is and be documented as environment-sensitive
- [ ] use a different local server boot path
- [ ] detect unsupported environments and fail with a clearer message
- [ ] Plan updates so the browser check is more reliable in restricted environments where possible.

### G. Test Coverage Gaps
- [ ] Add planned coverage for entry-gate persistence across refresh.
- [ ] Add planned checks for exact Korean copy normalization after encoding cleanup.
- [ ] Add planned checks for theme fallback behavior when storage is unavailable.
- [ ] Add planned checks that motion code safely no-ops when behavior hooks are absent.

### H. Documentation Sync
- [ ] Update `research.md` after implementation so it matches the final code, not the pre-fix state.
- [ ] Update `plan.md` checklist items to mark which risks were fully resolved versus only documented.
- [ ] Record any intentionally unresolved infrastructure/security items as explicit follow-up work.

### I. Implementation Order
- [ ] 1. Fix persistence bug for the entry gate.
- [ ] 2. Normalize real Korean copy and UTF-8 file contents.
- [ ] 3. Harden theme storage fallback.
- [ ] 4. Decouple motion behavior from style-class selectors.
- [ ] 5. Improve browser smoke reliability and expand smoke coverage.
- [ ] 6. Refresh documentation after all code and test changes settle.

## 2026-06-16 Detailed TODO: 문제점 개선 계획

Goal: research.md에 도출된 5가지 핵심 결함(테마 시스템 불일치, RAF 성능 낭비, 파티클 지연 로드, 데스크톱 레이아웃 밸런스, 쿠키 보안 강화)을 세분화하여 해결한다.

### J. 테마 시스템과 스펙의 정합성 정비
- [ ] `STATE.md` 및 `research.md` 상에서 테마 토글 비활성화 사양이 반영되도록 문구를 수정한다.
- [ ] 혹시나 테마 토글의 기능 복구가 기획적으로 요구되는지 확인하고, 미작동 중인 `src/modules/theme.js` 내 명세와 `index.html` 문서 정리를 단일 모드 고정형 명세로 확실하게 통일시킨다.

### K. 유휴 상태 애니메이션 프레임 루프 (Sleep Mode) 최적화
- [ ] `src/modules/cardEffects.js`에서 `isAnimating` 상태 플래그를 추가하여 마그네틱/틸팅 값이 모두 `0`으로 온전히 수렴했을 때 requestAnimationFrame 루프를 끄고 휴면(Idle) 상태로 전환하는 제어 로직을 작성한다.
- [ ] 각 카드 엘리먼트의 `mouseenter` 및 `mousemove` 이벤트 발생 시 휴면 상태를 즉시 깨우고 프레임 루프를 다시 시작(startLoop)하도록 리스너를 보강한다.
- [ ] 게이트 잠금 상태(`entry-locked` 클래스가 body에 존재할 때)이거나, 카드가 화면 밖으로 스크롤되어 보이지 않을 경우(IntersectionObserver 연동) 프레임 연산을 원천적으로 차단한다.

### L. 배경 파티클 (Stardust) 지연 초기화 구현
- [ ] `src/main.js`의 `DOMContentLoaded` 리스너에서 `initStardust()` 호출부의 즉시 실행을 제거한다.
- [ ] `src/modules/entryGate.js` 내의 성공적인 잠금 해제 함수(`unlock()`) 안에서, 게이트 화면이 완전 소멸하는 단계 직전에 `initStardust()`가 동적으로 바인딩 및 생성되도록 호출 시점을 지연시킨다.

### M. 데스크톱 5열 레이아웃 최적화 및 7개 카드 밸런싱
- [ ] `src/styles/components.css`에서 데스크톱 해상도(`@media (min-h-screen...)` 대역의 그리드 열 수)를 기존 4열에서 명세에 기재된 5열(`repeat(5, minmax(0, 1fr))`)로 변경한다.
- [ ] `featured` 카드가 가로 2열(`grid-column: span 2`)을 차지하도록 css 구조를 설계하여, 총 7개의 카드가 2 (featured) + 5 (나머지 카드) = 7칸의 시각적으로 균형 잡힌 5열 레이아웃을 형성하도록 매핑한다.

### N. 쿠키 보안 플래그 강화
- [ ] `src/modules/storage.js`의 `setPersistentValue` 내에서 쿠키 생성 구문에 HTTPS 환경에서만 쿠키가 안전하게 송수신되도록 `Secure` 속성을 추가한다.

### O. 회귀 검증 및 빌드 스모크 테스트 실행
- [ ] 수정 사항들을 반영한 후 `cmd /c npm run build` 명령을 실행해 프로덕션 빌드가 성공적으로 완료되는지 점검한다.
- [ ] `cmd /c npm run check:smoke` 테스트를 구동하여 5열 레이아웃과 수정한 모듈 상태 검증 명세들이 모두 정상 통과하는지 확인한다.


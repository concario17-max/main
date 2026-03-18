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

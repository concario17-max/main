# Simsang Archive - 심층 기술 분석 보고서

## 1. 프로젝트 정체성
Simsang Archive는 4개의 외부 아카이브 서비스를 프리미엄 전시장처럼 연결하는 정적 포털이다.
앱이라기보다 큐레이션된 브랜드 랜딩에 가깝고, 핵심 가치는 데이터 처리보다 분위기, 타이포그래피, 인터랙션 감각에 있다.

현재 구조는 "얇은 HTML 셸 + 데이터 기반 카드 렌더링 + 바닐라 JS 인터랙션 모듈 + Tailwind/CSS 효과 계층"으로 정리돼 있다.

## 2. 현재 파일 구조

### 루트
- `index.html`: 문서 셸, 메타, 배경 레이어, 헤더, 카드 그리드 컨테이너
- `package.json`: 실행 스크립트와 도구 의존성
- `vite.config.js`: 개발 서버와 빌드 출력 설정
- `tailwind.config.js`: 색상, 폰트, 그림자 토큰
- `postcss.config.js`: Tailwind/PostCSS 연결
- `plan.md`: 작업 계획 문서
- `research.md`: 분석 보고서

### 소스
- `src/main.js`: 전체 초기화 엔트리
- `src/data/cards.js`: 카드 데이터 소스
- `src/data/cardIcons.js`: 카드 SVG 아이콘 팩토리
- `src/modules/renderCards.js`: 카드 마크업 렌더
- `src/modules/cardEffects.js`: 카드 호버 물리 효과
- `src/modules/stardust.js`: 파티클 초기화
- `src/modules/theme.js`: 테마 토글과 저장
- `src/style.css`: 스타일 엔트리
- `src/styles/base.css`: 기본 스타일과 스크롤바
- `src/styles/components.css`: 카드/포커스 같은 컴포넌트 계층
- `src/styles/effects.css`: 광원, 그레인, 글로우
- `src/styles/animations.css`: 키프레임과 delay 유틸리티

### 기타
- `public/`: 파비콘, OG 이미지, 매니페스트
- `scripts/smoke-check.mjs`: 최소 스모크 검증
- `design/`: 과거 시안 또는 참고 산출물

## 3. 빌드와 실행 방식
이 프로젝트는 런타임 프레임워크가 없는 Vite 기반 정적 사이트다.

### 스크립트
- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 확인
- `npm run check:smoke`: 핵심 구조 회귀 검증

### 기술 스택
- HTML5
- Vanilla JavaScript
- Tailwind CSS
- PostCSS
- Vite

브라우저에서 실제로 동작하는 로직은 모두 직접 작성한 JS 모듈이다.
React, Vue, 상태 관리 라이브러리, 라우터, API 계층은 없다.

## 4. 실제 런타임 흐름

1. 브라우저가 `index.html`을 읽는다
2. Google Fonts, Material Symbols, 스타일 엔트리를 로드한다
3. `src/main.js`가 실행된다
4. `DOMContentLoaded` 시점에 카드 렌더링이 먼저 일어난다
5. 이어서 테마 초기화, 카드 인터랙션 초기화, 스타더스트 초기화가 실행된다

즉 현재 앱 초기화 순서는 다음과 같다.

- `renderCards(cards)`
- `initThemeToggle()`
- `initCardEffects()`
- `initStardust()`

이 순서는 중요하다.
카드 DOM이 먼저 렌더된 다음에야 카드 효과 엔진이 `.premium-card`를 찾을 수 있기 때문이다.

## 5. HTML 구조 분석

### Head
`index.html`의 head는 메타 품질에 꽤 신경 쓴 편이다.

- favicon / apple touch icon
- `manifest.json`
- OG 메타
- Twitter 카드 메타
- 외부 폰트
- 메인 스타일

정적 사이트지만 공유 시 썸네일과 설명 품질을 챙긴다.

### Body
body는 시각 레이어와 콘텐츠 레이어로 분리되어 있다.

배경 레이어:
- 글로우
- 3개의 오라
- 점 패턴
- 스타더스트 컨테이너

콘텐츠 레이어:
- 테마 토글 버튼
- 헤더
- 카드 그리드 컨테이너

### 모바일/데스크톱 분기
모바일 스크롤 이슈 수정이 이미 반영되어 있다.

- 모바일: `min-h-screen overflow-y-auto`
- 데스크톱: `md:h-screen md:overflow-hidden`

메인과 그리드도 모바일에서 자연 스크롤을 허용하는 쪽으로 분기돼 있다.

### 카드 렌더링 방식
예전에는 카드 4장이 `index.html`에 직접 반복 작성돼 있었다.
현재는 `id="cards-grid"` 컨테이너만 남겨두고, 실제 카드는 JS가 데이터 기반으로 주입한다.

이 변화의 의미는 크다.

- 카드 추가/수정이 쉬워짐
- 반복 마크업 제거
- 링크/카피 관리가 한곳으로 모임
- DOM 계약이 단순해짐

## 6. 데이터 계층

`src/data/cards.js`는 현재 UI의 핵심 콘텐츠 소스다.
각 카드 객체는 다음 필드를 갖는다.

- `slug`
- `heading.main`
- `heading.accent`
- `copy.label`
- `copy.description`
- `copy.cta`
- `href`
- `delayClass`
- `icon`

특징은 다음과 같다.

- 제목과 카피가 역할별 블록으로 구조화됨
- SVG 아이콘은 `src/data/cardIcons.js` 함수 참조로 연결됨
- 카드 렌더러는 이 데이터를 그대로 UI로 바꿈

즉 지금 구조에서 "콘텐츠 변경"은 거의 `cards.js`만 건드리면 된다.
아이콘 표현 수정은 `cardIcons.js`에서 따로 다룰 수 있다.

## 7. JavaScript 모듈 구조

### `src/main.js`
얇은 엔트리다.
직접 계산을 거의 하지 않고 초기화 순서를 조정하는 역할만 한다.

### `src/modules/renderCards.js`
카드 데이터 배열을 받아 HTML 문자열로 변환한 뒤 `#cards-grid`에 삽입한다.
여기서 외부 링크 보안 속성도 함께 보장한다.

- `target="_blank"`
- `rel="noopener noreferrer"`
- `data-card`
- `aria-label`

즉 링크 보안 기본기가 렌더 단계에 흡수돼 있다.

### `src/modules/cardEffects.js`
카드 틸트, 스포트라이트, CTA 자기장 효과를 담당한다.
핵심 구조는 이전과 같은 물리 보간 방식이지만, 이제 렌더 모듈과 분리돼 책임이 명확하다.

주요 포인트:
- `.premium-card` 수집
- `Map` 기반 rect 캐싱
- `mousemove`에서 목표값 계산
- `requestAnimationFrame` 루프에서 보간
- CSS 변수와 transform 주입

이 모듈은 시각적으로 가장 눈에 띄는 "고급스러운 반응성"을 만든다.

### `src/modules/theme.js`
이전에는 inline `onclick` 한 줄이 전부였다.
현재는 다음 책임을 갖는 별도 모듈이다.

- 저장된 테마 읽기
- OS 선호 테마 감지
- 초기 테마 적용
- 클릭 이벤트 바인딩
- `localStorage`에 테마 저장

즉 다크 모드는 이제 영속 상태를 가진다.

### `src/modules/stardust.js`
스타더스트 파티클 생성과 observer 연결을 담당한다.

- 50개 파티클 생성
- `DocumentFragment`로 일괄 삽입
- `IntersectionObserver` 연결

여전히 fixed 전체 화면 레이어라 observer의 절대 효과는 제한적일 수 있지만, 구조 자체는 분리로 인해 읽기 쉬워졌다.

## 8. 스타일 계층 분석

예전에는 `src/style.css` 한 파일에 모든 스타일이 들어 있었다.
현재는 엔트리 + 역할별 분리 구조다.

### `src/style.css`
실제 규칙보다 스타일 조립 역할을 한다.

### `src/styles/base.css`
- body 기본 선택 스타일
- 서체 feature 설정
- 데스크톱 전용 스크롤바

### `src/styles/components.css`
- `.premium-card`
- `.premium-card-content`
- 포커스 링
- 카드 외곽선 오버레이

### `src/styles/effects.css`
- 카드 spotlight
- 배경 glow
- grain overlay

### `src/styles/animations.css`
- `fadeUpPremium`
- `auraFloat`
- `drift`
- `delay-100`
- `delay-300`
- `delay-500`
- `delay-700`

이 분리 덕분에 "어떤 스타일이 무엇을 위한 것인지"가 훨씬 명확해졌다.

## 9. 테마와 접근성 상태

구조 정리 전후를 비교하면 제품 마감이 좋아진 부분이 있다.

반영된 개선:
- 테마 토글 버튼에 `aria-label` 추가
- 키보드 포커스 링 추가
- 외부 링크 `noopener noreferrer` 보강
- 다크 모드 영속 저장
- inline 이벤트 제거

여전히 남은 부분:
- 카드 자체의 더 풍부한 접근성 설명
- 시맨틱 heading/landmark 세부 개선
- prefers-reduced-motion 대응

## 10. 제거된 구조

이전에는 문서 끝에 포털 오버레이가 있었다.

- `portal-overlay`
- `portal-frame`
- `closePortal()`

하지만 실제 여는 흐름이 전혀 없었고, 모듈 스코프 때문에 닫기 함수도 안전하지 않았다.
현재는 이 미완성 기능을 통째로 제거해 구조 혼선을 줄였다.

이 판단은 맞다.
지금 프로젝트에서 포털은 제품 기능이 아니라 미사용 흔적에 더 가까웠다.

## 11. 현재 남아 있는 리스크

### 1. 스모크 체크는 DOM 렌더 전체를 실행하는 브라우저 테스트가 아니다
`scripts/smoke-check.mjs`는 파일 기반 계약 검증에 가깝다.
Playwright 같은 진짜 브라우저 E2E는 아직 없다.

### 2. `cards.js`가 커지면 데이터 파일이 비대해질 수 있다
지금은 4개라 괜찮지만, 수십 개가 되면 카테고리 분리나 파일 분할이 필요하다.

### 3. 스타더스트 observer의 실효성은 제한적이다
fixed 풀스크린 컨테이너 구조상 observer 최적화 효과는 크지 않을 수 있다.

### 4. `npm audit` 경고는 별도 점검 필요
정적 사이트라 위험도는 상대적으로 낮을 수 있지만, 빌드 체인 기준으로는 확인해두는 편이 좋다.

## 12. 현재 구조의 장점

- 반복 카드 마크업 제거
- 데이터와 표현 분리
- 기능별 모듈 분리
- 스타일 역할 분리
- 접근성/보안 기본기 보강
- 최소 회귀 검증 경로 확보

즉 지금 구조는 처음보다 훨씬 "수정 가능한 코드"에 가까워졌다.

## 13. 검증 상태
현재 확인된 검증 경로는 다음과 같다.

- `npm run build` 통과
- `npm run check:smoke` 통과

스모크 체크가 확인하는 항목:
- 카드 개수
- 링크 중복 여부
- slug 중복 여부
- `https` 사용 여부
- 필수 카드 필드 존재
- 중앙 아이콘 모듈 사용 여부
- `theme-toggle`, `cards-grid` 존재
- 포털 제거 여부
- inline 이벤트 제거 여부
- 스타일 import 연결 여부
- `delay-700` 및 delay 클래스 연결 여부

## 14. 최종 평가
현재의 Simsang Archive는 작은 코드베이스 안에서 시각적 인상과 유지보수성을 균형 있게 맞춰가는 단계에 있다.

초기 버전이 "한 파일에 응집된 고급 랜딩"이었다면, 지금은 "정적이지만 모듈화된 프리미엄 포털"에 더 가깝다.
디자인의 힘은 유지하면서도, 구조는 훨씬 덜 불안해졌다.

핵심 요약:

- UI는 그대로 고급스럽다
- 구조는 더 읽기 쉬워졌다
- 포털 같은 죽은 기능은 제거됐다
- 테마, 포커스, 링크 보안 같은 기본기는 강화됐다
- 최소 검증 체계가 생겨 이후 리팩터링 안정성이 올라갔다

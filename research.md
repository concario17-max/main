# research.md

## 1. 프로젝트 개요
Simsang Archive는 4개의 외부 아카이브를 하나의 프리미엄 포털 랜딩으로 묶는 정적 웹 프로젝트다. 핵심 목적은 앱 기능 자체보다 분위기, 큐레이션 감각, 카드 인터랙션을 통해 "고급 아카이브 입구" 경험을 만드는 데 있다.

현재 구조는 다음 네 층으로 정리돼 있다.
- 문서 쉘: [index.html](/C:/Users/roadsea/Desktop/main/index.html)
- 데이터 계층: [src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js), [src/data/cardIcons.js](/C:/Users/roadsea/Desktop/main/src/data/cardIcons.js)
- 동작 계층: [src/main.js](/C:/Users/roadsea/Desktop/main/src/main.js), [src/modules](/C:/Users/roadsea/Desktop/main/src/modules)
- 스타일 계층: [src/style.css](/C:/Users/roadsea/Desktop/main/src/style.css), [src/styles](/C:/Users/roadsea/Desktop/main/src/styles)

## 2. 실행 방식
이 프로젝트는 프레임워크 없는 Vite 기반 정적 사이트다.

주요 스크립트:
- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 확인
- `npm run check:smoke`: 구조 회귀 점검

초기화 순서는 [src/main.js](/C:/Users/roadsea/Desktop/main/src/main.js) 기준으로 다음과 같다.
1. 카드 렌더
2. 테마 토글 초기화
3. 카드 인터랙션 초기화
4. 파티클 초기화

이 순서는 중요하다. 렌더가 먼저 끝나야 `.premium-card` DOM을 찾는 인터랙션 코드가 정상 동작한다.

## 3. HTML 구조
[index.html](/C:/Users/roadsea/Desktop/main/index.html)은 크게 세 부분으로 나뉜다.

### Head
- favicon, manifest, mobile web app meta
- 일반 description
- OG/Twitter 메타
- Google Fonts
- 스타일 엔트리 로드

이번 안정화 라운드에서 깨져 있던 메타 문자열을 모두 정상 문구로 교체했다. 이 변경은 공유 미리보기와 검색 노출 품질에 직접 영향을 준다.

### Background Layer
- `bg-glow`
- 3개의 aura div
- 점 패턴 오버레이
- `#particles-container`

이 레이어는 전부 장식용이며 `pointer-events-none`로 사용자 입력을 막지 않는다.

### Content Layer
- `#theme-toggle`
- 헤더
- `#cards-grid`

카드 자체는 정적 HTML에 직접 적혀 있지 않고 JS 렌더러가 주입한다.

## 4. 카드 데이터 구조
[src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js)는 카드 콘텐츠의 단일 소스다.

각 카드 객체는 다음 필드를 가진다.
- `slug`
- `href`
- `delayClass`
- `featured`
- `tone`
- `icon`
- `heading.main`
- `heading.accent`
- `copy.label`
- `copy.description`
- `copy.cta`

현재 특징:
- 첫 카드만 `featured: true`
- tone은 `celestial`, `sutra`, `divine`, `liberation`
- CTA 문구가 카드마다 다름

이 구조 덕분에 카드 텍스트 수정, 링크 변경, 순서 조정이 HTML 수정 없이 가능하다.

## 5. 카드 렌더링 방식
[src/modules/renderCards.js](/C:/Users/roadsea/Desktop/main/src/modules/renderCards.js)는 데이터 객체를 카드 마크업 문자열로 변환한다.

핵심 역할:
- featured 카드와 일반 카드의 마크업 차등 처리
- tone 기반 class 매핑
- `data-card`와 `aria-label` 부여
- 외부 링크 보안 속성 강제

최근 안정화 포인트:
- 카드 메타 라벨에 `premium-card__meta--*` 클래스를 직접 부여하도록 수정
- 이전에 있던 `nth-child` 기반 색상 매핑 제거

이 변화로 배지나 추가 요소가 들어가도 스타일이 DOM 순서에 따라 깨지지 않는다.

## 6. 인터랙션 구조

### 카드 인터랙션
[src/modules/cardEffects.js](/C:/Users/roadsea/Desktop/main/src/modules/cardEffects.js)는 다음 효과를 담당한다.
- spotlight 좌표 추적
- 카드 tilt
- CTA magnetic 이동
- `requestAnimationFrame` 기반 보간

구현 방식:
- 카드 rect를 `Map`으로 캐싱
- `mousemove` 때 목표값 계산
- animation loop에서 현재값을 lerp로 보간
- CSS 변수와 `transform`에 반영

추가된 안정화:
- `prefers-reduced-motion: reduce`일 때 인터랙션 초기화를 사실상 비활성화

### 파티클
[src/modules/stardust.js](/C:/Users/roadsea/Desktop/main/src/modules/stardust.js)는 장식용 파티클을 생성한다.

특징:
- 50개 파티클 생성
- `DocumentFragment` 사용
- `IntersectionObserver`로 표시 여부 제어

추가된 안정화:
- `prefers-reduced-motion: reduce`일 때 파티클을 표시하지 않음

### 테마
[src/modules/theme.js](/C:/Users/roadsea/Desktop/main/src/modules/theme.js)는 다크 모드를 담당한다.

기능:
- 초기 테마 판별
- 토글 버튼 이벤트 바인딩
- `localStorage` 저장

## 7. 스타일 계층
[src/style.css](/C:/Users/roadsea/Desktop/main/src/style.css)는 엔트리 파일이며, 실제 스타일은 역할별로 분리돼 있다.

### [src/styles/base.css](/C:/Users/roadsea/Desktop/main/src/styles/base.css)
- body 기본 스타일
- 선택 영역 스타일
- 데스크톱 스크롤바

### [src/styles/components.css](/C:/Users/roadsea/Desktop/main/src/styles/components.css)
- 카드 베이스 스타일
- featured 카드 강조
- tone별 icon/meta/rule/cta 스타일
- focus-visible

### [src/styles/effects.css](/C:/Users/roadsea/Desktop/main/src/styles/effects.css)
- spotlight
- glow
- grain
- 모바일용 효과 강도 완화
- reduced-motion 시 시각 효과 약화

### [src/styles/animations.css](/C:/Users/roadsea/Desktop/main/src/styles/animations.css)
- `fadeUpPremium`
- `auraFloat`
- `drift`
- `delay-100/300/500/700`
- reduced-motion 애니메이션 무력화

## 8. UI 변화 요약
이번 라운드까지 반영된 주요 UI 변화:
- 첫 카드를 featured 카드로 승격
- featured 카드 전용 배지와 CTA 추가
- 일반 카드 3장의 tone/CTA 차별화
- 헤더 보조 문장을 이해 가능한 설명형 문구로 정리
- 모바일에서 헤더, 카드, 배경 효과 밀도 완화
- reduced-motion 대응 추가

결과적으로 현재 UI는 초기보다 정보 위계가 분명하고, 모바일 부담이 적으며, 유지보수도 더 안전하다.

## 9. 검증 체계
[scripts/smoke-check.mjs](/C:/Users/roadsea/Desktop/main/scripts/smoke-check.mjs)는 파일 기반 스모크 체크다.

현재 검증 항목:
- 카드 개수
- slug 중복 여부
- 링크 중복 여부
- HTTPS 사용 여부
- 카드 필수 필드 존재 여부
- shared icon 사용 여부
- featured 카드 1개 보장
- tone 값 유효성
- 테마 토글 / 카드 그리드 존재
- 헤더 보조 카피 존재
- 정상화된 메타 description 존재
- 포털 제거 여부
- inline 이벤트 제거 여부
- style import 연결
- `delay-700` 존재
- reduced-motion 대응 존재
- `nth-child` 의존 제거 여부

이건 브라우저 자동화 테스트는 아니지만, 구조 리팩터링 회귀를 빨리 잡는 데는 충분히 실용적이다.

## 10. 남아 있는 리스크
- `.compare/` 폴더가 미추적으로 남아 있다. 프로젝트 산출물인지 임시 비교 자산인지 확인 후 정리 필요.
- smoke check는 파일/문자열 기반이므로 실제 브라우저 상호작용 회귀를 완전히 대체하진 못한다.
- `IntersectionObserver`가 fixed full-screen container에 대해 큰 이점을 주는 구조는 아니다. 동작엔 문제 없지만 최적화 여지는 있다.
- 카드 카피가 모두 영어로 정리돼 있어, 실제 타깃 사용자 언어 전략과 맞는지는 제품 판단이 필요하다.

## 11. 결론
현재 Simsang Archive는 "감성 위주의 단일 HTML 랜딩"에서 "데이터/렌더/인터랙션/스타일 계층이 분리된 정적 포털"로 정리된 상태다.

특히 이번 안정화 이후 기준으로 보면:
- 메타와 공유 문구가 정상화됐고
- 카드 스타일 결합도가 낮아졌고
- 모바일 밀도가 개선됐고
- 모션 접근성 대응이 들어갔고
- 스모크 체크가 더 믿을 만해졌다

즉 지금 코드는 작은 정적 사이트 치고는 꽤 안정적으로 관리 가능한 상태다.

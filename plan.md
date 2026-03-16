# plan.md

## 목적
Simsang Archive 랜딩 페이지를 분위기 중심의 프리미엄 UI로 유지하면서도, 구조적으로 읽기 쉽고 수정하기 쉬운 정적 포털로 정리한다.

## 완료된 작업

### 모바일 스크롤/레이아웃
- [x] `body`를 모바일에서 `min-h-screen` + 세로 스크롤 가능 구조로 조정
- [x] `main`을 모바일에서 `overflow-visible`로 변경해 카드 영역이 자연스럽게 확장되도록 수정
- [x] 모바일 기준 여백과 카드 그리드 간격을 재조정
- [x] 모바일 전용 광원/그레인/그림자 강도 완화

### 구조 리팩터링
- [x] 카드 콘텐츠를 [src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js)로 분리
- [x] SVG 아이콘을 [src/data/cardIcons.js](/C:/Users/roadsea/Desktop/main/src/data/cardIcons.js)로 분리
- [x] 카드 렌더링을 [src/modules/renderCards.js](/C:/Users/roadsea/Desktop/main/src/modules/renderCards.js)로 분리
- [x] 카드 인터랙션을 [src/modules/cardEffects.js](/C:/Users/roadsea/Desktop/main/src/modules/cardEffects.js)로 분리
- [x] 파티클을 [src/modules/stardust.js](/C:/Users/roadsea/Desktop/main/src/modules/stardust.js)로 분리
- [x] 테마 토글을 [src/modules/theme.js](/C:/Users/roadsea/Desktop/main/src/modules/theme.js)로 분리
- [x] 스타일을 `base/components/effects/animations` 계층으로 분리
- [x] 미사용 포털 오버레이 제거
- [x] inline 이벤트 제거

### UI/카피 개선
- [x] 대표 카드 1장을 featured 구조로 승격
- [x] 카드별 tone/CTA 차별화
- [x] 헤더 보조 문장을 이해형 카피로 정리
- [x] 카드 설명과 라벨 문구를 구조화된 영어 카피로 재작성
- [x] 메타/OG/Twitter 문구 정상화

### 접근성/상태
- [x] 테마 토글 `aria-label` 추가
- [x] 외부 링크 `rel="noopener noreferrer"` 적용
- [x] 테마 상태 `localStorage` 저장
- [x] `prefers-reduced-motion` 대응 추가
- [x] 포커스 스타일 보강

### 검증
- [x] `npm run build` 기준 빌드 확인
- [x] [scripts/smoke-check.mjs](/C:/Users/roadsea/Desktop/main/scripts/smoke-check.mjs) 추가
- [x] 카드 개수, slug, 링크, 메타 문구, featured 카드, reduced-motion 대응, 스타일 import, `delay-*` 매핑 검증
- [x] 카드 스타일의 `nth-child` 의존 제거 여부 검증

## 현재 QA 체크리스트
1. `npm run build`
2. `npm run check:smoke`
3. 데스크톱에서 카드 hover tilt, spotlight, CTA 모션 확인
4. 모바일에서 헤더 밀도와 카드 간격 확인
5. 다크 모드 토글 및 저장 상태 확인
6. 공유 메타(title, description, OG/Twitter) 문구 확인

## 현재 상태 요약
- 랜딩 페이지는 단일 [index.html](/C:/Users/roadsea/Desktop/main/index.html) + Vite 기반 정적 앱 구조다.
- 카드 데이터와 아이콘은 데이터 계층으로 분리돼 있다.
- 렌더링과 인터랙션 로직은 모듈화되어 있다.
- 스타일은 역할별 파일로 분리돼 있다.
- featured 카드, 모바일 밀도 조정, reduced-motion 대응, 스모크 체크 강화까지 반영됐다.

## 다음 후보 작업
1. 문서 변경분 커밋 정리
2. `.compare/` 폴더 필요 여부 확인 후 정리
3. 배포 전 최종 점검 라운드

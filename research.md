# Simsang Archive - Technical Analysis Report

## 1. Executive Summary
본 저장소는 Simsang Archive 패밀리 사이트를 위한 Vite 기반의 프리미엄 정적 포털 사이트임
단일 HTML 문서(`index.html`)와 모듈러 JavaScript 파일들로 구성되어 있으며, 클라이언트 사이드 비밀번호 잠금 해제를 거쳐 7개의 서고(Archive) 카드로 진입하는 런타임 책임을 지님
구조 검증을 위한 스모크 테스트와 Playwright 브라우저 테스트 슈트가 갖춰져 있어 최소한의 무결성은 보장되나, 세부 구현에서 심각한 사양 불일치, 비효율적인 애니메이션 루프에 따른 자원 낭비, 그리고 보안 약점이 관찰됨

---

## 2. Execution Lifecycle (실행 라이프사이클)
웹 애플리케이션의 시동 및 렌더링 흐름은 다음과 같은 단일 진입 루프를 따름

1. **HTML 로드 및 파싱**: `index.html`이 브라우저에 로드되어 DOM 트리를 구성함
2. **DOMContentLoaded 이벤트 트리거**: `src/main.js` 내부의 이벤트 리스너가 구동됨
3. **카드 렌더링 (`renderCards`)**: `src/data/cards.js`의 원본 데이터를 순회하며 동적 HTML 템플릿을 생성, `#cards-grid` 노드에 주입함
4. **진입 게이트 초기화 (`initEntryGate`)**: 로컬 스토리지 또는 쿠키를 검사하여 잠금 해제 여부를 판별하고, 잠겨 있을 경우 비밀번호 입력 화면(`entry-gate`)을 노출하고 앱 셸을 비활성화(`inert`)함
5. **카드 3D 이펙트 활성화 (`initCardEffects`)**: 카드 3D 틸트, 마그네틱 CTA 효과, 마우스 트래킹 스포트라이트를 위해 `requestAnimationFrame` 애니메이션 루프를 구동함
6. **파티클 시스템 시작 (`initStardust`)**: 화면 배경에 50개의 입자를 무작위 생성하고 CSS 애니메이션을 이용한 부유 효과(`drift`)를 부여함

---

## 3. Deep-Dive Analysis & Identified Issues (상세 진단 및 결함)

### 3.1. 테마 스펙 불일치 및 기능 누락 (Theme System Drift)
- **증상**: `index.html` 내에 테마 토글 버튼 마크업(`#theme-toggle`)이 물리적으로 존재하지 않으며, `src/modules/theme.js` 또한 빈 함수(`export const initThemeToggle = () => {}`)로 남겨져 실질적인 테마 토글 기능이 작동하지 않음
- **모순점**: 과거 문서(`STATE.md`, `research.md`)에는 테마 토글 기능이 정상 작동하며 메인 부트 시퀀스에서 초기화되는 것처럼 서술되어 있으나, 실제 테스트 코드(`smoke-check.mjs` 및 `browser-smoke.mjs`)에서는 `#theme-toggle`이 존재하지 않는 것을 정상 패스 조건(`!indexHtml.includes('id="theme-toggle"')`)으로 검증함
- **진단**: 사양 변경(테마 토글 비활성화 및 라이트 단일 모드 고정)이 코드와 테스트에만 반영되고 기획 문서에는 업데이트되지 않은 채 방치되어 정보 동기화가 깨져 있음

### 3.2. 유휴 상태 애니메이션 루프의 자원 낭비 (Non-Idle Frame Overhead)
- **증상**: `src/modules/cardEffects.js`에서 카드 틸팅 및 마그네틱 모션을 구현하기 위해 `requestAnimationFrame`을 활용한 영구 루프를 구동함
- **문제점**:
  1. 마우스가 카드 영역 밖으로 나가 모션 연산 값들이 모두 `0`으로 수렴(원래 위치 복귀)한 유휴(Idle) 상태에서도 루프가 멈추지 않고 계속 구동되며 DOM의 `transform` 속성 및 CSS 변수(`--mouse-x`, `--mouse-y`)를 강제 갱신함
  2. 진입 게이트가 잠겨 있어 서고 카드가 전혀 보이지 않는 상황(`entry-locked`)에서도 백그라운드에서 프레임 렌더링 루프가 돎
  3. 화면 스크롤 등으로 카드가 뷰포트 밖으로 벗어난 상황에서도 지속적인 연산이 수행됨
- **진단**: CPU/GPU 점유율을 쓸데없이 높이고 배터리 효율을 떨어뜨리는 대표적인 프레임 병목 지점임

### 3.3. 배경 파티클의 선제 실행에 따른 낭비 (Stardust Eager Loading)
- **증상**: `src/modules/stardust.js`가 페이지 진입과 동시에 50개의 파티클 DOM 요소를 생성하고 애니메이션을 트리거함
- **문제점**: 패스코드 게이트가 해제되기 전까지 사용자는 비밀번호 입력 패널 뒤의 화면을 인지할 수 없음에도, 보이지 않는 백그라운드 입자들을 렌더링하고 계산하기 위해 그래픽 가속을 사용함
- **진단**: 렌더링 지연 초기화(Lazy Initialization) 기법이 결여되어 초기로딩 성능 및 메모리 점유 면에서 비효율적임

### 3.4. 데스크톱 레이아웃 열 개수 불일치 (Grid Discrepancy)
- **증상**: `src/styles/components.css`에서 데스크톱 그리드 열 수가 4열(`repeat(4, minmax(0, 1fr))`)로 코딩되어 있음
- **문제점**:
  1. 기존 `research.md` 명세에는 화면을 5열 배치로 변경하여 단일 스크롤 영역에 카드를 집약했다고 명시되어 있어 코드가 스펙을 위반하고 있음
  2. 현재 보관소 카드는 총 7개인데 4열 그리드 레이아웃을 사용하면 첫 줄에 4개, 둘째 줄에 3개가 남는 불완전한 비대칭 레이아웃이 연출되어 프리미엄 비주얼 감각을 저해함
- **진단**: 미적 레이아웃 조율 실패로 인해 그리드 밸런스가 깨져 있음

### 3.5. 암호화 결여 및 쿠키 보안 취약점 (Security Weakness)
- **증상**:
  1. 잠금 해제용 패스코드 `0228`이 클라이언트 사이드 코드(`entryGate.js`)에 완전히 노출되어 있어 소스 검사만으로 우회가 가능함
  2. `storage.js`에서 작성하는 쿠키 스토리지 옵션에 `Secure` 속성이 누락되어 HTTPS 전용 환경 보안이 완벽히 적용되지 않음
- **진단**: 정적 호스팅 포털로서의 편의성을 고려한 최소한의 가이드 장치이지만, 상용 배포 수준의 보안 복원력을 확보하지 못함

---

## 4. Perfectionist Optimization Roadmap (최적화 개선 방안)

### 4.1. 애니메이션 활성 제어 알고리즘 (Sleep Mode Algorithm) 도입
- 불필요한 루프 구동을 막기 위해 틸팅 연산이 최종 위치(0)로 수렴하면 RAF 요청을 명시적으로 중단하고, 마우스가 카드로 다시 진입(`mouseenter`)할 때 루프를 동적으로 재가동하는 상태 머신 기반 최적화 구현
- **예시 코드 구현 아이디어**:
  ```javascript
  // 루프를 구동하는 상태 관리 예시 (한국어 주석 처리)
  let isAnimating = false;

  const startLoop = () => {
      if (isAnimating) return;
      isAnimating = true;
      requestAnimationFrame(tick);
  };

  const tick = () => {
      let needsNextFrame = false;
      cards.forEach((card) => {
          // 각 카드별 연산 적용
          // 수렴 한계 범위 내에 도달하지 않았으면 needsNextFrame = true로 설정
      });

      if (needsNextFrame) {
          requestAnimationFrame(tick);
      } else {
          isAnimating = false; // 수렴 완료 시 루프 정지 (휴면 전환)
      }
  };
  ```

### 4.2. 배경 파티클의 지연 초기화 및 게이트웨이 연동
- 페이지 부트 시점에 즉시 파티클을 생성하지 않고, 패스코드가 정상 입력되어 게이트가 해제되는 `unlock()` 함수 시점에 `initStardust()`를 호출하여 입자를 생성하고 애니메이션을 개시하도록 개선함

### 4.3. 데스크톱 5열 레이아웃 복구 및 카드 밸런스 조정
- `components.css`에서 데스크톱(1280px 이상) 그리드 열을 5열로 조정함
- 대표 카드(`featured: true`)가 가로 2열(`grid-column: span 2`)을 차지하도록 스타일을 수정하여, 총 점유 너비를 `2 (Featured) + 5 (나머지 5개 카드) = 7` 그리드 칸으로 정확히 맞아떨어지게 설계하여 완벽한 격자 정렬 레이아웃을 달성함

### 4.4. 명세와 코드의 정비
- 테마 시스템이 정말로 제거된 것이 맞다면 기획 문서(`research.md`, `STATE.md`)에서 메인 부트 시퀀스(`initThemeToggle`)와 관리 엘리먼트(`theme-toggle`) 관련 설명을 제거하고 단일 모드 전용으로 문서의 정합성을 일치시킴

---

## 5. Verification Review (빌드 및 검증 확인)
- Windows 환경에서 PowerShell 실행 정책에 가로막히는 문제를 극복하기 위해 `cmd /c` 또는 ExecutionPolicy 우회 명령어로 스크립트를 wrapping해야 함
- 로컬 검증 결과 `cmd /c npm run build` 및 정적 스모크 테스트인 `cmd /c npm run check:smoke`가 모두 정상 패스되는 무결성 상태를 유지하고 있음을 확인함

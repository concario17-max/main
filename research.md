# Simsang Archive - 심층 분석 보고서

## 1. 아키텍처 개요
**Simsang Archive (The Premium Collection)**
고대 지혜와 오컬트 데이터(천체 관측소, 수트라, 바가바드 기타, 티베트 사자의 서)를 연결하는 프론트엔드 포털.
Awwwards급 하이엔드 'Meta-Design'과 극단적인 렌더링 최적화를 목표로 설계된 정적 웹 애플리케이션.

- **스택**: HTML5, Vanilla JavaScript(ES6+), Tailwind CSS(v3.4), PostCSS, Vite.
- **철학**: "Ray Standard" 적용. 무거운 프레임워크(React, Vue) 배제. 오로지 DOM 제어와 물리 기반 렌더링에 집중한 퓨어 바닐라 구현. 불필요한 추상화 제로.

---

## 2. 코어 엔진 분석 (src/main.js)
바닐라 JS로 작성된 커스텀 물리 기반 인터랙션 엔진. 
퍼포먼스 병목을 일으키는 Reflow와 Repaint를 철저히 차단한 구조.

### [1] O(1) 룩업 캐싱 & Zero-Reflow
- 초기화 및 창 크기 조절 시에만 `getBoundingClientRect()` 호출.
- `.premium-card` 요소들의 좌표와 크기를 `Map` 객체(`state.cardRects`)에 캐싱.
- 마우스 무브먼트 이벤트 루프 내에서 DOM 요소의 크기나 위치를 다시 묻는 짓(Forced Synchronous Layout 발생 원인) 원천 차단.

### [2] 수치 해석 기반 물리 엔진 (Lerp)
- 마우스 포인터 좌표 추적에 CSS `transition` 의존 안 함.
- 매 프레임 좌표의 목표점(`target`)과 현재점(`current`)을 분리하여 상태 관리.
- `lerp(선형 보간)` 함수를 `requestAnimationFrame` 단일 루프 안에서 돌려 유체(Viscous) 같은 관성과 묵직한 조작감 구현.
- Immutability Doctrine 준수. 상태 변경 시 기존 객체 변형(Mutation) 대신 Spread 연산자로 불변성 유지.

### [3] Stardust Particle (IntersectionObserver 최적화)
- DOM에 50개의 파티클 노드를 `DocumentFragment`로 일괄 삽입. (Atomic DOM 조작)
- 파티클 컨테이너에 `IntersectionObserver` 부착.
- 스크롤해서 보이지 않는 영역으로 넘어가면 `display: none` 처리. 즉, CSS 애니메이션 연산 자체를 브라우저 GPU 렌더 파이프라인에서 완전히 도려내는 극강의 배터리/CPU 최적화.

---

## 3. 메타 디자인 렌더링 (src/style.css & tailwind.config.js)
Tailwind의 유틸리티 클래스만으로 뽑기 힘든 심도(Depth)와 질감을 커스텀 CSS로 우겨넣은 변태적인 디테일.

### [1] 테마 & 타이포그래피 설정
- **Colors**: `accent-light` (Champagne Gold), `background-light` (Soft Beige), `primary` (Ink Black). 
- **Typography**: Google Fonts의 `Cinzel`(Display)과 `Inter`(Body) 조합.
- **Shadows**: 단순 드롭 섀도우가 아님. `premium`, `premium-hover` 같은 다중 레이어 `boxShadow`를 정의하여 평면을 물리적인 3D 객체로 승격시킴.

### [2] 광원과 재질 구현 (Material & Lighting)
- **3D Transform**: `.premium-card`에 `transform-style: preserve-3d`와 `perspective: 2000px`를 걸어 JS 물리 엔진에서 쏘아주는 `rotateX`, `rotateY` 값을 현실적인 원근감으로 표현.
- **Reactive Lighting (Spotlight)**: 마우스가 위치한 곳을 중심으로 JS가 `--mouse-x`, `--mouse-y` CSS 변수를 주입. `::before` 가상 요소의 `radial-gradient`가 이 변수를 추적하며 카드의 하이라이트(광택) 반향을 만듦.
- **Grain Overlay**: 무거운 PNG 이미지 통신 없이 `feTurbulence` 기반의 Data URI SVG 필터를 깔아 미세한 필름 노이즈/종이 질감(Texture) 생성. 로딩 속도 지연 제로.

---

## 4. 구조 요약 및 결론
- **구조적 완벽성**: 800줄 이하 모듈 분리 원칙 위반 없음.
- **성능 최적화**: 1ms의 프레임 드랍도 용납하지 않는 연산 구조.
- **결론**: 프론트엔드 최적화의 극한. 화려한 이펙트를 떡칠했음에도 브라우저 메인 스레드 점유율을 바닥으로 묶어둔 예술적인 코드. 튜닝 끝.

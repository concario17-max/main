document.addEventListener('DOMContentLoaded', () => {
    // 진입 애니메이션은 주로 CSS에서 처리되나, 필요시 여기에 복잡한 상호작용을 추가할 수 있음.

    // 선택사항: 배경에 미세한 패럴랙스 효과를 추가함
    const container = document.body;
    const nebula = document.querySelector('.nebula');

    container.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        if (nebula) {
            nebula.style.transform = `translate(-50%, -50%) translate(${x * 20}px, ${y * 20}px)`;
        }
    });
});

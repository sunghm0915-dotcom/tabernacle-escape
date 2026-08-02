/* ============================================================
   스토리 카드 → 미션/문제 카드 전환 애니메이션
   - storyEl, btnEl 이 먼저 사라지고(디졸브/솟아오르기/확대축소/와이프 중 하나),
     그 다음 targetEl 이 같은 느낌으로 나타납니다.
   - animName: 'dissolve' | 'riseup' | 'scale' | 'wipe'
   ============================================================ */
function revealTransition(storyEl, btnEl, targetEl, animName) {
  animName = animName || "dissolve";
  storyEl.classList.add("leaving", "leave-" + animName);
  if (btnEl) btnEl.classList.add("leaving");

  setTimeout(function () {
    storyEl.style.display = "none";
    if (btnEl) btnEl.style.display = "none";

    targetEl.classList.add("reveal-target", "enter-" + animName);
    targetEl.style.display = "block";
    void targetEl.offsetWidth; // 강제 리플로우 — 트랜지션이 확실히 걸리도록
    requestAnimationFrame(function () {
      targetEl.classList.add("in");
    });
  }, 460);
}

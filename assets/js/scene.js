/* ============================================================
   공용 씬 컨트롤러
   - "터치하여 시작" 오버레이 처리
   - 영상/오디오 파일이 있으면 재생, 없으면 조용히 건너뜀
     (나중에 영상 파일을 assets/video/ 에 넣고 각 페이지 상단의
      MEDIA.video 값만 채우면 자동으로 영상이 재생됩니다)
   - 타임라인(순서대로 문구/효과 보여주기) 실행
   - 다시보기 버튼
   각 페이지의 <script> 안에서 initScene(...) 한 번만 호출하면 됩니다.
   ============================================================ */

function initScene(config) {
  var overlay = document.querySelector(".start-overlay");
  var replayBtn = document.querySelector(".replay-btn");
  var video = document.querySelector(".media-slot video");
  var audio = document.querySelector("audio.bgm");
  var timelineFn = config.timeline; // function that returns array of steps
  var timers = [];

  function clearTimers() {
    timers.forEach(function (t) { clearTimeout(t); });
    timers = [];
  }

  function resetLayers() {
    // 장면(scene-layer), 다음행동 캡션, 휘장, 두루마리, 실루엣, 좌대, 빛폭발 —
    // 타임라인이 껐다 켰다 하는 요소들을 전부 초기 상태로 되돌립니다.
    document
      .querySelectorAll(
        ".scene-layer, .next-caption, .curtain, .scroll-wrap, .silhouette-wrap, .empty-pedestal, .burst"
      )
      .forEach(function (el) {
        el.classList.remove("on", "open");
      });
    document.querySelectorAll(".flash").forEach(function (el) {
      el.classList.remove("hit");
    });
    var stage = document.querySelector(".stage");
    if (stage) stage.classList.remove("shake");
  }

  function playMedia() {
    if (video && video.getAttribute("src")) {
      video.currentTime = 0;
      video.play().catch(function () {});
    }
    if (audio && audio.getAttribute("src")) {
      audio.currentTime = 0;
      audio.volume = 0.85;
      audio.play().catch(function () {});
    }
  }

  function run() {
    clearTimers();
    resetLayers();
    playMedia();
    var steps = timelineFn();
    steps.forEach(function (step) {
      var id = setTimeout(step.do, step.at);
      timers.push(id);
    });
    if (replayBtn) {
      var totalTime = steps.length ? steps[steps.length - 1].at : 0;
      var showId = setTimeout(function () {
        replayBtn.classList.add("show");
      }, totalTime + 400);
      timers.push(showId);
    }
  }

  function start() {
    if (overlay) overlay.classList.add("hide");
    if (replayBtn) replayBtn.classList.remove("show");
    run();
  }

  if (overlay) {
    overlay.addEventListener("click", start, { once: false });
    overlay.addEventListener(
      "touchend",
      function (e) {
        e.preventDefault();
        start();
      },
      { once: false }
    );
  } else {
    // 오버레이 없는 페이지(힌트 페이지 등)는 바로 시작
    start();
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", function () {
      replayBtn.classList.remove("show");
      run();
    });
  }

  // 힌트 탭 UI가 있는 페이지용 (있으면만 동작)
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      document.querySelector('.tab-panel[data-tab="' + target + '"]').classList.add("active");
    });
  });
}

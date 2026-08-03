/* ============================================================
   배경음악 공용 스위치
   - 페이지 안에 <audio class="bgm"> 가 있으면, 화면 구석에 작은
     🔈 버튼을 만들어서 눌렀을 때만 재생/정지합니다.
   - 모바일 브라우저는 사용자가 화면을 직접 누르기 전에는
     소리 있는 재생을 막기 때문에, 자동재생 대신 이 버튼을 씁니다.
   - src가 아직 없는(파일을 안 올린) 페이지에서는 버튼이 흐리게
     표시되고 눌러도 아무 일도 일어나지 않습니다.
   - "임무 확인하기" 같은 다른 버튼이 없는 페이지(힌트/완료 안내
     페이지 등)를 위해, 화면 아무 곳이나 처음 한 번 누르면 그
     터치를 재생 신호로 같이 사용합니다(딱 한 번만 동작).
   - 미션/힌트 페이지들은 전부 같은 bgm.mp3 하나를 같이 쓰는데,
     페이지를 넘어갈 때마다 처음부터 다시 재생되면 뚝뚝 끊기는
     느낌이 나서, 마지막으로 듣던 위치를 기억해뒀다가 다음 페이지에서
     그 지점부터 이어서 재생합니다(같은 브라우저에서만 적용).
     단, "터치하면 시작합니다" 연출 화면(브리핑/입장/반전/엔딩)은
     장면과 음악이 맞춰서 짜여 있어서 이 기능에서 제외하고, 항상
     처음부터 재생됩니다.
   ============================================================ */

function initBgm() {
  var audio = document.querySelector("audio.bgm");
  if (!audio) return null;

  audio.loop = true;
  audio.volume = 0.55;

  var hasSrc = !!audio.getAttribute("src");
  var isCinematicScene = !!document.querySelector(".start-overlay");

  if (hasSrc && !isCinematicScene) {
    var posKey = "tabernacle-bgm-pos::" + audio.getAttribute("src");
    audio.addEventListener("loadedmetadata", function () {
      try {
        var saved = parseFloat(localStorage.getItem(posKey));
        if (
          !isNaN(saved) &&
          isFinite(audio.duration) &&
          saved > 0 &&
          saved < audio.duration - 0.3
        ) {
          audio.currentTime = saved;
        }
      } catch (e) {}
    });
    audio.addEventListener("timeupdate", function () {
      try {
        localStorage.setItem(posKey, String(audio.currentTime));
      } catch (e) {}
    });
  }

  var btn = document.createElement("button");
  btn.className = "bgm-toggle" + (hasSrc ? "" : " nomusic");
  btn.setAttribute("aria-label", "배경음악 켜기/끄기");
  btn.textContent = "🔈";
  if (!hasSrc) btn.title = "아직 음악 파일이 없습니다";
  document.body.appendChild(btn);

  var playing = false;
  function render() {
    btn.textContent = playing ? "🔊" : "🔈";
    btn.classList.toggle("playing", playing);
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!hasSrc) return;
    if (playing) {
      audio.pause();
      playing = false;
      render();
    } else {
      audio
        .play()
        .then(function () {
          playing = true;
          render();
        })
        .catch(function () {});
    }
  });

  function playFromGesture() {
    // 다른 버튼(예: "문제 보기") 클릭에 얹어서 같이 재생을 시도할 때 사용
    if (!hasSrc || playing) return;
    audio
      .play()
      .then(function () {
        playing = true;
        render();
      })
      .catch(function () {});
  }

  // 페이지 자체에 "터치하면 시작" 같은 버튼이 없는 경우를 위한 안전장치:
  // 이 🔈 버튼이 아닌 화면 어딘가를 처음 누르면 그걸 재생 제스처로 사용.
  document.addEventListener(
    "click",
    function firstTap(e) {
      if (btn.contains(e.target)) return;
      playFromGesture();
      document.removeEventListener("click", firstTap);
    },
    { once: false }
  );

  return {
    audio: audio,
    playFromGesture: playFromGesture,
  };
}

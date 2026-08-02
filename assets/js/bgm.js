/* ============================================================
   배경음악 공용 스위치
   - 페이지 안에 <audio class="bgm"> 가 있으면, 화면 구석에 작은
     🔈 버튼을 만들어서 눌렀을 때만 재생/정지합니다.
   - 모바일 브라우저는 사용자가 화면을 직접 누르기 전에는
     소리 있는 재생을 막기 때문에, 자동재생 대신 이 버튼을 씁니다.
   - src가 아직 없는(파일을 안 올린) 페이지에서는 버튼이 흐리게
     표시되고 눌러도 아무 일도 일어나지 않습니다.
   ============================================================ */

function initBgm() {
  var audio = document.querySelector("audio.bgm");
  if (!audio) return null;

  audio.loop = true;
  audio.volume = 0.55;

  var hasSrc = !!audio.getAttribute("src");

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

  btn.addEventListener("click", function () {
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

  return {
    audio: audio,
    playFromGesture: function () {
      // 다른 버튼(예: "문제 보기") 클릭에 얹어서 같이 재생을 시도할 때 사용
      if (!hasSrc || playing) return;
      audio
        .play()
        .then(function () {
          playing = true;
          render();
        })
        .catch(function () {});
    },
  };
}

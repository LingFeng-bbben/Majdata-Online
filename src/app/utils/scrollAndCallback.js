import { apiroot3 } from "../apiroot";

export const scrollToTop = () => {
  let sTop = document.documentElement.scrollTop || document.body.scrollTop;
  console.log(sTop);
  if (sTop > 10) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, sTop - sTop / 9);
  }
};

export default function makeLevelClickCallback(songid, isPlayer) {
  return (e) => {
    if (!isPlayer) return;
    scrollToTop();
    const maichart = apiroot3 + "/maichart/" + songid;
    const maidata = maichart + "/chart";
    const track = maichart + "/track";
    const bg = maichart + "/image?fullImage=true";
    const mv = maichart + "/video";
    // 使用 currentTarget 而不是 target，确保获取到绑定事件的元素的 id
    // 这样即使点击了子元素（如难度名称或数值），也能正确获取父元素的 id
    window.unitySendMessage(
      "HandleJSMessages",
      "ReceiveMessage",
      `${maidata}\n${track}\n${bg}\n${mv}\n${e.currentTarget.id}`,
    );
  };
}

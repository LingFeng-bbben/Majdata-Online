import { apiroot3 } from "../apiroot";

export const scrollToTop = () => {
    let sTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (sTop > 0.1) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, sTop - sTop / 9);
    }
};

export default function makeLevelClickCallback (songid, isPlayer) {
    return (e) => {
        if (!isPlayer) return;
        scrollToTop();
        const maichart = apiroot3 + "/maichart/" + songid;
        const maidata = maichart + "/chart";
        const track = maichart + "/track";
        const bg = maichart + "/image?fullImage=true";
        const mv = maichart + "/video";
        window.unitySendMessage(
            "HandleJSMessages",
            "ReceiveMessage",
            `${maidata}\n${track}\n${bg}\n${mv}\n${e.target.id}`
        );
    };
};

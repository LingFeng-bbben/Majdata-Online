export default function getComboState(state) {
  if (state == 0) return "";
  if (state == 1) return "FC";
  if (state == 2) return "FC+";
  if (state == 3) return "AP";
  if (state == 4) return "AP+";
}

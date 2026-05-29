/** Reset all scroll containers before hero is revealed */

export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const shell = document.querySelector<HTMLElement>(".site-shell");
  if (shell) shell.scrollTop = 0;
}

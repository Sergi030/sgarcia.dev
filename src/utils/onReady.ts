/** Runs fn on load and after every View Transition swap */
export function onReady(fn: () => void) {
  fn();
  document.addEventListener('astro:after-swap', fn);
}

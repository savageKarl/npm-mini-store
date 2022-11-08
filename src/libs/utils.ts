export function getCurrentPagePath() {
  const pages = getCurrentPages();
  return pages[pages.length - 1]?.route || '';
}
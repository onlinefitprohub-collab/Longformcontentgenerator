export function parseStageFromText(text: string): number | null {
  const match = text.match(/Stage\s+(\d+)\s+complete/i);
  if (match) {
    const num = parseInt(match[1]);
    return isNaN(num) ? null : Math.min(num, 7);
  }
  return null;
}

export function detectVideoTitlesPresent(text: string): boolean {
  return /Video\s+\d+.*?:/i.test(text) && text.includes("TITLE:");
}

export function detectScriptPresent(text: string): boolean {
  return text.includes("TELEPROMPTER SCRIPT") || text.includes("Teleprompter Script");
}

export function detectEditingDirectionsPresent(text: string): boolean {
  return /EDITING DIRECTIONS:/i.test(text);
}

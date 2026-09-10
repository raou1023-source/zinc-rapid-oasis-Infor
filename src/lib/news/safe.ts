const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, ent: string) => {
      if (ent[0] === "#") {
        const hex = ent[1] === "x" || ent[1] === "X";
        const code = hex ? parseInt(ent.slice(2), 16) : Number(ent.slice(1));
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
        if (code < 32 && code !== 9 && code !== 10 && code !== 13) return "";
        if (code === 0x7f) return "";
        if (code >= 0xd800 && code <= 0xdfff) return "";
        try {
          return String.fromCodePoint(code);
        } catch {
          return "";
        }
      }
      return NAMED[ent.toLowerCase()] ?? "";
    })
    .trim();
}

export function stripTags(html: string): string {
  return decodeXml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanSummary(html: string): string {
  let text = html;
  for (let i = 0; i < 2; i++) text = decodeXml(text);
  text = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 18) return "";
  return text.slice(0, 280);
}

export function safeText(value: string, max = 400): string {
  return stripTags(value)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .slice(0, max)
    .trim();
}

export function safeHttpUrl(value: string): string | null {
  const raw = stripTags(value).split(/\s/)[0];
  try {
    const url = new URL(raw);
    if (url.protocol === "http:") url.protocol = "https:";
    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isArticleId(value: string): boolean {
  return /^[a-z0-9]{1,16}$/i.test(value);
}

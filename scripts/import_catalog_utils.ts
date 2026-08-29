export function extractVariants(auditContent: string): string[] | "unresolved" {
  let variants: string[] = [];

  // 1. Explicit numbered variants (e.g. Variant 1: Rose)
  const variantLineRegex = /Variant\s*\d+:\s*(.+)/gi;
  let match;
  let hasNumbered = false;
  while ((match = variantLineRegex.exec(auditContent)) !== null) {
    if (match[1]) {
      variants.push(match[1].trim());
      hasNumbered = true;
    }
  }
  if (hasNumbered) {
    return [...new Set(variants)];
  }

  // 2. Structured list (e.g. variants: \n - White)
  const listRegex = /variants:[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi;
  const listMatch = listRegex.exec(auditContent);
  if (listMatch) {
    const items = listMatch[0].split('\n')
      .map(line => line.replace(/^- /, '').trim())
      .filter(line => line && line.toLowerCase() !== 'variants:');
    
    if (items.length > 0) {
      return [...new Set(items)];
    }
  }

  // 3. Parenthetical list (e.g. Color variants (White, Black))
  const parentheticalRegex = /(?:color|size|design)\s*variants?\s*\(([^)]+)\)/i;
  const parentheticalMatch = parentheticalRegex.exec(auditContent);
  if (parentheticalMatch) {
    variants = parentheticalMatch[1].split(',').map(v => v.trim()).filter(v => v !== 'None' && v !== 'N/A' && v !== '');
    if (variants.length > 0) {
      return [...new Set(variants)];
    }
  }

  // 4. Natural language count (e.g. shows 3 color variants)
  const nlRegex = /\b\d+\s+(?:color|size|design)\s*variants?\b/i;
  if (nlRegex.test(auditContent)) {
    return "unresolved";
  }

  // If "variants" is mentioned but couldn't be parsed clearly
  if (/\bvariants?\b/i.test(auditContent)) {
    // Avoid marking as unresolved if it says "no variants"
    if (!/no\s+variants?/i.test(auditContent) && !/0\s+variants?/i.test(auditContent)) {
       return "unresolved";
    }
  }

  return variants;
}

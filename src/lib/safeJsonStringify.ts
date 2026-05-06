export function safeJsonStringify(value: unknown) {
  const seen = new WeakSet<object>();

  try {
    const json = JSON.stringify(
      value,
      (_key, nestedValue) => {
        if (typeof nestedValue === 'bigint') return `${nestedValue.toString()}n`;
        if (typeof nestedValue === 'function') return '[Function]';
        if (typeof nestedValue === 'symbol') return nestedValue.toString();
        if (typeof nestedValue === 'object' && nestedValue !== null) {
          if (seen.has(nestedValue)) return '[Circular]';
          seen.add(nestedValue);
        }
        return nestedValue;
      },
      2,
    );

    return json ?? String(value);
  } catch {
    return String(value);
  }
}

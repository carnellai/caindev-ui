type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassArray;

function appendClassName(value: ClassValue, buffer: string[]) {
  if (!value) {
    return;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    buffer.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendClassName(item, buffer);
    }
    return;
  }

  if (typeof value === 'object') {
    for (const className in value) {
      if (value[className]) {
        buffer.push(className);
      }
    }
  }
}

export function cn(...classes: ClassValue[]) {
  const buffer: string[] = [];

  for (const value of classes) {
    appendClassName(value, buffer);
  }

  return buffer.join(' ');
}

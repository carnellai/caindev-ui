import type { Appearance, AccentPreset, RadiusPreset } from './Theme'

export type ThemeScriptProps = {
  appearance?: Appearance
  accent?: AccentPreset
  radius?: RadiusPreset
  storageKey?: string
  nonce?: string
}

export function generateThemeScript(options?: {
  appearance?: Appearance
  accent?: AccentPreset
  radius?: RadiusPreset
  storageKey?: string
}): string {
  const appearance = options?.appearance ?? 'dark'
  const accent = options?.accent ?? 'violet'
  const radius = options?.radius ?? 'md'
  const storageKey = options?.storageKey ?? 'caindev-ui-theme'

  // Resolve the fallback appearance when 'system' cannot be determined.
  // Must always resolve to 'dark' or 'light', never 'system'.
  const hardFallback = appearance === 'system' ? 'dark' : appearance

  return (
    '(function(){' +
    'try{' +
    'var k=' + JSON.stringify(storageKey) + ';' +
    'var dA=' + JSON.stringify(appearance) + ';' +
    'var dC=' + JSON.stringify(accent) + ';' +
    'var dR=' + JSON.stringify(radius) + ';' +
    'var hF=' + JSON.stringify(hardFallback) + ';' +
    'var s=null;' +
    'try{var r=localStorage.getItem(k);if(r)s=JSON.parse(r);}catch(e){}' +
    'var a=(s&&(s.appearance==="dark"||s.appearance==="light"||s.appearance==="system"))?s.appearance:dA;' +
    'var c=(s&&["violet","blue","emerald","crimson","teal","orange"].indexOf(s.accent)!==-1)?s.accent:dC;' +
    'var rd=(s&&["sm","md","lg"].indexOf(s.radius)!==-1)?s.radius:dR;' +
    'if(a==="system"){' +
    'try{a=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}' +
    'catch(e){a=hF;}' +
    '}' +
    'var d=document.documentElement;' +
    'd.setAttribute("data-appearance",a);' +
    'd.setAttribute("data-accent",c);' +
    'd.setAttribute("data-radius",rd);' +
    '}catch(e){}' +
    '})()'
  )
}

export function ThemeScript({
  appearance,
  accent,
  radius,
  storageKey,
  nonce,
}: ThemeScriptProps) {
  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: generateThemeScript({ appearance, accent, radius, storageKey }),
      }}
    />
  )
}

<div align="center">

# @larrykoo711/media-picker

**Drop-in media picker for AIGC apps. Pexels-powered. Zero config.**

[![npm](https://img.shields.io/npm/v/@larrykoo711/media-picker.svg?style=flat-square)](https://www.npmjs.com/package/@larrykoo711/media-picker)
[![bundle](https://img.shields.io/bundlephobia/minzip/@larrykoo711/media-picker?style=flat-square)](https://bundlephobia.com/package/@larrykoo711/media-picker)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

[Docs](https://media-picker.vercel.app) · [Demo](https://media-picker.vercel.app) · [Issues](https://github.com/larrykoo711/media-picker/issues)

</div>

---

![Screenshot](./media-picker-screenshot.png)

## Install

```bash
pnpm add @larrykoo711/media-picker
```

## Usage

```tsx
import { MediaPickerButton } from '@larrykoo711/media-picker';
import '@larrykoo711/media-picker/styles.css';

<MediaPickerButton onSelect={(media) => console.log(media)}>
  Pick Media
</MediaPickerButton>
```

Done.

## API

### `<MediaPickerButton />`

```tsx
<MediaPickerButton
  onSelect={(media) => {}}   // Required
  multiple={false}           // Multi-select
  maxSelection={10}          // Max items
  defaultMediaType="photos"  // 'photos' | 'videos'
>
  Button Text
</MediaPickerButton>
```

### `<MediaPicker />` (Controlled)

```tsx
const [open, setOpen] = useState(false);

<MediaPicker
  open={open}
  onOpenChange={setOpen}
  onSelect={(media) => setOpen(false)}
/>
```

## Production Setup

> ⚠️ **Never expose API keys in client code.**

```tsx
// Use proxy mode in production
import { configurePexelsClient } from '@larrykoo711/media-picker';

configurePexelsClient({
  proxyUrl: '/api/pexels',  // Your backend proxy
});
```

<details>
<summary>Next.js proxy example</summary>

```ts
// app/api/pexels/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `https://api.pexels.com/${path}?${request.nextUrl.searchParams}`;

  const res = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  return NextResponse.json(await res.json());
}
```

</details>

## Theming

```css
:root {
  --mp-primary: #3b82f6;
  --mp-base-100: #ffffff;
  --mp-base-content: #1e293b;
}
```

Dark mode: add `class="dark"` to root.

## License

MIT

</div>

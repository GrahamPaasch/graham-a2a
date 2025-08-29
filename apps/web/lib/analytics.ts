import Plausible from 'plausible-tracker';

let plausible: ReturnType<typeof Plausible> | null = null;
export function track(event: string, props?: Record<string, any>) {
  try {
    if (!plausible) plausible = Plausible({ domain: process.env.PLAUSIBLE_DOMAIN || '' });
    plausible.track(event, { props });
  } catch {}
}

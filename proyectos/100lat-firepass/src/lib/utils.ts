export function readUtmParams(searchParams: URLSearchParams) {
  return {
    source: searchParams.get('utm_source') ?? undefined,
    medium: searchParams.get('utm_medium') ?? undefined,
    campaign: searchParams.get('utm_campaign') ?? undefined,
    content: searchParams.get('utm_content') ?? undefined,
  };
}

export function isClientReady() {
  return typeof window !== 'undefined';
}

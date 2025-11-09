import { getRequestConfig } from 'next-intl/server';

export const locales = ['zh', 'en', 'ja', 'fr'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));


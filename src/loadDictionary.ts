export default async function loadDictionary(locale: string) {
  const t = await import(`./i18n/translations/${locale}.json`)
  return t.default
}

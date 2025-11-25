"use client"
import { useI18n } from '@/lib/i18n'
import { useTheme } from 'next-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfiguracionPage() {
  const { lang, setLang, t } = useI18n()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('settings.title')}</h2>
      <p className="text-sm text-muted-foreground">{t('settings.desc')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={lang} onValueChange={(v) => setLang(v as any)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">{t('settings.language.es')}</SelectItem>
                <SelectItem value="en">{t('settings.language.en')}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.theme')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
              <span className="text-sm text-muted-foreground">{isDark ? t('settings.theme.dark') : t('settings.theme.light')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
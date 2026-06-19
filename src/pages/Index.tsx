import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Tab = 'home' | 'charts' | 'history' | 'settings';

const navItems: { id: Tab; label: string; icon: string; emoji: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home', emoji: '🏡' },
  { id: 'charts', label: 'Графики', icon: 'LineChart', emoji: '📊' },
  { id: 'history', label: 'История', icon: 'History', emoji: '📜' },
  { id: 'settings', label: 'Настройки', icon: 'Settings', emoji: '🧶' },
];

const weekData = [
  { day: 'Пн', тепло: 22, уют: 65 },
  { day: 'Вт', тепло: 24, уют: 72 },
  { day: 'Ср', тепло: 21, уют: 58 },
  { day: 'Чт', тепло: 25, уют: 80 },
  { day: 'Пт', тепло: 23, уют: 74 },
  { day: 'Сб', тепло: 26, уют: 90 },
  { day: 'Вс', тепло: 24, уют: 85 },
];

const monthData = [
  { m: 'Янв', v: 40 },
  { m: 'Фев', v: 55 },
  { m: 'Мар', v: 48 },
  { m: 'Апр', v: 70 },
  { m: 'Май', v: 65 },
  { m: 'Июн', v: 88 },
];

const metrics = [
  { title: 'Уют дома', value: '92%', delta: '+8%', icon: 'Heart', emoji: '🧸', tone: 'bg-accent text-accent-foreground' },
  { title: 'Тепло', value: '24°C', delta: '+2°', icon: 'Flame', emoji: '🔥', tone: 'bg-primary/15 text-primary' },
  { title: 'Растения', value: '12', delta: '+1', icon: 'Sprout', emoji: '🌿', tone: 'bg-secondary text-secondary-foreground' },
  { title: 'Заметки', value: '34', delta: '+5', icon: 'StickyNote', emoji: '📝', tone: 'bg-muted text-foreground' },
];

const historyLog = [
  { date: '19 июня, 14:20', text: 'Уют поднялся до 92%', value: '92%', up: true, emoji: '🧸' },
  { date: '18 июня, 09:05', text: 'Температура снижена', value: '22°C', up: false, emoji: '❄️' },
  { date: '17 июня, 19:40', text: 'Добавлено новое растение', value: '12 шт', up: true, emoji: '🌱' },
  { date: '16 июня, 12:10', text: 'Создано 5 заметок', value: '34', up: true, emoji: '📝' },
  { date: '15 июня, 08:30', text: 'Архивация недели завершена', value: 'OK', up: true, emoji: '📦' },
];

const archive = [
  { period: 'Неделя 24', уют: '88%', тепло: '23°C', статус: 'Стабильно' },
  { period: 'Неделя 23', уют: '81%', тепло: '24°C', статус: 'Тепло' },
  { period: 'Неделя 22', уют: '76%', тепло: '21°C', статус: 'Прохладно' },
  { period: 'Неделя 21', уют: '90%', тепло: '25°C', статус: 'Идеально' },
];

const chartTooltip = {
  contentStyle: {
    borderRadius: 16,
    border: '1px solid hsl(33 38% 86%)',
    background: 'hsl(40 60% 99%)',
    fontFamily: 'Nunito',
    boxShadow: '0 8px 24px -10px hsl(18 60% 60% / 0.3)',
  },
};

const Index = () => {
  const [tab, setTab] = useState<Tab>('home');
  const [cozy, setCozy] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [warmth, setWarmth] = useState([24]);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="lg:w-72 lg:min-h-screen p-5 lg:p-6 lg:sticky lg:top-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-2xl animate-float cozy-shadow">
            🏠
          </div>
          <div>
            <h1 className="text-xl font-display font-bold leading-none">Домик</h1>
            <p className="font-hand text-lg text-primary leading-none mt-1">мой уютный дашборд</p>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ${
                tab === item.id
                  ? 'bg-card cozy-shadow text-primary'
                  : 'text-muted-foreground hover:bg-card/60'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <Card className="hidden lg:block mt-8 p-5 border-none bg-secondary/40 rounded-3xl">
          <p className="font-hand text-2xl text-secondary-foreground leading-tight">
            Дома хорошо ☕️
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Сегодня всё спокойно и тепло.
          </p>
        </Card>
      </aside>

      <main className="flex-1 p-5 lg:p-10 max-w-6xl">
        {tab === 'home' && (
          <div className="animate-fade-in space-y-8">
            <header>
              <p className="font-hand text-2xl text-primary">Добро пожаловать домой ✨</p>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mt-1">
                Как дела дома?
              </h2>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <Card
                  key={m.title}
                  className="p-5 border-none bg-card rounded-3xl hover-lift animate-scale-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-3 ${m.tone}`}>
                    {m.emoji}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.title}</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-2xl font-display font-bold">{m.value}</span>
                    <span className="text-xs font-semibold text-secondary-foreground bg-secondary px-2 py-0.5 rounded-full mb-1">
                      {m.delta}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <Card className="lg:col-span-2 p-6 border-none bg-card rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg">Уют за неделю</h3>
                  <Badge className="bg-accent text-accent-foreground border-none rounded-full">🧸 хорошо</Badge>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={weekData}>
                    <defs>
                      <linearGradient id="cozyFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(18 65% 62%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(18 65% 62%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 6" stroke="hsl(33 38% 88%)" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="hsl(28 20% 50%)" />
                    <YAxis axisLine={false} tickLine={false} stroke="hsl(28 20% 50%)" width={28} />
                    <Tooltip {...chartTooltip} />
                    <Area type="monotone" dataKey="уют" stroke="hsl(18 65% 62%)" strokeWidth={3} fill="url(#cozyFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 border-none bg-secondary/40 rounded-3xl flex flex-col justify-between">
                <div>
                  <span className="text-3xl">🌤️</span>
                  <h3 className="font-display font-bold text-lg mt-3">Сегодня</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Тёплый и спокойный день. Самое время для какао и пледа.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-secondary-foreground font-semibold">
                  <Icon name="Sun" size={18} />
                  <span>24°C · ясно</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === 'charts' && (
          <div className="animate-fade-in space-y-8">
            <header>
              <p className="font-hand text-2xl text-primary">Графики и метрики 📊</p>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mt-1">Как менялось со временем</h2>
            </header>

            <Card className="p-6 border-none bg-card rounded-3xl">
              <h3 className="font-display font-bold text-lg mb-4">Тепло и уют за неделю</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weekData} barGap={6}>
                  <CartesianGrid strokeDasharray="4 6" stroke="hsl(33 38% 88%)" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="hsl(28 20% 50%)" />
                  <YAxis axisLine={false} tickLine={false} stroke="hsl(28 20% 50%)" width={28} />
                  <Tooltip {...chartTooltip} cursor={{ fill: 'hsl(36 40% 92%)' }} />
                  <Bar dataKey="тепло" fill="hsl(18 65% 62%)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="уют" fill="hsl(150 30% 65%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border-none bg-card rounded-3xl">
              <h3 className="font-display font-bold text-lg mb-4">Уют по месяцам</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthData}>
                  <defs>
                    <linearGradient id="monthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(340 60% 70%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(340 60% 70%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="hsl(33 38% 88%)" vertical={false} />
                  <XAxis dataKey="m" axisLine={false} tickLine={false} stroke="hsl(28 20% 50%)" />
                  <YAxis axisLine={false} tickLine={false} stroke="hsl(28 20% 50%)" width={28} />
                  <Tooltip {...chartTooltip} />
                  <Area type="monotone" dataKey="v" stroke="hsl(340 60% 65%)" strokeWidth={3} fill="url(#monthFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {tab === 'history' && (
          <div className="animate-fade-in space-y-8">
            <header>
              <p className="font-hand text-2xl text-primary">История изменений 📜</p>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mt-1">Что происходило дома</h2>
            </header>

            <Card className="p-6 border-none bg-card rounded-3xl">
              <h3 className="font-display font-bold text-lg mb-4">Лента событий</h3>
              <div className="space-y-3">
                {historyLog.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/60 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center text-xl shrink-0">
                      {h.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{h.text}</p>
                      <p className="text-xs text-muted-foreground">{h.date}</p>
                    </div>
                    <Badge
                      className={`border-none rounded-full ${
                        h.up ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      {h.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-none bg-card rounded-3xl">
              <h3 className="font-display font-bold text-lg mb-4">Архив прошлых значений 📦</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="font-semibold py-2 px-3">Период</th>
                      <th className="font-semibold py-2 px-3">Уют</th>
                      <th className="font-semibold py-2 px-3">Тепло</th>
                      <th className="font-semibold py-2 px-3">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archive.map((a, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-3 px-3 font-semibold">{a.period}</td>
                        <td className="py-3 px-3">{a.уют}</td>
                        <td className="py-3 px-3">{a.тепло}</td>
                        <td className="py-3 px-3">
                          <Badge className="bg-secondary/60 text-secondary-foreground border-none rounded-full">
                            {a.статус}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === 'settings' && (
          <div className="animate-fade-in space-y-8 max-w-2xl">
            <header>
              <p className="font-hand text-2xl text-primary">Параметры и уют 🧶</p>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mt-1">Настройки дома</h2>
            </header>

            <Card className="p-6 border-none bg-card rounded-3xl space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧸</span>
                  <div>
                    <p className="font-semibold">Уютный режим</p>
                    <p className="text-sm text-muted-foreground">Мягкие тона и тёплый свет</p>
                  </div>
                </div>
                <Switch checked={cozy} onCheckedChange={setCozy} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔔</span>
                  <div>
                    <p className="font-semibold">Уведомления</p>
                    <p className="text-sm text-muted-foreground">Напоминания о делах по дому</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </Card>

            <Card className="p-6 border-none bg-card rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold">Желаемая температура</p>
                  <p className="text-sm text-muted-foreground">Текущая: {warmth[0]}°C</p>
                </div>
              </div>
              <Slider value={warmth} onValueChange={setWarmth} min={16} max={30} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>16°C</span>
                <span>30°C</span>
              </div>
            </Card>

            <Card className="p-6 border-none bg-secondary/40 rounded-3xl">
              <p className="font-hand text-2xl text-secondary-foreground">Пусть дома будет тепло 🌷</p>
              <p className="text-sm text-muted-foreground mt-1">
                Все изменения сохраняются автоматически.
              </p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

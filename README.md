# 体能小屋 · Train Your Body

Mobile-first PWA for Rein’s gym comeback: body metrics, A/B/C workouts, pull-up stages, and local check-ins.

> 体脂秤与本站仅供参考，非医疗诊断。

## Design
Matches **绿仔的投资小屋**: Morandi / iOS Liquid Glass — warm greige `#f3efe9`, soft cards, dusty blue-gray accent `#6f8494`, editorial light numerals, frosted sticky header, floating capsule tab bar, automatic warm-charcoal dark mode. System fonts only; no CDN.

## Features
- Home dashboard: today’s plan, weight / BF / muscle, 3-month goal bars, week grid
- Gym A/B/C + cardio plans with exercise check-offs
- Body metrics + soft chart, baseline/goals
- Pull-up stages, hang/plank PR, streak
- localStorage (`tyb_rein_v1`) + JSON export/import
- Chinese UI, PWA manifest + icon

## Structure
```
index.html  manifest.json  icon.svg  .nojekyll
assets/app.css  assets/app.js
```

## Local
```bash
python3 -m http.server 8000
```

Live: https://jiah558.github.io/train-your-body/

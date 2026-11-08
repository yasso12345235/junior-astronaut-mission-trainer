# 🚀 Junior Astronaut Mission Trainer

An interactive NASA Space Apps-style astronaut training simulator for mobile — built with **React Native + Expo**, **TypeScript**, **Reanimated**, **Skia**, **Moti**, **Lottie**, **Gorhom Bottom Sheet**, and **FlashList**.

---

## 🌌 The Mission

You are the **Junior Flight Controller** aboard the orbital training station *Hermes-2*. Your job: keep the fleet of
experimental subsystems alive across multiple sols of deep-space telemetry while the mission timer ticks.

- 📈 **Telemetry dashboard** rendered with a custom **Skia** shader (glowing circular gauge) + live sparklines.
- 🚨 **Random emergencies** (comms loss, thruster fault, oxygen scrubber, radiation storm, nav lockout…) delivered in a
  **Gorhom bottom sheet** where you choose the mitigation.
- 📜 **Mission log** with FlashList, sol-clock, alerts and critical events.
- ⚡ **Booster overrides** per subsystem from the system detail screen.
- 🌙 **Skia-animated nebula background** that drifts with time + emergency alert wash.

If you miss the emergency window, base integrity is lost and the simulation terminates.

---

## 🛠 Tech Stack

| Concern | Library |
| --- | --- |
| Framework | Expo SDK 58 (React Native 0.88, React 19) + TypeScript |
| Animation | Reanimated 4, Moti 0.30 |
| Graphics | Skia (`@shopify/react-native-skia`) — runtime shader + gauges |
| Motion graphics | Lottie (`lottie-react-native`) — splash / emergency |
| Sheets | Gorhom `@gorhom/bottom-sheet` |
| Lists | Shopify FlashList |
| State | Zustand + AsyncStorage persistence |
| Haptics | `expo-haptics` (wrapped in design token) |
| Styling | Design-token driven `StyleSheet` + `withAlpha` |

---

## 📁 Architecture

Feature-based structure, fully typed:

```
junior-astronaut-mission-trainer/
├── app.json
├── assets/
│   └── lottie/                    # hand-authored Lottie JSON (orbit / success / alert)
├── index.ts
├── App.tsx
└── src/
    ├── app/
    │   ├── App.tsx                # providers, fonts, status bar
    │   └── navigation/
    │       ├── RootNavigator.tsx # splash → onboarding → dashboard → system detail
    │       └── types.ts
    ├── features/
    │   ├── splash/      # Lottie + animated entrance
    │   ├── onboarding/ # slides, visual
    │   ├── dashboard/  # FlashList root, headers, mission summary, failed overlay
    │   ├── emergency/  # bottom sheet, resolution view
    │   ├── mission/    # store, constants (systems/boosts/emergencies), clock engine, hooks, types
    │   ├── mission-log/# timeline rows
    │   ├── systems/    # system detail + booster overrides
    │   └── telemetry/  # Skia gauge, metric bars, sparklines
    └── shared/
        ├── components/ # SkiaBackground, GlowCard, NeonButton, SectionHeader, StatusPill
        ├── design/     # tokens.ts, haptics.ts, motion.ts, theme.ts
        └── utils/
```

---

## ✨ Features

- **Animated splash** — hand-authored Lottie orbit + Moti fade/rise entrance.
- **Onboarding** — 3-slide guided intro with animated visual.
- **Live dashboard** — animated Skia nebula background, glow cards, telemetry gauges.
- **Skia gauge** — arc drawn through `Skia.PathBuilder`, progress animated with Reanimated shared values
  (native-thread friendly, no JS-thread churn).
- **Sparkline** — normalized area + line chart on `Skia.Path`.
- **Emergency flow** — triggered automatically ~16s into the sim; decisions in bottom sheet; countdown with
  auto-resolution (last choice = "ride it out").
- **Mission log** — FlashList list with severity colors and sol clock.
- **System detail** — boost sliders/overrides + history sparkline.
- **Design system** — neon palette (`#0B0E14`, `#050709`, `#00F0FF`, `#FFB800`, `#FF3366`, `#00E676`), spacing scale,
  typography scale, haptics tokens, Moti transition helpers.

---

## 🚀 Getting Started

```bash
npm install
npx expo start
```

Run on a device / emulator with Expo Go / development build, or:

```bash
npx expo run:android
npx expo run:ios
```

### Checks

```bash
npx tsc --noEmit
npx eslint .
npx expo-doctor
npx expo export --platform android
```

All pass in CI-ready state.

---

## 🎮 Controls / Gameplay

| Action | Behavior |
| --- | --- |
| Emergency presented | Bottom sheet with analysis; pick a mitigation. |
| Timer | Countdown per emergency; auto-resolve with last option when expired. |
| Booster | Raise or lower subsystem power from system detail. |
| Mission end | Critical subsystem → `MissionFailedOverlay` → reset. |

---

## 🧭 NASA Space Apps Context

Built as a concept entry for **NASA Space Apps 2026** — an astronaut sim in your pocket that teaches
telemetry triage, risk decisions, and systems engineering under time pressure.

---

## 📄 License

MIT

# 🚛 Cargo Planner

A web-based tool for visually planning truck cargo layouts. Supports pallet, tank, and EWC types with drag-and-drop, stacking, rotation, and axle load estimation.

### 📍 Live Demo

Hosted on **GitHub Pages**:
[https://lisanna.github.io/TruckLoad](https://lisanna.github.io/TruckLoad)

---

## 🧑‍💻 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/lisanna/TruckLoad.git
cd TruckLoad
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Then open your browser at [http://localhost:5173](http://localhost:5173) or the port shown in terminal.

---

## 🚀 Deploy to GitHub Pages

### Build and deploy:

```bash
npm run deploy
```

This will:

* Build the app using `vite build`
* Push the `/dist` folder to the `gh-pages` branch

Make sure:

* `vite.config.ts` has the correct `base` path (e.g. `/TruckLoad/`)
* `package.json` includes:

  ```json
  "homepage": "https://lisanna.github.io/TruckLoad",
  ```

---

## 🧱 Tech Stack

* React + Vite
* Tailwind CSS
* Konva for canvas rendering
* GitHub Pages for deployment

---

## 📂 Project Structure

```
/src
  ├── components
  │   ├── TruckSelector.tsx
  │   ├── ItemForm.tsx
  │   ├── TruckCanvas.tsx
  │   ├── AxleLoadCalculator.tsx
  │   └── AddedItemsPanel.tsx
  └── App.tsx
```

---

## ✅ Features

* Truck configuration with presets (Flatbed, Refrigerated, Container)
* Pallet/tank/EWC input with dimensions & weights
* Visual placement on canvas with drag-and-drop
* Rotation & removal support
* Automatic layout logic
* Axle load calculation
* GitHub Pages deployment

---

## 📃 License

MIT

# SPA для работы с грузовыми аукционами (OpenAPI)

Одностраничное приложение (SPA) для работы с грузовыми аукционами, разработанное в соответствии с OpenAPI-схемой `openapi.auctions.v0.json`.

## 🛠 Технологический стек

- **React 18 / 19** + **TypeScript** + **Vite**
- **TanStack Router** (роутинг страниц и установка ставок по ссылке)
- **TanStack Query (v5)** (серверное состояние, префетчинг, инвалидация кеша)
- **React Hook Form** + **Zod** (валидация формы ставки и фильтров)
- **MSW (Mock Service Worker v2)** + **Vite Server Middleware** (stateful-моки)
- **Zustand** (клиентское UI-состояние фильтрации)
- **Feature-Sliced Design (FSD)** (архитектура проекта)
- **Tailwind CSS v4** (стилизация UI)

> ⚠️ **Соглашение о наименовании:** Все React-компоненты имеют суффикс `*.component.tsx`.

---

## 🚀 Локальный запуск

1. **Установка зависимостей:**
   ```
   cd ul-auctions-spa
   npm install
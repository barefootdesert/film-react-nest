# FILM!

Сервис бронирования билетов в кинотеатр.

## Деплой

Приложение развёрнуто по адресу: **https://your-domain.nomoreparties.site**

pgAdmin доступен на порту `8080`.

## Структура проекта

```
film-react-nest/
├── backend/          # NestJS API
├── frontend/         # React SPA (Vite)
├── nginx/            # Nginx reverse proxy
├── docker-compose.yml
└── .env.example
```

## Локальная разработка

### База данных

```bash
docker compose up database -d
```

Инициализация БД (скрипты из `backend/test/`):

1. `prac.init.sql`
2. `prac.films.sql`
3. `prac.shedules.sql`

При полном `docker compose up` скрипты подключаются автоматически при первом запуске PostgreSQL.

### Бэкенд

```bash
cd backend
cp .env.example .env
npm ci
npm run start:dev
```

API: `http://localhost:3000/api/afisha`

`LOGGER_TYPE` — формат логов:

| Значение | Логгер | Описание |
|----------|--------|----------|
| `dev` | DevLogger | Цветной вывод (по умолчанию) |
| `json` | JsonLogger | JSON |
| `tskv` | TskvLogger | TSKV |

### Фронтенд

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

## Docker

```bash
cp .env.example .env
docker compose up -d --build
```

- Приложение: `http://localhost`
- pgAdmin: `http://localhost:8080`

## Тесты

```bash
cd backend
npm test
npm run lint
```

## CI/CD

При push в `main` GitHub Actions собирает Docker-образы и публикует их в `ghcr.io`.

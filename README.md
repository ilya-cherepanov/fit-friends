# Проект Fit Friends

## Запуск проекта

### Подготовка к запуску

1. Переместитесь в директорию `fit-friends` и установите нужные пакеты, выполнив `npm install`
2. Переместитесь в корневую директорию
3. Создайте файл: `.env`
4. Заполните файлы переменными окружения, как в `.env-example` файле. Закомментированные переменные опциональны.

### Backend

1. Из корневой директории проекта перейдите в директорию `/fit-friends/packages/backend` и выполните `docker compose up -d`.
2. Из корневой директории перейдите в директорию `/fit-friends` и выполните `npx nx run backend:db-migrate` для миграции бд 
3. Выполните `npx nx run backend:serve` для запуска backend-сервера

### Frontend

1. Перейдите из корневой директории в `/fit-friends` и выполните `npx nx run frontend:serve`

## API спецификация

OpenAPI спецификации сервиса находятся по адресу `http://localhost:3333/spec`

## Сценарии

1. `npm run cli` - cli для генерации данных
2. `npx nx run backend:db-validate` - проверяет корректность `schema.prisma` файла
3. `npx nx run backend:db-migrate` - запускает миграцию для базы данных
4. `npx nx run backend:db-reset` - сбрасывает данные в бд
5. `npx nx run backend/frontend:serve` - запускает dev server для проектов
6. `npx nx run backend/frontend:lint` - запускает линтер для проектов
7. `npx nx run backend/frontend:build` - создает релизный build для проектов

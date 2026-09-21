# Books

Веб-додаток для обміну книгами: користувачі додають свої книги, шукають чужі та надсилають запити на обмін власнику книги на email.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Firebase Authentication + Firestore
- react-hook-form + zod (форми та валідація)
- zustand (стан авторизації на клієнті)
- Resend (надсилання email)

## Функціонал

- Реєстрація / вхід (Firebase Auth, сесія зберігається через httpOnly cookie)
- `/me/books` — власні книги: додавання (назва, автор, фото за посиланням або файлом з пристрою), перегляд, видалення
- `/books` — список усіх книг: пошук за назвою/автором, сортування за алфавітом, пагінація на бекенді
- `/books/:id` — деталі книги, кнопка «Запросити обмін» (надсилає email власнику зі списком книг відправника; недоступна для власної книги)
- `/admin` — CRUD користувачів, зміна ролей, видалення будь-якої книги (лише для ролі `admin`)
- `/profile` — редагування імені й аватара, кількість власних книг, отримані запити на обмін (прийняти/відхилити)
- Сповіщення в реальному часі (Firestore `onSnapshot`): коли на книгу власника надходить новий запит, зверху екрана з'являється тост — незалежно від того, на якій сторінці власник перебуває
- `/forgot-password` — відновлення паролю через email (Firebase Auth)
- Firestore Security Rules: кожен юзер редагує лише свої дані; підвищити собі роль до `admin` неможливо навіть напряму через SDK

## Встановлення

```bash
npm install
```

### Firebase

1. Створіть проєкт на [Firebase Console](https://console.firebase.google.com), увімкніть **Authentication** (Email/Password) і **Firestore Database**.
2. Скопіюйте конфігурацію Web App у `.env.local` (див. `.env.local.example`).
3. Project Settings → Service Accounts → Generate new private key — покладіть `project_id`, `client_email`, `private_key` у ті ж змінні `FIREBASE_ADMIN_*`.
4. Опублікуйте правила з `firestore.rules` (Firestore Database → Rules → вставити → Publish).

### Email

Зареєструйтеся на [resend.com](https://resend.com), додайте `RESEND_API_KEY` і `EMAIL_FROM` у `.env.local` (для тестів підходить `onboarding@resend.dev`).

## Запуск

```bash
npm run dev
```

## Ролі

Нові акаунти отримують роль `user` за замовчуванням. Щоб отримати `admin`, потрібно вручну змінити поле `role` на `"admin"` у документі `users/{uid}` через Firebase Console (або через вже наявного адміністратора в `/admin`) — самостійно підвищити собі роль неможливо, це заборонено правилами Firestore.

## Відомі обмеження

- Фото книги/аватар при завантаженні файлом стискається й зберігається як base64 прямо в документі Firestore (без Firebase Storage, який тепер доступний лише на платному плані Blaze) — тому обмежене розміром до ~1 МБ на документ.

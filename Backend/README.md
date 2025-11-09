# Backend (MongoDB + Multer Local Uploads)

This backend now uses:

- MongoDB via Mongoose (local by default)
- Multer diskStorage for file uploads to the `public` folder (served statically)

## Environment

Create `Backend/.env`:

```env
PORT=5000
ADMIN_EMAIL=your-admin@example.com
MONGO_URI=mongodb://127.0.0.1:27017/hogwarts_bookstore
UPLOAD_DIR=public
```

All Postgres and AWS S3 variables have been removed.

## Install & Run

```bash
cd Backend
npm install
npm run dev
```

Server will start at <http://localhost:5000> and serve static files from `Backend/public`.

## Endpoints (examples)

- GET `/api/book`
- GET `/api/book/:id`
- POST `/api/book` (multipart/form-data, field name: `image`)
- DELETE `/api/book/:id`
- POST `/api/user/signup`
- POST `/api/user/login`
- GET `/api/user/all`
- POST `/api/checkout`
- GET `/api/checkout`
- POST `/api/contact`
- POST `/api/newsletter`

## Notes

- Uploaded files are stored in `Backend/public` and are accessible by URL like `http://localhost:5000/<filename>`.
- Book responses include an `_id` field compatible with the frontend.
- Newsletter duplicate email returns HTTP 409 (conflict).

# Regret Predictor Backend (TypeScript)

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install:
3. Generate Prisma client and run migrations:
4. Run in development:
5. Build:

## Endpoints
- `POST /api/auth/signup` { email, password }
- `POST /api/auth/login` { email, password }
Protected (Authorization: Bearer <token>):
- `POST /api/predictions`
- `GET /api/predictions`
- `POST /api/purchases`
- `GET /api/purchases`
- `POST /api/wishlist`
- `GET /api/wishlist`

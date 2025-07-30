# API Testing Commands - Zindagi Muskurayegi

Backend is running on: http://localhost:8000

## 1. Test Server Health
```bash
curl http://localhost:8000/api/health
```

## 2. Login Commands

### Login as Anganwadi Worker
```bash
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"worker1\",\"password\":\"password123\",\"userType\":\"anganwadi\"}"
```

### Login as Admin
```bash
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin1\",\"password\":\"password123\",\"userType\":\"admin\"}"
```

## 3. Submit Child Health Record (Worker Only)
First login as worker to get token, then:
```bash
curl -X POST http://localhost:8000/api/child-health-records ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"child_name\":\"Rahul Kumar\",\"age\":8,\"gender\":\"Male\",\"weight\":25.5,\"symptoms\":\"Fever, Cough\",\"school_name\":\"Primary School ABC\",\"anganwadi_kendra\":\"Kendra 1\",\"health_status\":\"Pending\"}"
```

## 4. Get All Records (Admin Only)
First login as admin to get token, then:
```bash
curl -X GET http://localhost:8000/api/child-health-records ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Get User's Own Records (Worker)
```bash
curl -X GET http://localhost:8000/api/child-health-records/user ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6. Get Dashboard Stats (Admin Only)
```bash
curl -X GET http://localhost:8000/api/dashboard/stats ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Step by Step Testing:

### Step 1: Login and get token
```bash
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"worker1\",\"password\":\"password123\",\"userType\":\"anganwadi\"}"
```

### Step 2: Copy the token from response and use it
Replace YOUR_TOKEN_HERE with actual token from login response

### Step 3: Test data submission
```bash
curl -X POST http://localhost:8000/api/child-health-records -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" -d "{\"child_name\":\"Test Child\",\"age\":5,\"gender\":\"Male\",\"weight\":18.5,\"symptoms\":\"Regular checkup\",\"school_name\":\"Test School\",\"anganwadi_kendra\":\"Test Kendra\"}"
```

## Database Test Users:
- **Worker**: username: `worker1`, password: `password123`
- **Admin**: username: `admin1`, password: `password123`

## Frontend URLs:
- **Main App**: http://localhost:5173
- **Login Page**: http://localhost:5173 (default)

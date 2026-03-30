# DPaaS — Run Instructions

Follow these steps to run the complete DPaaS platform locally.

## Prerequisites
- **Docker** and **Docker Compose**
- **Java 21** or later (Lombok 1.18.42+ required for Java 25)
- **Node.js** (v18+) and **npm**
- **Maven** (optional, uses `./mvnw` wrapper)

---

## 1. Start Infrastructure (Docker)
First, spin up PostgreSQL, Redis, and OpenResty (Data Plane).
```bash
docker compose up -d
```
Verify services are running:
```bash
docker compose ps
```

---

## 2. Start Backend (Spring Boot Control Plane)
In a new terminal, build and run the Spring Boot application.
```bash
cd dpaas
./mvnw spring-boot:run
```
> [!NOTE]
> The backend runs on **http://localhost:4000**.
> It will automatically connect to the Redis and Postgres services in Docker.

---

## 3. Start Frontend (React Dashboard)
In another terminal, install dependencies and start the development server.
```bash
cd frontend
npm install
npm run dev
```
> [!NOTE]
> The dashboard runs on **http://localhost:5173**.
> It is configured to proxy API requests to the backend on port 4000.

---

## 4. Test the Data Plane (OpenResty Gateway)
Once you have added a website and endpoints in the dashboard, you can route traffic through the gateway:

**Gateway URL Format:**
`http://localhost:8080/gateway/{apiKey}/{your_path}`

Example:
```bash
#apiKey is generated per website in the dashboard
curl http://localhost:8080/gateway/123-abc-456/api/login
```

---

## Troubleshooting
- **Lombok Compilation Error:** Ensure you are using Lombok `1.18.42` in `pom.xml` if using JDK 25.
- **Connection Refused:** Ensure `docker compose up -d` finished successfully before starting the backend.
- **Port Conflicts:** Ensure ports `8080`, `4000`, `6379`, `5432`, and `5173` are not in use by other applications.

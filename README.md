# 🏠 Real Estate Listing Platform (Backend)

This project is a backend service for a real estate listing platform. It uses **Express.js**, **TypeScript**, **Redis**, **Elasticsearch**, and **MongoDB** for building scalable, efficient search and listing functionality.

---

## 🔧 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MongoDB** (via Mongoose)
- **Elasticsearch** (for property search)
- **Redis** (for rate limiting and caching)
- **Docker** (for Redis & Elasticsearch in local development)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sriramalavalapati3/acredge-backend-Assaignment.git
cd acredge-backend-Assaignment/backend

2. Create .env file
Create a .env file inside the backend folder and paste the required environment variables:
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/realestate
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_NODE=http://localhost:9200

```

3. Start Services via Docker
This project uses Redis and Elasticsearch via Docker Compose. Start them with:

bash
Copy
Edit
docker-compose up -d
Make sure Docker is installed and running.

4. Start the Server
bash
Copy
Edit
npm install
npm run dev
The server will run on http://localhost:8080.

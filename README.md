# 🏠 Real Estate Listing Platform (Backend)

This is a backend service for a real estate listing platform that supports creating, storing, and searching property listings. It is built using **Node.js**, **TypeScript**, **MongoDB**, **Elasticsearch**, and **Redis**, and uses **Docker** for containerization of services like Redis and Elasticsearch.

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** with Mongoose
- **Redis** – for caching and optimization
- **Elasticsearch** – for full-text property search
- **Docker** – for running Redis and Elasticsearch locally

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sriramalavalapati3/acredge-backend-Assaignment.git
cd acredge-backend-Assaignment/backend
2. Set up environment variables
Create a .env file inside the backend folder and add the following:

env
Copy
Edit
PORT=8080
MONGO_URI=mongodb://localhost:27017/realestate
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_NODE=http://localhost:9200
3. Run Redis and Elasticsearch using Docker
Make sure you have Docker installed. Then run:

bash
Copy
Edit
docker-compose up -d
This will spin up local containers for Redis and Elasticsearch.

4. Install dependencies and start the development server
bash
Copy
Edit
npm install
npm run dev
The backend server will start at: http://localhost:8080

☁️ Optional: Use Cloud Services
Instead of running Redis and Elasticsearch locally via Docker, you can use managed cloud services:

Redis Cloud – https://redis.com/redis-enterprise-cloud/

Elastic Cloud – https://www.elastic.co/cloud/

Update your .env file to point to the respective cloud URLs.
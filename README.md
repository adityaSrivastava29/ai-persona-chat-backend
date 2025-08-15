# 🤖 AI Persona Chat Backend

A powerful Node.js backend application that creates intelligent AI-powered chat personas. Features pre-built AI tutors like Hitesh Choudhary and Piyush Garg, along with the ability to create custom AI personas with unique personalities and expertise areas.

## 🏗️ Architecture

- **Modular Design**: Clean separation of concerns with organized folder structure
- **Express.js Backend**: RESTful API with proper middleware setup
- **MongoDB Integration**: Persistent data storage for personas and chat history
- **OpenAI Integration**: Real AI-powered conversations using GPT models
- **Serverless Ready**: Optimized for Vercel deployment with connection pooling

![Screenshot](./asset/image.png)

## 📁 Project Structure

```
ai-persona-chat-backend/
├── api/                 # Vercel serverless function entry point
│   └── index.js        # Main API handler for serverless deployment
├── config/             # Configuration files
│   └── database.js     # MongoDB connection with pooling
├── controllers/        # Business logic handlers
│   └── chatController.js # Chat operations and persona management
├── models/             # MongoDB schemas (Mongoose)
│   ├── ChatHistory.js  # Chat conversation schema
│   └── Persona.js      # AI persona schema
├── personas/           # Pre-built persona definitions
│   └── hardcoded.js    # Hitesh & Piyush persona configurations
├── routes/             # API route definitions
│   └── chatRoutes.js   # RESTful API endpoints
├── services/           # External service integrations
│   └── openaiService.js # OpenAI GPT integration
├── .env.example        # Environment variables template
├── .vercelignore       # Files to exclude from deployment
├── index.js           # Main Express server entry point
├── package.json       # Dependencies and scripts
├── vercel.json        # Vercel deployment configuration
└── README.md          # This documentation
```

## 🎯 Key Features

### 1. Hardcoded AI Personas

- **Hitesh Choudhary**: Coding mentor persona with his teaching style
- **Piyush Garg**: Tech educator persona with his expertise areas
- Pre-configured system prompts that capture their unique personalities

### 2. Custom Persona Creation

- Users can create personalized AI tutors with custom system prompts
- All personas are saved to MongoDB for persistence
- Dynamic persona generation based on user requirements

### 3. Smart Chat System

- **Real OpenAI Integration**: Uses GPT models for intelligent responses
- **Context Awareness**: Maintains conversation history for continuity
- **Persona Consistency**: Each AI maintains its character throughout conversations

### 4. Data Persistence

- **Persona Storage**: All custom personas saved in MongoDB
- **Chat History**: Complete conversation logs with timestamps
- **User Sessions**: Track interactions across different personas

## 🔧 API Endpoints

### Chat Endpoints

- `POST /api/chat/hitesh` - Chat with Hitesh Choudhary persona
- `POST /api/chat/piyush` - Chat with Piyush Garg persona
- `POST /api/custom-chat` - Create/chat with custom persona

### Data Endpoints

- `GET /api/personas` - Retrieve all saved personas
- `GET /api/chat-history/:personaId` - Get conversation history

## 💾 Database Models

### Persona Schema

```javascript
- name: String (persona name)
- systemPrompt: String (AI behavior instructions)
- isHardcoded: Boolean (hardcoded vs user-created)
- createdAt: Date
```

### ChatHistory Schema

```javascript
- personaId: ObjectId (linked persona)
- messages: Array (user/assistant message pairs)
- createdAt: Date
```

## 🚀 Technical Highlights

1. **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
2. **Environment Configuration**: Secure API key management via .env files
3. **CORS Enabled**: Frontend integration ready
4. **Port Flexibility**: Automatic port selection to avoid conflicts
5. **Modular Codebase**: Easy to extend and maintain

## 🎨 Persona Examples

**Hitesh Choudhary Persona:**

- Teaching style: Practical, project-based learning
- Expertise: JavaScript, React, Node.js, MERN stack
- Communication: Friendly, encouraging, uses real-world examples

**Piyush Garg Persona:**

- Teaching style: Conceptual clarity with hands-on coding
- Expertise: Full-stack development, DevOps, system design
- Communication: Direct, technical, focuses on best practices

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-persona-chat-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your actual values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-persona-chat
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Start MongoDB**

   ```bash
   # For macOS with Homebrew
   brew services start mongodb-community

   # Or run manually
   mongod --dbpath /usr/local/var/mongodb
   ```

5. **Run the application**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### Chat with Hardcoded Persona

```http
POST /api/chat/:persona
```

**Parameters:**

- `persona` (path): `hitesh` or `piyush`

**Request Body:**

```json
{
  "message": "Explain JavaScript closures"
}
```

**Response:**

```json
{
  "response": "AI response from the persona",
  "persona": "Hitesh Choudhary"
}
```

#### Custom Persona Chat

```http
POST /api/custom-chat
```

**Request Body:**

```json
{
  "systemPrompt": "You are a Python expert who explains concepts with code examples",
  "message": "What are Python decorators?",
  "personaName": "Python Guru"
}
```

**Response:**

```json
{
  "response": "AI response based on custom prompt",
  "personaId": "60d5ecb74b24a1234567890a",
  "persona": "Python Guru"
}
```

#### Get All Personas

```http
GET /api/personas
```

**Response:**

```json
[
  {
    "_id": "60d5ecb74b24a1234567890a",
    "name": "Hitesh Choudhary",
    "isHardcoded": true,
    "createdAt": "2023-06-25T10:30:00.000Z"
  }
]
```

#### Get Chat History

```http
GET /api/chat-history/:personaId
```

**Response:**

```json
{
  "_id": "60d5ecb74b24a1234567890b",
  "personaId": {
    "_id": "60d5ecb74b24a1234567890a",
    "name": "Hitesh Choudhary"
  },
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2023-06-25T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Hi there! Ready to learn some coding?",
      "timestamp": "2023-06-25T10:30:05.000Z"
    }
  ]
}
```

## 🏗️ Project Structure

```
ai-persona-chat-backend/
├── config/
│   └── database.js          # MongoDB connection setup
├── controllers/
│   └── chatController.js    # Chat logic and handlers
├── models/
│   ├── ChatHistory.js       # Chat history schema
│   └── Persona.js          # Persona schema
├── personas/
│   └── hardcoded.js        # Hardcoded persona definitions
├── routes/
│   └── chatRoutes.js       # API route definitions
├── services/
│   └── openaiService.js    # OpenAI API integration
├── .env.example            # Environment variables template
├── index.js               # Main server file
└── package.json           # Dependencies and scripts
```

## 🎭 Available Personas

### Hitesh Choudhary

- **Focus**: Practical coding, JavaScript, React, MERN stack
- **Style**: Friendly, encouraging, uses real-world examples
- **Access**: `POST /api/chat/hitesh`

### Piyush Garg

- **Focus**: Full-stack development, algorithms, system design
- **Style**: Technical depth, structured explanations
- **Access**: `POST /api/chat/piyush`

## 🔧 Configuration Options

### Environment Variables

| Variable         | Description               | Default                                     |
| ---------------- | ------------------------- | ------------------------------------------- |
| `PORT`           | Server port               | `5000`                                      |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://localhost:27017/ai-persona-chat` |
| `OPENAI_API_KEY` | OpenAI API key            | Required                                    |

### OpenAI Settings

The application uses the following OpenAI configuration:

- **Model**: `gpt-3.5-turbo`
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `500` (response length limit)

## 🚀 Deployment

### Vercel Deployment

This backend is configured for easy deployment on Vercel with serverless functions.

#### Prerequisites

- MongoDB Atlas account (cloud database)
- OpenAI API key
- Vercel account

#### Step 1: Setup MongoDB Atlas

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (replace `<password>` and `<dbname>`)

#### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd ai-persona-chat-backend
vercel --prod
```

**Option B: Using GitHub Integration**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the project configuration

#### Step 3: Configure Environment Variables

In your Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add the following variables:

| Variable         | Value                                | Environment |
| ---------------- | ------------------------------------ | ----------- |
| `MONGODB_URI`    | Your MongoDB Atlas connection string | Production  |
| `OPENAI_API_KEY` | Your OpenAI API key                  | Production  |

Example MongoDB Atlas URI:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-persona-chat?retryWrites=true&w=majority
```

#### Step 4: Verify Deployment

1. Your API will be available at: `https://your-project-name.vercel.app`
2. Test the deployment:
   ```bash
   curl https://your-project-name.vercel.app/api/personas
   ```

#### Important Notes

- The `vercel.json` file is already configured for serverless deployment
- MongoDB Atlas is required (local MongoDB won't work with Vercel)
- Environment variables must be set in Vercel dashboard, not in `.env` files
- Each API route runs as a separate serverless function

### Using PM2 (Traditional Server Deployment)

```bash
npm install -g pm2
pm2 start index.js --name "ai-persona-backend"
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing with curl

**Test hardcoded persona:**

```bash
curl -X POST http://localhost:5000/api/chat/hitesh \
  -H "Content-Type: application/json" \
  -d '{"message": "What is React?"}'
```

**Test custom persona:**

```bash
curl -X POST http://localhost:5000/api/custom-chat \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are a helpful math tutor",
    "message": "Explain calculus",
    "personaName": "Math Helper"
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

- The app automatically selects an available port if the default is occupied
- Check terminal output for the actual port being used

**MongoDB connection failed:**

- Ensure MongoDB is running: `brew services start mongodb-community`
- Check the `MONGODB_URI` in your `.env` file

**OpenAI API errors:**

- Verify your API key is correct and has sufficient credits
- Check network connectivity

**Module not found errors:**

- Run `npm install` to install all dependencies
- Delete `node_modules` and `package-lock.json`, then reinstall

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using Node.js, Express, MongoDB, and OpenAI**

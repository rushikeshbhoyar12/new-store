# Setup Guide - Store Rating System

This guide will walk you through setting up the Store Rating System on your local development environment.

## 📋 Prerequisites

### Required Software
- **Node.js**: Version 16.0 or higher
- **MySQL**: Version 8.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Verify Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version
```

## 🗄️ Database Setup

### 1. Install MySQL
If you don't have MySQL installed:

**Windows:**
- Download MySQL installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run installer and follow setup wizard

**macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE rating_system;

# Create user (optional but recommended)
CREATE USER 'rating_user@gmail.com'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON rating_system.* TO 'rating_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 3. Verify Database Connection
```bash
mysql -u rating_user -p rating_system
```

## 🔧 Project Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd store-rating-system
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
Create `.env` file in the `backend` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=rating_user
DB_PASSWORD=your_password
DB_DATABASE=rating_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Application Configuration
PORT=3000
NODE_ENV=development
```

#### Update Database Configuration
Edit `backend/src/app.module.ts` if needed:
```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'rating_user',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'rating_system',
  entities: [User, Store, Rating],
  synchronize: true, // Set to false in production
  logging: true,
})
```

#### Start Backend Server
```bash
npm run start:dev
```

The backend should now be running on `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies
```bash
# From project root directory
npm install
```

#### Configure API Base URL
The frontend is already configured to use `http://localhost:3000` for the backend API. If you need to change this, update `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000'; // Change if needed
```

#### Start Frontend Server
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## 🧪 Testing the Setup

### 1. Verify Backend
Open your browser and navigate to:
- `http://localhost:3000` - Should show NestJS application

### 2. Verify Frontend
Open your browser and navigate to:
- `http://localhost:5173` - Should show the login page

### 3. Test Database Connection
Check the backend terminal for database connection logs. You should see:
```
[TypeORM] Connection established
```

### 4. Test Demo Accounts
Try logging in with the demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Password123! |
| User | user@demo.com | Password123! |
| Store Owner | owner@demo.com | Password123! |

## 🔧 Development Tools

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Failed
**Error**: `ER_ACCESS_DENIED_FOR_USER`
**Solution**:
- Verify MySQL credentials
- Check if MySQL service is running
- Ensure database exists

```bash
# Check MySQL service status
sudo systemctl status mysql

# Restart MySQL if needed
sudo systemctl restart mysql
```

#### 2. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`
**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run start:dev
```

#### 3. Module Not Found Errors
**Error**: `Cannot find module '@nestjs/common'`
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Issues
**Error**: `Access to fetch blocked by CORS policy`
**Solution**:
- Verify backend CORS configuration in `main.ts`
- Ensure frontend URL is allowed in CORS settings

#### 5. TypeORM Synchronization Issues
**Error**: Database schema conflicts
**Solution**:
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE rating_system;
CREATE DATABASE rating_system;
EXIT;

# Restart backend server
npm run start:dev
```

### Getting Help

1. **Check Logs**: Always check both frontend and backend console logs
2. **Database Logs**: Check MySQL error logs if database issues persist
3. **Network Tab**: Use browser developer tools to inspect API calls
4. **Documentation**: Refer to official documentation for NestJS, React, and MySQL

## 🚀 Next Steps

After successful setup:

1. **Explore the Application**: Test all user roles and features
2. **Review Code Structure**: Understand the project architecture
3. **Customize**: Modify according to your requirements
4. **Add Features**: Extend functionality as needed
5. **Deploy**: Follow deployment guide when ready for production

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the main README.md for additional information
2. Review error logs carefully
3. Search for similar issues online
4. Create an issue in the repository with detailed error information

---

**Happy Coding! 🎉**
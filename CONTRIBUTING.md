# Contributing to Store Rating System

Thank you for your interest in contributing to the Store Rating System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
1. Check existing issues to avoid duplicates
2. Use the issue template when creating new issues
3. Provide detailed information including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

### Submitting Changes
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

## 📝 Development Guidelines

### Code Style

#### Backend (NestJS)
- Use TypeScript strict mode
- Follow NestJS conventions and decorators
- Use dependency injection properly
- Implement proper error handling
- Add JSDoc comments for complex functions

```typescript
// Good
@Injectable()
export class UserService {
  /**
   * Creates a new user with validation
   * @param createUserDto - User creation data
   * @returns Promise<User> - Created user entity
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Implementation
  }
}
```

#### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Use meaningful component and variable names

```typescript
// Good
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // Implementation
};
```

### Database Guidelines
- Use TypeORM decorators properly
- Implement proper relationships
- Add database constraints
- Use migrations for schema changes
- Follow naming conventions

```typescript
// Good
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[];
}
```

### Testing
- Write unit tests for services and utilities
- Add integration tests for API endpoints
- Test React components with React Testing Library
- Maintain test coverage above 80%

### Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines
- Never commit sensitive data

## 🏗️ Project Structure

### Backend Structure
```
backend/src/
├── auth/           # Authentication module
├── users/          # User management
├── stores/         # Store management
├── ratings/        # Rating system
├── common/         # Shared utilities
│   ├── decorators/ # Custom decorators
│   ├── guards/     # Auth guards
│   └── dto/        # Data transfer objects
└── main.ts         # Application entry point
```

### Frontend Structure
```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── context/       # React context
├── hooks/         # Custom hooks
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## 🧪 Testing Guidelines

### Running Tests
```bash
# Backend tests
cd backend
npm run test
npm run test:e2e
npm run test:cov

# Frontend tests
npm run test
npm run test:coverage
```

### Writing Tests

#### Backend Tests
```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' };
    const result = await service.create(userData);
    expect(result).toBeDefined();
  });
});
```

#### Frontend Tests
```typescript
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

test('renders user information', () => {
  const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
  render(<UserCard user={user} onEdit={jest.fn()} onDelete={jest.fn()} />);
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] TypeScript types are properly defined

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Any other context about the problem.
```

## 🚀 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📚 Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://reactjs.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- [Postman Collection](./docs/postman-collection.json) - API testing
- [Database Schema](./docs/database-schema.md) - Database structure
- [Component Library](./docs/components.md) - UI components

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

## 📞 Getting Help

- Create an issue for bugs or feature requests
- Join our discussions for questions
- Check existing documentation first
- Be respectful and constructive in all interactions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Store Rating System! 🎉
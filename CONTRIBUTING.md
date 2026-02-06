# Contributing to Learn Your Way Educational Suite

Welcome! We're excited you want to contribute to Learn Your Way. This guide will help you get started.

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## 🚀 Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/learn-your-way-suite.git
cd learn-your-way-suite
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Set Up Development Environment
Follow [QUICK_START.md](./QUICK_START.md)

### 4. Make Your Changes
- Write clear, descriptive commits
- Follow existing code style
- Add tests for new features
- Update documentation

### 5. Commit & Push
```bash
git add .
git commit -m "feat: describe your feature"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Provide clear description
- Reference any related issues
- Include test results
- Update documentation

---

## 🏗️ Project Structure

```
learn-your-way-suite/
├── backend/              # Node.js/Express server
├── frontend/             # Next.js React app
├── database/             # PostgreSQL schema
├── docs/                 # Documentation
└── [config files]
```

## 💻 Development Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Python 3.8+

### Quick Setup
```bash
# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start services
# Terminal 1
chroma run --host localhost --port 8000

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd frontend && npm run dev
```

---

## 📝 Commit Message Guidelines

### Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code restructuring
- `test`: Test additions
- `chore`: Maintenance tasks

### Examples
```
feat(pdf-upload): add drag-and-drop support
fix(quiz): correct answer calculation
docs(readme): update setup instructions
```

---

## 🧪 Testing

### Run Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Before Submitting PR
- [ ] All tests pass
- [ ] No console errors
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Changes tested manually

---

## 📚 Documentation Standards

### For New Features
1. Add code comments explaining complex logic
2. Update relevant documentation
3. Add JSDoc comments for functions
4. Include usage examples

### Example JSDoc
```javascript
/**
 * Generate lesson from PDF text
 * @param {string} textContent - The extracted PDF text
 * @param {number} difficultyLevel - Difficulty level (1-5)
 * @returns {Promise<Object>} - Generated lesson structure
 * @throws {Error} - If Gemini API fails
 */
async function generateLesson(textContent, difficultyLevel) {
  // Implementation
}
```

---

## 🎨 Code Style Guide

### JavaScript/TypeScript
```javascript
// Use const by default
const variable = value;

// Use arrow functions
const handler = (param) => {
  return result;
};

// Use async/await
async function fetchData() {
  try {
    const data = await api.get('/endpoint');
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Use template literals
const message = `Hello, ${name}!`;
```

### React/TypeScript
```typescript
// Functional components with TypeScript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  const [state, setState] = useState<string>('');

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};
```

---

## 🔍 Code Review Process

### Before Submission
- [ ] Code compiles without errors
- [ ] Tests pass locally
- [ ] No console warnings
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No sensitive data in code

### Review Checklist
Reviewers will check:
- Code quality and style
- Test coverage
- Documentation completeness
- Security implications
- Performance impact

---

## 🐛 Reporting Issues

### Bug Report Template
```markdown
**Description**
Brief description of the bug

**Steps to Reproduce**
1. Do this
2. Then this
3. Bug occurs

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [Windows/Mac/Linux]
- Node version: [version]
- Other relevant info
```

### Feature Request Template
```markdown
**Description**
What feature would you like?

**Use Case**
Why would this be useful?

**Proposed Solution**
How should it work?

**Alternatives**
Other approaches?
```

---

## 🔒 Security Considerations

### When Contributing Code
- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Validate user input
- ✅ Use parameterized queries
- ✅ Follow principle of least privilege
- ❌ Don't hardcode API keys
- ❌ Don't expose sensitive data in logs
- ❌ Don't bypass authentication

---

## 📦 Dependency Management

### Adding Dependencies

**Backend**
```bash
cd backend
npm install package-name
# Document why in PR description
```

**Frontend**
```bash
cd frontend
npm install package-name
# Keep bundle size in mind
```

### Updating Dependencies
```bash
npm update
npm audit fix  # Security patches
```

---

## 🚀 Performance Guidelines

### Best Practices
- Minimize bundle size
- Optimize database queries
- Use caching where appropriate
- Lazy load components
- Minimize API calls
- Use indexes for frequently queried fields

### Before Submission
- [ ] Check bundle size
- [ ] Verify API response times
- [ ] Test with large datasets
- [ ] Check memory usage
- [ ] Test on slow networks

---

## 📖 Documentation Files

When updating docs:
- Keep formatting consistent
- Add table of contents for long docs
- Include examples
- Link to related content
- Update [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

## 🔄 Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/descriptive-name
```

### Keep Branch Updated
```bash
git fetch origin
git rebase origin/main
```

### Interactive Rebase (Cleanup)
```bash
git rebase -i origin/main
```

### Push Changes
```bash
git push origin feature/descriptive-name
```

### After PR Merge
```bash
git checkout main
git pull origin main
git branch -d feature/descriptive-name
git push origin --delete feature/descriptive-name
```

---

## 🎯 Priority Areas for Contribution

### High Priority
- [ ] Authentication system (Phase 2)
- [ ] Bug fixes
- [ ] Security improvements
- [ ] Performance optimization

### Medium Priority
- [ ] UI/UX improvements
- [ ] Documentation
- [ ] Test coverage
- [ ] Code refactoring

### Low Priority
- [ ] Code comments
- [ ] Style improvements
- [ ] Minor bug fixes

---

## 📞 Getting Help

### Resources
- 📚 [Documentation Index](./DOCUMENTATION_INDEX.md)
- 📖 [Setup Guide](./SETUP_GUIDE.md)
- 🗺️ [Development Roadmap](./DEVELOPMENT_ROADMAP.md)
- 💬 [Discussions](../../discussions)
- 🐛 [Issues](../../issues)

### Asking Questions
- Check existing documentation first
- Search closed issues
- Create new discussion if needed
- Be specific and provide examples

---

## ✅ Before You Submit

**Checklist**
- [ ] Feature/fix works as intended
- [ ] No breaking changes
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No console errors
- [ ] Commit messages are clear
- [ ] PR description is detailed

---

## 🎓 Learning Resources

### Backend Development
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Node.js: https://nodejs.org/docs/

### Frontend Development
- Next.js: https://nextjs.org/docs/
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/

### AI & Services
- Google Gemini: https://ai.google.dev/
- ChromaDB: https://docs.trychroma.com/
- REST APIs: https://restfulapi.net/

---

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page
- Thank you messages

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

- 📧 Create an issue for bugs
- 💬 Start a discussion for questions
- 📝 Check documentation first

---

**Thank you for contributing! 🙏**

Your time and effort help make Learn Your Way better for everyone!

---

**Last Updated**: February 6, 2026

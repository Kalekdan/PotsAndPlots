# Contributing to PotsAndPlots

Thank you for your interest in contributing to PotsAndPlots! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

- **Report Bugs**: Found a bug? Open an issue with details
- **Suggest Features**: Have an idea? Check existing issues or create a new one
- **Write Code**: Pick an issue and submit a pull request
- **Improve Documentation**: Help make our docs better
- **Test**: Try the app and report your experience
- **Spread the Word**: Star the repo and share with others

## 🚀 Getting Started

### Prerequisites

- **Node.js** 14.x or later
- **Java** 17 or later
- **pnpm** package manager
- **Git** for version control

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/PotsAndPlots.git
   cd PotsAndPlots
   ```

2. **Install Frontend Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Backend** (in separate terminal)
   ```bash
   cd backend
   ./gradlew bootRun
   ```

4. **Start Frontend**
   ```bash
   pnpm start
   # or use the CLI tool
   potsandplots start
   ```

5. **Run Tests**
   ```bash
   # Frontend tests
   pnpm test

   # Backend tests
   cd backend && ./gradlew test
   ```

## 📋 Development Workflow

### 1. Choose an Issue

- Browse [existing issues](https://github.com/Kalekdan/PotsAndPlots/issues)
- Look for `good first issue` or `help wanted` labels
- Comment on the issue to claim it
- Wait for maintainer approval before starting work

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/improvements

### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 4. Test Your Changes

```bash
# Run frontend tests
pnpm test

# Run backend tests
cd backend && ./gradlew test

# Run all tests
./run-all-tests.sh  # Linux/Mac
./run-all-tests.bat # Windows
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "type: brief description

Longer description if needed..."
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub:
- Use a clear title describing the change
- Reference the related issue(s)
- Describe what you changed and why
- Add screenshots for UI changes
- List any breaking changes

## 🎨 Code Style Guidelines

### Frontend (JavaScript/React)

- Use functional components with hooks
- Use meaningful variable and function names
- Follow React best practices
- Use CSS modules or styled-components for styling
- Keep components small and focused
- Add PropTypes or TypeScript types

Example:
```javascript
// Good
const PlantCard = ({ plant, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="plant-card">
      <h3>{plant.name}</h3>
      {/* ... */}
    </div>
  );
};

// Avoid
function card(p) {
  let x = false;
  return <div>{p.n}</div>;
}
```

### Backend (Java/Spring Boot)

- Follow Java naming conventions
- Use dependency injection
- Keep controllers thin, services thick
- Add JavaDoc for public methods
- Use meaningful exception handling
- Write unit tests for services

Example:
```java
// Good
@Service
public class PlantService {
    @Autowired
    private PlantRepository plantRepository;
    
    /**
     * Finds all plants for a given area.
     * @param areaId the area identifier
     * @return list of plants
     */
    public List<Plant> findByArea(Long areaId) {
        return plantRepository.findByAreaId(areaId);
    }
}
```

## ✅ Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions
- [ ] No merge conflicts with main branch
- [ ] PR description is clear and complete
- [ ] Related issue(s) linked
- [ ] Screenshots added for UI changes
- [ ] No console errors or warnings

## 🧪 Testing Guidelines

### Write Tests For

- All new features
- Bug fixes (add test that would catch the bug)
- Edge cases and error conditions
- User interactions
- API endpoints

### Frontend Tests

Use Jest and React Testing Library:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import PlantCard from './PlantCard';

test('displays plant name', () => {
  const plant = { id: 1, name: 'Spider Plant' };
  render(<PlantCard plant={plant} />);
  expect(screen.getByText('Spider Plant')).toBeInTheDocument();
});
```

### Backend Tests

Use JUnit and Spring Boot Test:

```java
@SpringBootTest
class PlantServiceTest {
    @Autowired
    private PlantService plantService;
    
    @Test
    void testFindByArea() {
        List<Plant> plants = plantService.findByArea(1L);
        assertNotNull(plants);
    }
}
```

## 📚 Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Adding configuration options
- Modifying API endpoints

Documentation files to consider:
- `README.md` - Main project documentation
- `main.md` - CLI tool specification
- API documentation (JavaDoc, JSDoc)
- Inline code comments for complex logic

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Environment**: Browser, OS, versions
7. **Console Errors**: Any error messages

## 💡 Suggesting Features

When suggesting features:

1. **Search First**: Check if it's already suggested
2. **Use Case**: Explain why this feature is needed
3. **Proposed Solution**: How you envision it working
4. **Alternatives**: Other approaches you considered
5. **Related Issues**: Link to related discussions

## 📞 Getting Help

- **Questions**: Open a [Discussion](https://github.com/Kalekdan/PotsAndPlots/discussions)
- **Issues**: Check [existing issues](https://github.com/Kalekdan/PotsAndPlots/issues)
- **Clarification**: Comment on the relevant issue
- **Security**: Email maintainers for security vulnerabilities

## 🏆 Recognition

Contributors will be:
- Listed in release notes
- Acknowledged in the README
- Added to the contributors section
- Appreciated by the community! 🙏

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## ❤️ Code of Conduct

Be respectful, inclusive, and considerate:
- Use welcoming and inclusive language
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

Thank you for contributing to PotsAndPlots! 🌱

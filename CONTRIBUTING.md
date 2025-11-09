# Contributing to Quadrant Todo

Thank you for your interest in contributing to Quadrant Todo! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a positive, inclusive community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check existing [Issues](../../issues) and discussions
2. Create a new issue with:
   - Clear description of the feature
   - Why it would be useful
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch: \`git checkout -b feature/your-feature-name\`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: \`git commit -m "Add: feature description"\`
6. Push to your fork: \`git push origin feature/your-feature-name\`
7. Open a Pull Request

## Development Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

Quick start:

\`\`\`bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/quadrant-todo.git
cd quadrant-todo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
\`\`\`

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define types for all props and functions
- Avoid \`any\` types when possible

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router conventions

### Styling

- Use TailwindCSS utility classes
- Follow existing color scheme and spacing
- Ensure responsive design (mobile-first)

### Code Quality

- Run ESLint: \`npm run lint\`
- Fix formatting issues
- Write clear, self-documenting code
- Add comments for complex logic

## Commit Messages

Follow this format:

\`\`\`
Type: Brief description

Detailed explanation (if needed)
\`\`\`

Types:
- **Add**: New feature
- **Fix**: Bug fix
- **Update**: Improve existing feature
- **Refactor**: Code restructuring
- **Docs**: Documentation changes
- **Style**: Formatting, no code change
- **Test**: Add or update tests

Examples:
- \`Add: Task due date feature\`
- \`Fix: Task status not updating on mobile\`
- \`Update: Improve quadrant view performance\`

## Testing

Before submitting a PR:

1. Test all affected functionality
2. Test on different screen sizes
3. Check browser console for errors
4. Verify database operations work correctly

## Questions?

Feel free to ask questions by:
- Creating an issue
- Commenting on existing issues
- Reaching out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉

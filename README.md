# AI Form Builder

An intelligent form builder that uses AI to generate dynamic forms based on user prompts. Built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **AI-Powered Form Generation**: Create forms instantly using natural language prompts
- **Multiple Form Elements**: Support for various input types including:
  - Radio Groups
  - Select Dropdowns
  - Text Inputs
  - Textareas
  - Switches
- **Real-time Form Preview**: See your form as you build it
- **Form Management**: Edit, publish, and manage your forms
- **Response Collection**: Collect and manage form submissions
- **Modern UI**: Built with shadcn-ui and NextUI components
- **Type Safety**: Full TypeScript support
- **Authentication**: Secure user authentication with NextAuth.js

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn-ui
- NextUI
- Radix UI
- Framer Motion

### Backend
- Next.js API Routes
- PostgreSQL
- Drizzle ORM
- NextAuth.js

### AI Integration
- Google Generative AI
- Cohere AI

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Omkarrode967/ai-form-builder.git
cd ai-form-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_AI_API_KEY="your_google_ai_api_key"
COHERE_API_KEY="your_cohere_api_key"
```

4. Set up the database:
```bash
npm run test-db
```

5. Run the development server:
```bash
npm run dev
```

## 🎯 Usage

1. **Create a Form**
   - Enter a natural language prompt describing your form
   - The AI will generate appropriate form fields and structure
   - Customize the generated form as needed

2. **Manage Forms**
   - Edit form fields and properties
   - Preview the form
   - Publish/unpublish forms
   - View form submissions

3. **Collect Responses**
   - Share your form with users
   - View and manage submissions
   - Export form data

## 🏗️ Project Structure

```
ai-form-builder/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/         # API routes
│   │   ├── actions/     # Server actions
│   │   └── forms/       # Form components
│   ├── components/      # Reusable components
│   ├── db/             # Database configuration
│   └── lib/            # Utility functions
├── public/             # Static assets
└── drizzle/           # Database migrations
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

Omkar Rode
- GitHub: [@Omkarrode967](https://github.com/Omkarrode967)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Google AI](https://ai.google.dev/)
- [Cohere AI](https://cohere.ai/)

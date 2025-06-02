# Khronos Content Calendar

A modern, AI-powered content management and scheduling platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🎯 Content Management

- **Content Library**: Beautiful grid/list view of all your content
- **Advanced Filtering**: Filter by status (Draft, Scheduled, Published, Archived) and content type
- **Real-time Search**: Search across titles, descriptions, and tags
- **Content Details**: Comprehensive view of individual content items
- **Platform Integration**: Multi-platform content distribution
- **AI-Powered Suggestions**: Smart content recommendations and improvements

### 📅 Calendar & Scheduling

- **Visual Calendar**: Interactive calendar view for content scheduling
- **Drag & Drop**: Easy content rescheduling
- **Multi-platform Scheduling**: Schedule content across different platforms
- **Status Management**: Track content through different lifecycle stages

### 🤖 AI Integration

- **Content Suggestions**: AI-powered title, description, and tag suggestions
- **Content Analysis**: Get AI feedback on your content
- **Trend Analysis**: Stay updated with trending topics
- **Performance Insights**: AI-driven content performance analytics

### 🎨 User Experience

- **Modern UI**: Clean, responsive design with smooth animations
- **Dark/Light Mode**: Adaptive theming
- **Mobile First**: Fully responsive across all devices
- **Loading States**: Smooth loading experiences
- **Error Handling**: Graceful error states and fallbacks

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom component library with Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (authenticated)/          # Protected routes
│   │   ├── content/              # Content management
│   │   │   ├── page.tsx          # Content library (main page)
│   │   │   └── [id]/             # Individual content views
│   │   │       └── page.tsx      # Content detail page
│   │   ├── calendar/             # Calendar views
│   │   └── dashboard/            # Dashboard
│   ├── auth/                     # Authentication pages
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── content/                  # Content-specific components
│   ├── ui/                       # Base UI components
│   ├── auth/                     # Authentication components
│   └── layout/                   # Layout components
├── lib/                          # Utilities and configurations
│   ├── api.ts                    # API client and endpoints
│   └── utils.ts                  # Utility functions
└── types/                        # TypeScript type definitions
    ├── content.ts                # Content-related types
    ├── auth.ts                   # Authentication types
    └── modal.ts                  # Modal and form types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/khronos-content-calendar.git
   cd khronos-content-calendar
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the environment variables:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Content Management Features

### Content Library (`/content`)

The content library is the central hub for managing all your content. Key features include:

- **Grid/List View Toggle**: Switch between card grid and detailed list views
- **Advanced Search**: Real-time search across content titles, descriptions, and tags
- **Smart Filtering**: Filter by content status, type, or platform
- **Content Cards**: Beautiful cards showing content preview, status, platforms, and metadata
- **Quick Actions**: Hover effects reveal additional actions for each content item

### Content Detail View (`/content/[id]`)

Individual content pages provide comprehensive details:

- **Full Content Display**: Rich text content with proper typography
- **Metadata**: Author information, creation/publish dates, and platform details
- **Tag Management**: Visual tag display with color coding
- **AI Suggestions**: View AI-powered improvement suggestions
- **Attachments**: Download and manage content attachments
- **Status Tracking**: Visual status indicators with appropriate icons

### Content Creation

Create new content with:

- **Multi-platform Targeting**: Select multiple platforms for distribution
- **AI-Powered Suggestions**: Get smart recommendations for titles, descriptions, and tags
- **Rich Text Editing**: Full-featured content editor
- **Scheduling**: Set publication dates and times
- **Tag Management**: Add and organize content tags
- **File Attachments**: Upload supporting files and media

## API Integration

The application is designed to work with a RESTful API. Key endpoints include:

```typescript
// Content endpoints
GET    /content              # Get all content with filtering
GET    /content/:id          # Get specific content item
POST   /content              # Create new content
PUT    /content/:id          # Update content
DELETE /content/:id          # Delete content

// Calendar endpoints
GET    /calendar             # Get scheduled content
POST   /calendar/schedule    # Schedule content
PUT    /calendar/:id         # Reschedule content

// AI endpoints
GET    /ai/suggestions       # Get content suggestions
POST   /ai/analyze           # Analyze content
POST   /chat                 # AI chat completions
```

## Customization

### Adding New Content Types

1. **Update the enum** in `src/types/content.ts`:

   ```typescript
   export enum ContentType {
     // ... existing types
     NEWSLETTER = 'newsletter',
   }
   ```

2. **Add type colors** in the content page:
   ```typescript
   const getTypeColor = (type: ContentType) => {
     switch (type) {
       // ... existing cases
       case ContentType.NEWSLETTER:
         return 'bg-teal-100 text-teal-800';
     }
   };
   ```

### Customizing Filters

Add new filter options by modifying the filter buttons in `src/app/(authenticated)/content/page.tsx`:

```typescript
const customFilters = [
  { id: 'trending', label: 'Trending', filter: (content) => content.trending },
  {
    id: 'ai-generated',
    label: 'AI Generated',
    filter: (content) => content.aiGenerated,
  },
];
```

### Theming

Customize the appearance by modifying:

- **Colors**: Update Tailwind configuration
- **Typography**: Modify the prose classes in `globals.css`
- **Components**: Customize component styles in the `ui/` directory

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@khronos.com or join our [Discord community](https://discord.gg/khronos).

---

Built with ❤️ by the Khronos team

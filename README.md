# PropEngine Insights Dashboard

A modern, responsive dashboard built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components for managing property leads and analytics.

## Features

- **Modern Dashboard Layout**: Clean, professional interface with sidebar navigation
- **Lead Management**: Track and manage property leads with status updates
- **Analytics & Insights**: Comprehensive analytics with performance metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Component Library**: Built with shadcn/ui for consistent, accessible components
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Font**: Geist Sans & Mono

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics page
│   ├── leads/             # Leads management page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard home page
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard-cards.tsx    # Dashboard stat cards
│   ├── dashboard-header.tsx   # Top navigation header
│   ├── dashboard-layout.tsx   # Main layout wrapper
│   └── dashboard-sidebar.tsx  # Sidebar navigation
└── lib/                   # Utility functions
    └── utils.ts           # Helper utilities
```

## Available Pages

- **Dashboard** (`/`) - Overview with key metrics and recent activity
- **Leads** (`/leads`) - Lead management and tracking
- **Analytics** (`/analytics`) - Performance metrics and insights
- **Reports** (`/reports`) - Report generation (placeholder)
- **Calendar** (`/calendar`) - Calendar view (placeholder)
- **Settings** (`/settings`) - Application settings (placeholder)

## Components

The dashboard includes several key components:

- **StatsCards**: Key performance indicators with trend indicators
- **RecentLeadsCard**: Latest lead activity
- **QuickActionsCard**: Common actions for quick access
- **DashboardSidebar**: Navigation with active state management
- **DashboardHeader**: Search, notifications, and user menu

## Customization

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Use the `DashboardLayout` component to maintain consistency

### Adding New Components

1. Create components in `src/components/`
2. Use shadcn/ui components as building blocks
3. Follow the existing naming conventions

### Styling

- Uses Tailwind CSS for styling
- Custom CSS variables defined in `globals.css`
- Consistent color scheme with shadcn/ui theme

## Development

- **Linting**: `npm run lint`
- **Build**: `npm run build`
- **Start**: `npm start` (production)

## Next Steps

- Add data persistence (database integration)
- Implement user authentication
- Add chart visualizations (Chart.js, Recharts)
- Add real-time updates
- Implement lead form submissions
- Add email integration
- Add calendar scheduling
- Add report generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to PropEngine.

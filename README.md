# WALLETWL BACKOFFICE

WalletWL Backoffice project

**Core Stack:**

- Angular 20.0.6 with Server-Side Rendering
- TypeScript with strict configuration
- NgRx for state management
- PrimeNG component library
- Chart.js for data visualization

**Authentication & Security:**

- Complete auth flow (login, register, password recovery)
- Route guards and HTTP interceptors
- Session management with auto-refresh

**Developer Experience:**

- Feature-based architecture
- Path aliases for clean imports (`@app/*`, `@core/*`, etc.)
- SCSS with CSS custom properties
- Responsive design system
- Testing setup with Jasmine/Karma

## Getting Started

### Requirements

- Node.js 20.19.0+
- npm 10.8.2+

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server (recommended)
ng serve
# or alternatively
npm start
```

Open http://localhost:4200 in your browser.

### Important Notes

- **Legacy Peer Dependencies**: This project uses `--legacy-peer-deps` during installation due to compatibility between Angular 20.0.6 and NgRx 19.2.1
- **Version Pinning**: Angular versions are pinned to ensure consistency with the base online-banking project
- **Chart.js**: Included for data visualization needs, free and open-source
- **Absolute Imports**: This project uses absolute imports via path aliases (`@app/*`, `@core/*`, etc.) instead of relative paths

## Project Structure

```
src/
├── app/
│   ├── commons/              # Shared UI modules and utilities
│   │   ├── bars/            # Header bars and navigation components
│   │   ├── inputs/          # Custom input components
│   │   ├── models/          # Shared data models
│   │   ├── selectors/       # Selection components (country selector, etc.)
│   │   └── primeng-ui.module.ts  # PrimeNG components exports
│   ├── core/                # Core functionality (guards, interceptors, services)
│   │   ├── guards/          # Route guards (auth.guard.ts)
│   │   ├── handlers/        # Global error handlers
│   │   ├── interceptors/    # HTTP interceptors (auth.interceptor.ts)
│   │   ├── services/        # Core services (session, platform, primeng-config)
│   │   ├── app.component.ts # Root application component
│   │   ├── app.config.ts    # Application configuration
│   │   └── app.config.server.ts # SSR configuration
│   ├── features/            # Feature modules
│   │   ├── home/           # Protected home dashboard
│   │   ├── login/          # Authentication login page
│   │   └── recover/        # Password recovery
│   ├── layouts/            # Layout components
│   │   ├── protected_layout.component.ts  # Layout for authenticated users
│   │   └── public_layout.component.ts     # Layout for public pages
│   ├── resources/          # Constants and configurations
│   │   ├── api.constants.ts     # API endpoint constants
│   │   ├── constants.ts         # General constants
│   │   └── styles.constants.ts  # Styling constants
│   └── routes/             # Routing configuration
│       ├── app.routes.ts        # Main application routes
│       ├── app.routes.server.ts # SSR routes
│       └── index.ts             # Route exports
├── styles.scss             # Global styles with CSS custom properties
├── main.ts                 # Application bootstrap (client)
├── main.server.ts          # Application bootstrap (server)
└── server.ts               # Express server configuration
```

## Authentication

The template includes a complete authentication system:

- **Login/Register/Password Recovery** pages
- **Session management** with automatic token refresh
- **Route guards** to protect authenticated routes
- **HTTP interceptors** for automatic token handling
- **Session timeout** with configurable duration (default: 5 minutes)

### Demo Credentials

For development, any username/password combination will work. The system uses mock authentication for demonstration purposes.

To integrate with your real API:

1. Update `src/app/core/services/session.service.ts`
2. Configure endpoints in `src/app/resources/api.constants.ts`
3. Modify HTTP interceptors as needed

## Development Commands

```bash
ng serve           # Development server (recommended)
npm start          # Alternative development server
npm test           # Run unit tests with Karma
npm run build      # Production build
npm run watch      # Build and watch for changes
npm run serve:ssr:walletwl-backoffice  # Serve SSR build locally
```

## Customization

### 1. Update Branding

- Change app name in `package.json` and `angular.json`
- Update project name references in `angular.json` (currently "walletwl-backoffice")
- Update colors in `src/styles.scss` CSS custom properties
- Replace logo/favicon in `public/` directory

### 2. Add New Features

- Create new feature modules in `src/app/features/`
- Add routes in `src/app/routes/app.routes.ts`
- Use the existing login/home components as reference
- Follow the modular architecture pattern

### 3. Configure API

- Update API endpoints in `src/app/resources/api.constants.ts`
- Modify authentication logic in `src/app/core/services/session.service.ts`
- Update interceptors in `src/app/core/interceptors/` as needed

### 4. Customize Styling

- Modify CSS custom properties in `src/styles.scss`
- Update PrimeNG theme configuration in `src/app/core/services/primeng-config.service.ts`
- Customize component styles following the existing SCSS structure

### 5. Data Visualization

- Use Chart.js for creating charts and graphs
- Configure chart themes and colors in component styles
- Add custom chart components in `src/app/commons/` as needed

## State Management

The template includes NgRx setup for state management:

- Configured in `src/app/core/app.config.ts`
- Ready to add your own stores, effects, and reducers
- Follow NgRx best practices for scalable state management

## UI Components

Built with PrimeNG components:

- Form components (inputs, buttons, dropdowns)
- Layout components (cards, panels, dividers)
- Data components (tables, pagination)
- Overlay components (dialogs, tooltips)

All commonly used components are exported from `src/app/commons/primeng-ui.module.ts`.

## Responsive Design

The template is mobile-first with responsive breakpoints:

- Mobile: < 640px
- Tablet: 640px - 768px
- Desktop: > 768px

## Version Information

- **Angular**: 20.0.6 (pinned for compatibility)
- **Angular CLI**: 20.0.5
- **Angular Build**: 20.0.5
- **NgRx**: 19.2.1
- **PrimeNG**: 20.0.0+
- **Chart.js**: ^4.5.0
- **TypeScript**: ~5.8.2

## Troubleshooting

### Installation Issues

- **Peer dependency warnings**: Use `npm install --legacy-peer-deps` to resolve Angular 20 + NgRx compatibility
- **Build cache issues**: Delete `.angular/cache` directory if experiencing build problems
- **Chart.js issues**: Ensure Chart.js is properly imported in components that use charting

### Development Issues

- **Bootstrap errors**: Ensure all Angular versions are aligned (20.0.6)
- **Import errors**: Check path aliases in `tsconfig.json` (`@app/*`, `@core/*`, etc.)
- **SSR issues**: Verify `main.server.ts` and server configuration

## Feature/Flow Structure

When creating new features or flows, follow this organized structure pattern:

### Basic Feature Structure

```
features/
└── flowName/
    ├── flow_name.component.ts    # Main feature component
    ├── flow_name.component.html  # Template file
    └── flow_name.component.scss  # Styles file
```

### Feature with Specific Components

```
features/
└── flowName/
    ├── flow_name.component.ts
    ├── flow_name.component.html
    ├── flow_name.component.scss
    └── components/              # Feature-specific components
        ├── specific_component.component.ts
        └── another_component.component.ts
```

### Component Guidelines

**Main Feature Components:**

- Use separate `.component.ts`, `.component.html`, and `.component.scss` files
- Must be standalone components (`standalone: true`)
- This allows for better organization of complex features

**Specific/Reusable Components:**

- Use single `.component.ts` files with inline CSS and templates
- Must be standalone components (`standalone: true`)
- Perfect for small, focused components
- Example structure:

```typescript
@Component({
  selector: "app-my-component",
  standalone: true,
  template: `<div>Component content</div>`,
  styles: [
    `
      div {
        padding: 1rem;
      }
    `,
  ],
})
export class MyComponent {}
```

**Common Components:**

- Must also be single `.component.ts` files with inline SCSS and HTML
- Must be standalone components (`standalone: true`)
- Follow naming convention: `common_component.component.ts`
- Examples: `input_label.component.ts`, `country_selector.component.ts`, `header_bar.component.ts`
- Keep all template and styles inline for maximum portability

**Organization Rules:**

- Feature-specific components go in `flowName/components/`
- Common components go in `src/app/commons/` with underscore naming convention
- Use absolute imports for all references

## Architecture Notes

The template uses feature-based architecture with NgRx for state management. Each feature is self-contained with its own components, services, and routing.

**Key Architecture Principles:**

- **Absolute Imports**: Uses path aliases (`@app/*`, `@core/*`, `@features/*`, etc.) instead of relative imports
- **Feature Modules**: Each feature is organized in its own directory with components, services, and routing
- **Shared Resources**: Common components and utilities are centralized in `commons/`
- **Separation of Concerns**: Core functionality (guards, interceptors) separated from business logic
- **Component Organization**: Clear distinction between main feature components (separate files) and specific/reusable components (inline styles)

## License

MIT License - use this template for any project, personal or commercial.

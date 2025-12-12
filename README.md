# Chapter247 Frontend Project

This is a Next.js frontend application for the Chapter247 project.

## Features
- **Authentication**: Login, Signup (redirect), and protected routes.
- **Task Management**: Add, Edit, Delete, and Toggle tasks.
- **Profile Management**: View user info and "Stay Signed In" setting.
- **Global Features**:
  - Idle Timer (auto-logout after inactivity).
  - Global Popup Notifications (Success, Error, Info).
  - Responsive UI with modern gradients.

## Tech Stack
- **Framework**: Next.js 15
- **Styling**: Inline Styles / Encapsulated Components (CSS-in-JS simulation)
- **State Management**: React Context (AuthProvider, PopupProvider)

## Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (v16.8.0 or newer recommended).
- **npm** or **yarn**: Package manager.

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd chaper247-frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**:
    - Ensure you have a `.env.local` file in the root directory.
    - It should contain configurations like:
      ```env
      NEXT_PUBLIC_DEFAULT_IDLE_MINUTES=10
      NEXT_PUBLIC_COUNTDOWN_SECONDS=60
      ```

### Running the Development Server

1.  **Start the dev server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  **Access the application**:
    - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## Project Structure
- `app/`: Main application routes (Next.js App Router).
  - `auth/`: Login and Signup pages.
  - `tasks/`: Task management interface.
  - `profile/`: User profile and settings.
- `components/`: Reusable UI components and Context Providers (`AuthProvider`, `PopupMessage`, `IdleTimerProvider`, etc.).
- `configue/`: centralized configuration (e.g., `routes.js`).
- `lib/`: Utility functions and API wrappers (`api.js`).

# Live Orbit: Surgery Status Board

## Real-time Patient Progress Tracking

Live Orbit is a modern web application designed to keep families, loved ones, and surgical teams coordinated with real-time patient progress tracking. It provides a clear, color-coded status board and robust patient information management, ensuring transparency and efficiency in surgical environments.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [UI/UX Design Principles](#uiux-design-principles)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

-   **Real-time Status Tracking:** Monitor patient status through each surgical stage with live updates.
-   **Secure Access Control:** Role-based access ensures information is in the right hands (Admin, Doctor, Visitor).
-   **Multi-user Support:** Designed for administrators, surgical teams, and waiting room displays.
-   **Intuitive Status Board:** Clean, color-coded status board with live updates, perfect for waiting areas.
-   **Patient Information Management:** Add, view, update, and delete patient records.
-   **Dynamic Search & Filtering:** Easily find patients by last name with dynamic search.
-   **Responsive Design:** Optimized for various screen sizes, from mobile to desktop.
-   **Modern UI:** Beautiful and easily visible interface using a consistent color palette.

## Technologies Used

-   **Next.js 15.4.1:** React framework for production.
-   **React 19.1.0:** JavaScript library for building user interfaces.
-   **TypeScript:** Strongly typed superset of JavaScript.
-   **Tailwind CSS 4:** Utility-first CSS framework for rapid UI development.
-   **Zustand:** Small, fast, and scalable bearbones state-management solution.
-   **Lucide React:** Beautifully simple and customizable open-source icons.
-   **React Hook Form:** Performant, flexible and extensible forms with easy-to-use validation.
-   **PDFKit:** PDF generation library (for API routes).
-   **clsx:** A tiny (229B) utility for constructing `className` strings conditionally.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.x or higher recommended)
-   npm (v8.x or higher) or Yarn (v1.x or higher)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AskTiba/Live-Orbit.git
    cd sugery_status_board # Navigate into the project directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This command optimizes the application for the best performance.

## Project Structure

```
sugery_status_board/
├── public/                 # Static assets (images, fonts, etc.)
│   └── assets/
│       └── logo.svg
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   │   ├── Auth/           # Authentication related pages
│   │   ├── Dashboard/      # Dashboard pages (admin, doctor, statusboard)
│   │   ├── api/            # API routes (export, patients)
│   │   ├── components/     # Shared UI components (footer, navbar, homeCard)
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components (guards, custom icons)
│   │   └── icons/          # Custom SVG icons
│   ├── db/                 # Local JSON database (db.json)
│   ├── Features/           # Feature-specific modules (auth, doctor, statusBoard)
│   │   ├── auth/
│   │   ├── doctor/
│   │   └── statusBoard/
│   ├── store/              # Zustand global state management
│   └── utils/              # Utility functions and data (cardData, statusColors)
├── .gitignore              # Specifies intentionally untracked files to ignore
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Records the exact versions of dependencies
├── postcss.config.mjs      # PostCSS configuration for Tailwind CSS
├── README.md               # Project README file
└── tsconfig.json           # TypeScript configuration
```

## API Endpoints

The application exposes the following API endpoints:

-   **`GET /api/patients`**: Retrieves a list of all patients.
-   **`GET /api/patients/[id]`**: Retrieves a single patient by ID.
-   **`PUT /api/patients/[id]`**: Updates a patient's record by ID.
-   **`DELETE /api/patients/[id]`**: Deletes a patient's record by ID.
-   **`GET /api/export/pdf?id=[patientId]`**: Generates and downloads a PDF report for a specific patient.

## UI/UX Design Principles

The project adheres to modern UI/UX principles, focusing on:

-   **Clarity & Readability:** Ensuring all text and elements are easily discernible.
-   **Visual Hierarchy:** Guiding user attention to important information through size, weight, and color.
-   **Consistency:** Maintaining a uniform look and feel across all components.
-   **Responsiveness:** Providing an optimal viewing and interaction experience across a wide range of devices.
-   **Color Palette:** Utilizing the custom "Viking" color palette for a cohesive, beautiful, and easily visible interface.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

-   **Shamuran:** [GitHub Profile](https://github.com/Ahmad-nba)
-   **Shubham:** [GitHub Profile](https://github.com/1)
-   **Anthony:** [GitHub Profile](https://github.com/])

Feel free to reach out with any questions or feedback!

# Kampot Tech Hub - About

This document outlines the core technologies used in the Kampot Tech Hub application and the necessary requirements for running or deploying it outside of the Google AI Studio environment.

## Technology Stack

The application leverages a modern frontend stack to deliver a responsive and dynamic user experience:

*   **React (with Hooks & Lazy Loading):** A declarative, component-based JavaScript library for building user interfaces. React Hooks (`useState`, `useEffect`, `useContext`, etc.) are used for managing component state and side effects, while `React.lazy` and `Suspense` are employed for code-splitting and optimizing initial load times.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript. It enhances code quality, maintainability, and developer productivity by catching errors at compile time.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs directly in your HTML/TSX. It enables highly customizable and responsive styling.
*   **React Router DOM:** A collection of navigational components that compose declaratively with your application. It handles client-side routing, enabling a single-page application experience with distinct URLs for different views.
*   **IndexedDB:** A low-level API for client-side storage of large amounts of structured data, including files and blobs. It's used here for persistent local storage of application data (users, listings, inquiries).
*   **Google AI Studio CDN:** For streamlined development and deployment within the Google AI Studio environment, core libraries like React, ReactDOM, and React Router DOM are loaded via a specialized CDN using an `importmap`.

## Run Requirements (Outside Google AI Studio Environment)

To run or deploy this application outside of the Google AI Studio, you will need the following development tools and environment considerations:

1.  **Node.js:** A JavaScript runtime environment. Ensure you have a recent LTS version installed.
2.  **NPM or Yarn:** Package managers for Node.js. Used to install project dependencies.
3.  **Vite:** A fast build tool that provides a lightning-fast development experience for web projects. This project implicitly uses Vite for its development server and build process.
    *   You would typically install project dependencies first: `npm install` or `yarn install`
    *   Then, run the development server: `npm run dev` or `yarn dev`
    *   To create a production build: `npm run build` or `yarn build`
4.  **Modern Web Browser:** The application relies on modern browser features like ES Modules and IndexedDB.
5.  **Environment Variables (for AI Integration):** If integrating with the Google Gemini API (as hinted by the coding guidelines), an `API_KEY` environment variable will be required for authentication. This would typically be configured during deployment (e.g., in a `.env` file for local development, or through a platform's environment variable management).
    *   Example `.env` file content: `API_KEY=YOUR_GEMINI_API_KEY_HERE`
    *   **Note:** The provided code currently does not directly use the `@google/genai` library, but the general guidelines indicate this setup.

This structure provides a robust and scalable foundation for a modern web application.

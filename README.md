# Namaste Token Website

An interactive and engaging website for the Namaste meme token on the Cardano blockchain. This website features modern design, animations, and interactive elements to create a memorable user experience.

## Features

- **Interactive UI**: Engaging animations and interactive elements throughout the site
- **Theme Switching**: Toggle between Light, Dark, and Namaste themes
- **Responsive Design**: Fully responsive layout that works on all devices
- **Animated Components**: Smooth animations for enhanced user experience
- **Interactive Tokenomics**: Interactive pie chart with clickable segments
- **Expandable FAQ**: Interactive FAQ section with expandable answers
- **Social Media Integration**: Animated social media links
- **Newsletter Subscription**: Interactive newsletter subscription form
- **Wallet Connection**: Simulated wallet connection functionality

## Technologies Used

- React.js
- Styled Components
- Framer Motion (for animations)
- React Intersection Observer
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/namaste-token.git
cd namaste-token
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/public` - Static assets and HTML template
- `/src` - Source code
  - `/components` - React components
  - `/context` - Context providers (ThemeContext)
  - `App.js` - Main application component
  - `index.js` - Application entry point

## Customization

### Themes

The website includes three themes:
- Light: Clean, bright interface
- Dark: Dark mode for reduced eye strain
- Namaste: Branded theme with the token's primary color

Themes can be modified in the `src/context/ThemeContext.js` file.

### Content

Update the content in each component file to customize the website for your specific needs.

## Deployment

Build the project for production:

```
npm run build
```

The build artifacts will be stored in the `build/` directory, ready to be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [snek.com](https://www.snek.com/) and [hosky.io](https://hosky.io/)
- Cat meditation illustration used with permission 
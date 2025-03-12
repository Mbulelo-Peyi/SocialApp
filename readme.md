# SocialApp

SocialApp is a social networking application that combines a Django-powered backend with a modern JavaScript frontend (leveraging Vite) to deliver a dynamic user experience. The application allows users to register, authenticate, share content, and interact in real time, while also providing advanced content moderation and sentiment analysis features.

## Features

- **User Management & Authentication:**  
  - **JWT Authentication:**  
    The application uses JSON Web Tokens (JWT) for secure user authentication. This allows users to log in and receive a token that is used to authorize subsequent API requests.
  - **Token Refresh with Axios Interceptor:**  
    The frontend employs an Axios interceptor to automatically handle token refreshes, ensuring a smooth and secure user experience.

- **Content Sharing:**  
  Users can post text, images, videos, and other media. The content module manages posts, media uploads, and related interactions.

- **Content Moderation:**  
  Uses the [opennsfw2 (https://github.com/bhky/opennsfw2)] Keras-based model to analyze images and videos, ensuring that visual content is appropriate before publication.

- **Sentiment Analysis:**  
  Leverages a pretrained RoBERTa model from Hugging Face to perform sentiment analysis on post content, comments, and comment replies. This helps gauge user sentiment and improve moderation.

- **Geolocation Services:**  
  With a dedicated `geoip` directory, SocialApp integrates location-based features such as tagging posts with geographical data or showing nearby activities.

- **Real-Time Interactions:**  
  The `telly` components support messaging, notifications, or live updates to enhance user interactions.

- **Modern Frontend:**  
  Built with JavaScript and Vite, the frontend provides a responsive, single-page application (SPA) experience.

## Repository Structure

- **content/**  
  Contains modules and files related to managing posts, comments, and other user-generated content.

- **geoip/**  
  Implements geolocation functionality to support location-based features.

- **static/**  
  Houses static assets such as CSS, JavaScript, and images.

- **telly/**  
  Supports real-time interactions (messaging/notifications). Similar functionality may also be present under `vite/telly` for frontend integration.

- **user/**  
  Manages user-related operations including account creation, authentication, and profile management.

- **vite/telly/**  
  Contains frontend code related to real-time interactions within the application.

- **manage.py**  
  Django’s command-line utility for administrative tasks like running the server and applying migrations.

- **requirements.txt**  
  Lists Python dependencies for running the backend (including libraries for NSFW detection, sentiment analysis, and JWT authentication).

- **tests.py**  
  Contains tests to ensure the app’s functionality and stability.

## Installation

### Prerequisites

- Python (version 3.8+ recommended)
- Node.js and npm (for running the Vite frontend)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mbulelo-Peyi/SocialApp.git
   cd SocialApp

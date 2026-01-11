🎓 Campus Circle - College Community Chat Hub


Campus Circle is a real-time collaboration and chat platform designed specifically for college students. It bridges the gap between students by providing dedicated channels for events, technical discussions, and academics, powered by Ably for instant messaging and Google Gemini AI for smart assistance.

🚀 Key Features
⚡ Real-Time Messaging: Instant text communication using Ably's Pub/Sub architecture.
🤖 AI Assistant: Integrated Google Gemini chatbot to answer student queries (academics, events, tech) instantly.
📂 Image Sharing: Support for sharing compressed images in chat rooms.
👥 Live Presence: See who is online, typing indicators, and user bios.
🔐 Secure Authentication: Custom Signup/Login system using JWT (JSON Web Tokens) and Bcrypt for password hashing.
📢 Multi-Channel Support: Dedicated rooms for:
🎉 College Events
💻 Technical Discussions
📚 Academics & Exams
💼 Placements
💬 Random Chill

🛠️ Tech Stack Used-
1)Frontend
HTML5 / CSS3: Custom responsive UI with a dark/light theme aesthetic.

2)JavaScript (Vanilla): Client-side logic for real-time connection and UI updates.

3)EJS (Embedded JavaScript): Server-side templating for views.

4)Backend
Node.js: Runtime environment.

Express.js: Web framework for routing and API handling.

MongoDB & Mongoose: NoSQL database for storing user credentials and profiles.

Real-Time Engine
Ably: Utilized for WebSocket-based real-time messaging, presence detection, and history management.

***✨ Google Tech Stack Used
Google Gemini API (Gemini-2.5-Flash): Used to power the "Ask Assistant" feature, providing intelligent, context-aware responses to student queries directly within the platform.

⚙️ Installation & Setup
Follow these steps to run the project locally:

1. Clone the Repository
Bash

git clone https://github.com/your-username/campus-circle.git
cd campus-circle
2. Install Dependencies
Bash

npm install
3. Environment Configuration
Create a .env file in the root directory and add the following keys:

Code snippet

# Database Configuration
MONGO_URI=xyz

# Authentication Secret
JWT_SECRET=YourSuperSecretKeyHere

# Ably Realtime Keys
ABLY_API_KEY=Your_Ably_API_Key_Here

# Google Gemini AI Key
API_KEY=Your_Google_Gemini_API_Key
4. Run the Server
Bash

node index.js
# or
nodemon index.js
5. Access the App
Open your browser and go to: http://localhost:3000

# CampusBot — Project Documentation

## 1. System Overview
CampusBot is a static web application. The browser loads `index.html`, applies `css/style.css` and runs `js/chatbot.js`. The script normalizes user input, compares it against predefined keyword groups and selects the closest prepared response.

## 2. System Requirements
- Windows, macOS or Linux
- Modern browser (Chrome, Firefox, Edge or Safari)
- Optional Python 3 for a local static HTTP server
- Optional MySQL 8+ to inspect the supplied database schema

## 3. Functional Requirements
- Display a chatbot interface and suggested questions.
- Accept text input and submit messages.
- Show user and chatbot messages with timestamps.
- Match known phrases and keywords to prepared responses.
- Return a helpful fallback for unknown questions.
- Persist recent conversation messages in browser localStorage.
- Allow the user to start a new chat or clear saved history.

## 4. Non-Functional Requirements
- Responsive layout for desktop and mobile.
- Clear visual distinction between user and bot messages.
- No runtime package dependencies.
- Input length limited to 600 characters.
- Chat messages are displayed as text rather than interpreted as HTML.

## 5. Architecture
**Browser UI → JavaScript event handlers → input normalization → rule/keyword matching → response selection → chat display.**

The localStorage key `campusbot_history_v1` stores recent messages in the current browser profile. The MySQL database design is separate and is not connected to this static build.

## 6. Main Algorithm
1. Read the user's message.
2. Convert it to lowercase and remove punctuation.
3. Compare the normalized text with each knowledge-base keyword.
4. Calculate a simple match score for exact, contained or multi-word matches.
5. Return the response with the highest positive score.
6. If no prepared topic matches, return a fallback response.
7. Append both user and bot messages to the page and save them locally.

## 7. Database Design
`database/schema.sql` defines:
- `chatbot_sessions`: one record per conversation session.
- `chat_messages`: messages associated with a session and sender.
- `knowledge_base`: topic keywords and prepared response text.

One session can have many messages. The schema is provided as a design artefact; the current front end uses localStorage and does not connect to MySQL. A backend API is required for live database access.

## 8. Installation and Execution
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Alternatively, run `python -m http.server 8000` in the project folder.
4. Open `http://localhost:8000`.
5. Try the suggested prompts or type your own question.
6. Optional: import `database/schema.sql` into MySQL 8+.

## 9. Test Plan
Refer to `TEST_CASES.md` for detailed test cases covering page load, known topics, unknown questions, empty input, history persistence, clearing history and responsive layout.

## 10. Limitations
- Uses a small predefined rule-based knowledge base.
- Does not understand context across multiple turns.
- Does not learn from conversations.
- Does not call a generative AI model.
- Does not connect to the MySQL schema.
- localStorage is limited to the current browser profile and can be cleared.

## 11. Security and Privacy
Messages remain in the current browser's localStorage in this demo. Avoid entering sensitive information. A production system should provide a privacy notice, retention controls, server-side validation, access controls and secure transport. Any third-party AI API key must be kept on a backend server and never embedded in client-side JavaScript.

## 12. Conclusion
CampusBot demonstrates the structure and interaction flow of a simple chatbot using standard web technologies. Its modular JavaScript and accompanying database design can be extended into a full-stack conversational application.

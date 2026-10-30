-- CampusBot MySQL 8+ database design
-- The delivered static chatbot does not connect to this database.
-- This schema is supplied for the database design requirement and future backend work.

CREATE DATABASE IF NOT EXISTS campusbot_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusbot_db;

CREATE TABLE chatbot_sessions (
  session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_token CHAR(36) NOT NULL UNIQUE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL
);

CREATE TABLE chat_messages (
  message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id BIGINT NOT NULL,
  sender ENUM('user','bot') NOT NULL,
  message_text TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_message_session FOREIGN KEY (session_id)
    REFERENCES chatbot_sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE knowledge_base (
  knowledge_id INT AUTO_INCREMENT PRIMARY KEY,
  topic VARCHAR(120) NOT NULL,
  keywords VARCHAR(500) NOT NULL,
  response_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO knowledge_base (topic, keywords, response_text) VALUES
('Artificial Intelligence','artificial intelligence, AI, define AI',
 'Artificial Intelligence is a field of computer science focused on systems that perform tasks associated with human intelligence.'),
('HTML','HTML, markup language',
 'HTML provides the structure and semantic content of a web page.'),
('CSS','CSS, stylesheets',
 'CSS controls the presentation and layout of web pages.'),
('JavaScript','JavaScript, JS',
 'JavaScript adds behaviour and interactivity to web pages.');

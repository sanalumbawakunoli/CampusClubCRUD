
CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    president TEXT NOT NULL,
    email TEXT NOT NULL,
    meeting_day TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clubs
(name, category, description, president, email, meeting_day)
VALUES
('Coding Club', 'Academic', 'Promotes programming and software development', 'John Banda', 'coding@university.edu', 'Monday'),
('Green Earth Club', 'Environmental', 'Promotes environmental conservation', 'Mary Phiri', 'green@university.edu', 'Wednesday'),
('Football Club', 'Sports', 'Organises football activities', 'Peter Zulu', 'football@university.edu', 'Friday'),
('Robotics Club', 'Technology', 'Explores robotics and automation', 'Grace Mulenga', 'robotics@university.edu', 'Tuesday'),
('Debate Club', 'Academic', 'Develops public speaking and debating skills', 'David Chanda', 'debate@university.edu', 'Thursday'),
('Music Club', 'Arts', 'Organises music and performance activities', 'Ruth Tembo', 'music@university.edu', 'Friday'),
('Entrepreneurship Club', 'Business', 'Encourages student innovation', 'James Phiri', 'business@university.edu', 'Tuesday'),
('Photography Club', 'Arts', 'Teaches photography and visual storytelling', 'Linda Zulu', 'photo@university.edu', 'Saturday'),
('Cybersecurity Club', 'Technology', 'Promotes cybersecurity learning', 'Brian Mwila', 'cyber@university.edu', 'Thursday'),
('Health Awareness Club', 'Health', 'Promotes student health education', 'Sarah Banda', 'health@university.edu', 'Wednesday');

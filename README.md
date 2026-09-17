# ERD Master

**ERD Master** is an interactive learning tool built for students developing skills in Data Analytics, Database Management, Information Systems, and related technology fields. It focuses on one of the most important foundations of relational database design: understanding and creating Entity-Relationship Diagrams.

The application helps students practice:

- Identifying entities and attributes
- Understanding primary and foreign keys
- Interpreting cardinality and optionality
- Reading Crow's Foot notation
- Translating business rules into database relationships
- Identifying one-to-one, one-to-many, and many-to-many relationships
- Resolving many-to-many relationships with associative entities
- Building ER diagrams from real-world scenarios

ERD Master was created to make database modeling practice more interactive than reviewing textbook examples alone. It gives students immediate feedback and explanations so they can understand not only whether an answer is correct, but why the database model works that way.

## Practice Modes

### Terminology
Practice core ERD and relational database vocabulary through definitions, scenarios, and concept-identification questions.

### Read an ERD
Inspect Crow's Foot diagrams and reason about entities, attributes, primary keys, foreign keys, cardinality, optionality, participation, relationships, and business rules.

### Fill in the Blank
Complete missing parts of an ERD or business rule, including cardinality markers, optionality, PK/FK roles, relationships, associative entities, and composite keys.

### Build an ERD
Construct models from business scenarios by selecting entities, creating relationships, assigning both endpoint constraints, and marking PK/FK attributes. The mode provides partial-credit feedback and solution explanations.

## Technology

ERD Master uses only:

- HTML
- CSS
- Vanilla JavaScript

There are no required frameworks, external libraries, or build tools.

## Run Locally

Because this is a static web application, it can be opened directly in a browser. For the most reliable local experience, serve the project directory with a local static server.

### Python

```powershell
python -m http.server 5500
```

Then open <http://127.0.0.1:5500/index.html>.

You can also use the VS Code Live Server extension if it is installed.

## Project Structure

```text
index.html              Application entry point
style.css               Dashboard and practice-mode styling
app.js                  Application behavior and interaction logic
data/questions.js       Read an ERD questions
data/terminology.js     Terminology questions
data/fill-blanks.js     Fill in the Blank questions
data/build-challenges.js Build an ERD scenarios
assets/diagrams/        Application diagram assets
references/             Private course materials, excluded from Git
```

## Educational Purpose

ERD Master is an educational project for practicing Entity-Relationship Diagram concepts and database modeling fundamentals. It is intended for learning and practice rather than production database design or assessment delivery.

// database.js
// Your task: implement each function below using better-sqlite3.
// The function signatures are identical to storage.js so you can
// compare the two files side by side.
//
// When every function works correctly, `node app.js` should
// print exactly the same output as it did with storage.js.

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, '../flashcards.db');

const db = new Database(DB_FILE);

// ----------------------------------------------------------------
// Decks
// ----------------------------------------------------------------

export function getAllDecks() {
  // TODO: return all rows from the decks table
 return db.prepare('SELECT * FROM decks').all();
}

export function getDeckById(id) {
  // TODO: return the deck row with the given id, or null if not found
return db.prepare('SELECT * FROM decks WHERE id = ?').get(id) ?? null;
}

export function addDeck(name, description) {
  // TODO: insert a new deck and return the new row (including its id)
const result = db.prepare('INSERT INTO decks (name, description) VALUES (?, ?)').run(name, description);
  return {
    id: result.lastInsertRowid,
    name,
    description
  };
}

export function deleteDeck(deckId) {
  // TODO: delete the deck with the given id
  //       return true if a row was deleted, false otherwise
const result = db.prepare('DELETE FROM decks WHERE id = ?').run(deckId);
  return result.changes > 0;
}

// ----------------------------------------------------------------
// Cards
// ----------------------------------------------------------------

export function getAllCardsForDeck(deckId) {
  // TODO: return all card rows whose deckId matches
return db.prepare(`
    SELECT id, question, answer, learned, deck_id AS deckId
    FROM cards
    WHERE deck_id = ?
  `).all(deckId);
}

export function addCard(question, answer, deckId) {
  // TODO: insert a new card and return the new row (including its id)
const result = db.prepare(`
    INSERT INTO cards (question, answer, deck_id)
    VALUES (?, ?, ?)
  `).run(question, answer, deckId);

  return {
    id: result.lastInsertRowid,
    question,
    answer,
    deckId,
    learned: 0
  };
}

export function markCardLearned(cardId) {
  // TODO: set learned = 1 for the card with the given id
  //       return the updated row, or null if not found
db.prepare('UPDATE cards SET learned = 1 WHERE id = ?').run(cardId);

  return db.prepare(`
    SELECT id, question, answer, learned, deck_id AS deckId
    FROM cards
    WHERE id = ?
  `).get(cardId) ?? null;
}

export function deleteCard(cardId) {
  // TODO: delete the card with the given id
  //       return true if a row was deleted, false otherwise
  const result = db.prepare('DELETE FROM cards WHERE id = ?').run(cardId);
  return result.changes > 0;
}

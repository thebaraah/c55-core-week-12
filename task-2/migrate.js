import fs from 'fs';
import Database from 'better-sqlite3';

const db = new Database('flashcards.db');

const data = JSON.parse(fs.readFileSync('data/data.json', 'utf-8'));

const insertDeck = db.prepare(`
  INSERT INTO decks (name, description)
  VALUES (?, ?)
`);

const insertCard = db.prepare(`
  INSERT INTO cards (question, answer, learned, deck_id)
  VALUES (?, ?, ?, ?)
`);

data.decks.forEach(deck => {
  insertDeck.run(deck.name, deck.description);
});

data.cards.forEach(card => {
  insertCard.run(
    card.question,
    card.answer,
    card.learned ? 1 : 0, 
    card.deckId             
  );
});
---
## 🚀 New Task / Issue
about: How the 3 Demo Cards Work
title: "[Gameplay] Card Effects Explanation"
assignees: 
  - Santiago Aguilar
---

## 📌 Issue Name
Card Effects System - 3 Demo Cards Breakdown

## 📖 How Each Card Works

### Card 1: Chariot
**Effect:** Discard top card from Great Deck
```javascript
this.discardedCard = this.greatDeck.shift();
```
- Removes 1 card from deck without showing it
- Display: "Throwing away the top card of the Great Deck..."
- Strategic: Remove bad cards (Moon = damage)

---

### Card 2: High Priestess
**Effect:** Peek at next card for 2 seconds
```javascript
this.peekedCard = this.greatDeck[0];
this.showPeekCard = true;
setTimeout(() => { this.showPeekCard = false; }, 2000);
```
- See next card before it's played
- Display: "See the next card from the Great Deck"
- Strategic: Plan your next move based on info

---

### Card 3: Wheel of Fortune
**Effect:** Shuffle remaining deck
```javascript
this.greatDeck.sort(() => Math.random() - 0.5);
```
- Randomize all remaining cards
- Display: "Shuffling the Great Deck..."
- Strategic: Counter High Priestess info / reset game

---

## 📊 Quick Comparison

| Card | Action | Effect |
|------|--------|--------|
| **Chariot** | Discard | Remove 1 card |
| **High Priestess** | Peek | See next card |
| **Wheel** | Shuffle | Randomize deck |

---

## 🎮 Game State

**Deck:** 3 Sun (extra turn) + 5 Moon (1 damage)
**Player HP:** 3
**Enemy HP:** 3

---

## 📋 Implementation Checklist
- [x] Map card to its effect (checkCardClick method)
- [x] Apply effect to game state (deck modifications)
- [ ] Handle edge cases (stacking, chaining)
- [ ] Tests completed
- [ ] Team review

## 📎 Related Resources
https://www.slashskill.com/how-to-build-a-card-game-in-godot-4-deckbuilder-systems-from-scratch/

# Voya - travel tracker ⛰️

Voya is a website that allows users to register, track, and share their travel experiences. You can create a profile, add destinations, save notes, view your travel progress and interests, and edit your personal information. The goal is to make travel planning easier, preserve memories, and share experiences with friends.

## Main Features
- User registration and login
- Profile editing (name, email, photo, about me, interests)
- Add, edit, and remove trips/destinations
- View travel progress
- City and country suggestions
- Modern and responsive interface

## APIs Used
- [json-server](https://github.com/typicode/json-server): Local API for storing user data, trips, interests, etc. (db.json file)
- [REST Countries API](https://restcountries.com/): To get country lists, names, codes, and flags
- [Wikidata SPARQL](https://query.wikidata.org/): To suggest cities for each country
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page): To fetch images for destinations

## How to Start the Project

1. Install project dependencies (npm/pnpm install)
2. Start the local API:

	npx json-server --watch db.json --port 3001

3. Start the frontend (npm run dev or pnpm run dev)

---

## Technologies Used
- Vue.js
- Pinia (state management)
- Vite
- json-server
- Modern CSS

## Developed by:
This project is being developed for the Web Programming 1 course, part of the Bachelor’s in Technologies and Information Systems for the Web at Escola Superior em Media Artes e Design.
- Pedro Rodrigues
- Mariana Ferreira
- Miguel Caldas

# SERVER  

Zawiera dane postów. Jest wykorzystywany w projekcie **[Blog App](https://github.com/captainSaymon/app-blog)**.  

## Konfiguracja  

Dodać do pliku `.env` zmienne:  
   - `PORT`  
   - `MONGODB_URI`  

Zainstalować zależności **(node modules)**:  
```bash
npm install
```

## Utworzenie bazy danych na Atlas MongoDB

Zaloguj/zarejestruj się na **[MongoDB](https://www.mongodb.com/atlas)** Atlas ponieważ jej chmurowa wersja MongoDB, umożliwi zarządzanie bazami danych

## Uruchomienie servera  

Aby uruchomić serwer w trybie watch, wpisz:

```bash
npm run watch
```
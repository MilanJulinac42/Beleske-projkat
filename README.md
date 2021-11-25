# Beleske-projkat

## Biblioteke

1. express
2. cookie-parser
3. dotenv
4. express-mongo-sanitize
5. helmet
6. jsonwebtoken
7. mongoose
8. node-schedule
9. node-mailer
10. xss-clean

## Bezbednost

- NoSql injection
- Dodatni header-i
- Cross site scripting


## Pokretanje
### Komande koje imate na raspolaganju:

```
node initialise -delete
node initialise -import
npm run dev
```

1. *Prva opcija brise sve podatke iz baze podataka*
2. *Druga opcija importuje vec spremljene podatke u bazu*
3. *Treca opcija pokrece server*

### Nakon pokretanja aplikacije

1. Aplikacija se povezuje na cloud bazu podataka
2. "scheduleHandler" funkcija je odgovorna za pokretanje tajmera za svaku belesku koji kada istekne salje mail-ove
3. Ucitavam razne middleware-ove
4. Pokrecem server na port koji stoji u .env fajlu

### Validacija
- Imam kompletnu validaciju, u samim modelima kao i nesto u kontrolerima(potvrda lozinke).
- Napravio sam ErrorHandler koji kao parametre prima status kod i error poruku.

### Autentifikacija
- Implementirao sam autentifikaciju - protect middleware, korisnik kada se uloguje, njegov Bearer token se skladisti u header
- Zasticenim rutama nije moguce pristupiti ako korisnik nije ulogovan i ako korisnik pokusa da pristupi necemu cemu nema prava(beleska ili profil drugog korisnika) nece moci

### Slanje maila
- Kada se napravi nova beleske ili kada se izmeni stara, kreiram novi zahtev za slanje maila koji se posalje kada istekne datum koji je unesen u bazu podataka
- Koristio sam Mailtrap kao host, podaci o mail servisu su u .env fajlu

### Lozinka
- Lozinka se hashuje i tako se upisuje u bazu podataka

# Dokumentaciju o rutama mozete videti u Postman kolekciji, .env fajl cu proslediti putem email-a

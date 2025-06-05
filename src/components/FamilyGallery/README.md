# System Galerii Rodzinnej

## Opis
Kompletny system galerii rodzinnej zintegrowany z aplikacją pamiętnika rodzinnego. Umożliwia upload, organizację i zarządzanie zdjęciami rodzinnymi.

## Funkcjonalności

### ✅ Zaimplementowane
1. **FamilyGallery.js** - Główny komponent galerii
   - System nawigacji z przyciskami powrotu, wyszukiwania, filtrów
   - Zarządzanie stanami (zdjęcia, albumy, widoki, filtry)
   - Integracja z localStorage dla persistencji danych
   - Domyślne albumy (Rodzina, Wydarzenia, Święta, Podróże)
   - Przełączanie między widokiem siatki i listy
   - System filtrowania po albumach i wyszukiwaniu

2. **PhotoUpload.js** - Komponent uploadu zdjęć
   - Drag & drop interface z wizualnym feedbackiem
   - Dwuetapowy proces: wybór plików → dodanie szczegółów
   - Formularz z polami: tytuł, opis, album, data, tagi, osoby
   - Obsługa multiple files z automatycznym numerowaniem
   - Przetwarzanie plików do base64 dla localStorage
   - Walidacja typów plików (tylko obrazy)

3. **PhotoGrid.js** - Komponent wyświetlania zdjęć
   - Responsywna siatka z aspect-ratio
   - Widok listy z rozszerzonymi informacjami
   - Overlay z informacjami o albumie i dacie
   - Hover effects z animacjami
   - Wskaźniki tagów i osób
   - Obsługa kliknięć do otwierania modalu

4. **PhotoModal.js** - Modal szczegółów zdjęcia
   - Pełnoekranowy viewer z nawigacją klawiatury
   - Tryb edycji z formularzem in-place
   - Funkcje: polubienie, pobieranie, usuwanie
   - Zarządzanie tagami i osobami w trybie edycji
   - Nawigacja między zdjęciami (poprzednie/następne)
   - Responsywny sidebar z animacjami

5. **AlbumManager.js** - Zarządzanie albumami
   - Tworzenie, edycja i usuwanie albumów niestandardowych
   - Ochrona domyślnych albumów
   - Automatyczne przenoszenie zdjęć przy usuwaniu albumów
   - Interfejs z formularzami i walidacją

6. **Integracja z App.js**
   - Dodanie galerii do głównej nawigacji
   - Przycisk Camera w HeaderButtons
   - Routing do widoku galerii
   - Wsparcie dla ciemnego motywu

## Instrukcja użytkowania

### Dostęp do galerii
1. Uruchom aplikację
2. W górnym prawym rogu kliknij ikonę aparatu 📷
3. Galeria otworzy się w nowym widoku

### Dodawanie zdjęć
1. Kliknij "Dodaj zdjęcia" lub drag & drop pliki
2. Wypełnij formularz z informacjami o zdjęciu
3. Wybierz album, dodaj tagi i osoby
4. Zapisz zdjęcie

### Organizacja
1. Twórz albumy tematyczne w AlbumManager
2. Używaj filtrów do wyszukiwania
3. Przełączaj między widokiem siatki i listy
4. Edytuj metadane zdjęć

### Funkcje testowe
- **Double-click na tytuł "Galeria Rodzinna"** - dodaje przykładowe zdjęcia do testowania

## Struktura plików
```
src/components/FamilyGallery/
├── FamilyGallery.js      # Główny komponent
├── PhotoUpload.js        # Upload modal
├── PhotoGrid.js          # Wyświetlanie siatki
├── PhotoModal.js         # Viewer/editor
└── AlbumManager.js       # Zarządzanie albumami
```

## Dane localStorage
- `familyGallery-photos` - zdjęcia z metadanymi
- `familyGallery-albums` - konfiguracja albumów

## Integracja
System przygotowany do integracji z:
- **FamilyTimeline** - łączenie zdjęć z eventami
- **FamilyTreeView** - łączenie zdjęć z osobami
- **Pozostałe komponenty** - współdzielenie danych rodzinnych

## Status: ✅ GOTOWE
System galerii rodzinnej jest w pełni funkcjonalny i zintegrowany z aplikacją.

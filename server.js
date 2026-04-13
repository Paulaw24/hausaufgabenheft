const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'aufgaben.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Aufgaben laden
function loadAufgaben() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return [];
}

// Aufgaben speichern
function saveAufgaben(aufgaben) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(aufgaben, null, 2), 'utf8');
}

// GET - Alle Aufgaben laden
app.get('/api/aufgaben', (req, res) => {
    const aufgaben = loadAufgaben();
    res.json(aufgaben);
});

// POST - Neue Aufgabe hinzufügen
app.post('/api/aufgaben', (req, res) => {
    const aufgaben = loadAufgaben();
    const newAufgabe = {
        id: Date.now(),
        ...req.body
    };
    aufgaben.push(newAufgabe);
    saveAufgaben(aufgaben);
    res.json(newAufgabe);
});

// PUT - Aufgabe aktualisieren
app.put('/api/aufgaben/:id', (req, res) => {
    let aufgaben = loadAufgaben();
    aufgaben = aufgaben.map(a => a.id == req.params.id ? { ...a, ...req.body } : a);
    saveAufgaben(aufgaben);
    res.json({ success: true });
});

// DELETE - Aufgabe löschen
app.delete('/api/aufgaben/:id', (req, res) => {
    let aufgaben = loadAufgaben();
    aufgaben = aufgaben.filter(a => a.id != req.params.id);
    saveAufgaben(aufgaben);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
    console.log(`Öffne http://localhost:${PORT} im Browser`);
});

// db.js — IndexedDB: abre la BD y expone helpers para entrenadores y equipos

const DB_NAME = "pokedexDB";
const DB_VERSION = 1;

let db;

function abrirDB() {
    return new Promise((resolve, reject) => {
        if (db) { resolve(db); return; }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Se ejecuta solo cuando se crea o actualiza la versión
        request.onupgradeneeded = function (e) {
            const database = e.target.result;

            if (!database.objectStoreNames.contains("entrenadores")) {
                const storeE = database.createObjectStore("entrenadores", {
                    keyPath: "id",
                    autoIncrement: true
                });
                storeE.createIndex("nombre", "nombre", { unique: false });
            }

            if (!database.objectStoreNames.contains("equipos")) {
                const storeQ = database.createObjectStore("equipos", {
                    keyPath: "id",
                    autoIncrement: true
                });
                storeQ.createIndex("nombre", "nombre", { unique: false });
            }
        };

        request.onsuccess = function (e) {
            db = e.target.result;
            resolve(db);
        };

        request.onerror = function (e) {
            reject(e.target.error);
        };
    });
}

// ─── ENTRENADORES ────────────────────────────────────────────────────────────

function agregarEntrenador(entrenador) {
    return abrirDB().then(database => {
        return new Promise((resolve, reject) => {
            const tx = database.transaction("entrenadores", "readwrite");
            const store = tx.objectStore("entrenadores");
            const req = store.add(entrenador);
            req.onsuccess = () => resolve(req.result);
            req.onerror  = () => reject(req.error);
        });
    });
}

function obtenerEntrenadores() {
    return abrirDB().then(database => {
        return new Promise((resolve, reject) => {
            const tx = database.transaction("entrenadores", "readonly");
            const store = tx.objectStore("entrenadores");
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror  = () => reject(req.error);
        });
    });
}

function obtenerEntrenadorPorId(id) {
    return abrirDB().then(database => {
        return new Promise((resolve, reject) => {
            const tx = database.transaction("entrenadores", "readonly");
            const store = tx.objectStore("entrenadores");
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror  = () => reject(req.error);
        });
    });
}

// ─── EQUIPOS ─────────────────────────────────────────────────────────────────

function agregarEquipo(equipo) {
    return abrirDB().then(database => {
        return new Promise((resolve, reject) => {
            const tx = database.transaction("equipos", "readwrite");
            const store = tx.objectStore("equipos");
            const req = store.add(equipo);
            req.onsuccess = () => resolve(req.result);
            req.onerror  = () => reject(req.error);
        });
    });
}

function obtenerEquipos() {
    return abrirDB().then(database => {
        return new Promise((resolve, reject) => {
            const tx = database.transaction("equipos", "readonly");
            const store = tx.objectStore("equipos");
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror  = () => reject(req.error);
        });
    });
}

function obtenerEquipoPorId(id) {
    return abrirDB().then(database => {
        return new Promise((resolve, reject) => {
            const tx = database.transaction("equipos", "readonly");
            const store = tx.objectStore("equipos");
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror  = () => reject(req.error);
        });
    });
}

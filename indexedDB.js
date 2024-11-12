// Cek apakah IndexedDB didukung oleh browser
if (!('indexedDB' in window)) {
  console.log("Browser ini tidak mendukung IndexedDB.");
} else {
  // Membuat atau membuka database
  const request = indexedDB.open("PortfolioDB", 1);

  // Event jika versi database berubah (misalnya, saat pertama kali dibuat)
  request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Membuat object store (semacam tabel) jika belum ada
    if (!db.objectStoreNames.contains("projects")) {
      const projectStore = db.createObjectStore("projects", { keyPath: "id", autoIncrement: true });
      projectStore.createIndex("title", "title", { unique: false });
      console.log("Object store 'projects' dibuat.");
    }
  };

  // Event saat database dibuka
  request.onsuccess = function(event) {
    console.log("Database berhasil dibuka.");
    const db = event.target.result;

    // Contoh memasukkan data
    const transaction = db.transaction("projects", "readwrite");
    const projectStore = transaction.objectStore("projects");

    projectStore.add({ title: "Portfolio Project", description: "Contoh proyek di portfolio" });
    transaction.oncomplete = function() {
      console.log("Data berhasil ditambahkan ke IndexedDB.");
    };
  };

  // Event jika ada error
  request.onerror = function(event) {
    console.error("Gagal membuka database:", event.target.errorCode);
  };
}
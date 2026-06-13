import type { QuestionAttempt, QuestionProgress } from "./types";

export const STUDY_PROGRESS_DB_NAME = "knou-study-progress";
export const STUDY_PROGRESS_DB_VERSION = 1;
export const QUESTION_PROGRESS_STORE = "questionProgress";
export const QUESTION_ATTEMPTS_STORE = "questionAttempts";

type StoreName = typeof QUESTION_PROGRESS_STORE | typeof QUESTION_ATTEMPTS_STORE;

let dbPromise: Promise<IDBDatabase> | null = null;

export function canUseIndexedDb() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

export function openStudyProgressDb() {
  if (!canUseIndexedDb()) {
    return Promise.reject(new Error("IndexedDB is not available in this environment."));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(STUDY_PROGRESS_DB_NAME, STUDY_PROGRESS_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(QUESTION_PROGRESS_STORE)) {
        const progressStore = db.createObjectStore(QUESTION_PROGRESS_STORE, {
          keyPath: "questionId",
        });
        progressStore.createIndex("source", "source", { unique: false });
        progressStore.createIndex("subjectSlug", "subjectSlug", { unique: false });
        progressStore.createIndex("retryState", "retryState", { unique: false });
        progressStore.createIndex("bookmarked", "bookmarked", { unique: false });
        progressStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }

      if (!db.objectStoreNames.contains(QUESTION_ATTEMPTS_STORE)) {
        const attemptsStore = db.createObjectStore(QUESTION_ATTEMPTS_STORE, {
          keyPath: "id",
        });
        attemptsStore.createIndex("questionId", "questionId", { unique: false });
        attemptsStore.createIndex("source", "source", { unique: false });
        attemptsStore.createIndex("subjectSlug", "subjectSlug", { unique: false });
        attemptsStore.createIndex("answeredAt", "answeredAt", { unique: false });
      }
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error ?? new Error("Failed to open study progress database."));
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
  });

  return dbPromise;
}

function transaction(storeNames: StoreName[], mode: IDBTransactionMode) {
  return openStudyProgressDb().then((db) => db.transaction(storeNames, mode));
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getByKey<T>(storeName: StoreName, key: IDBValidKey) {
  const tx = await transaction([storeName], "readonly");
  return requestToPromise<T | undefined>(tx.objectStore(storeName).get(key));
}

export async function getAllFromStore<T>(storeName: StoreName) {
  const tx = await transaction([storeName], "readonly");
  return requestToPromise<T[]>(tx.objectStore(storeName).getAll());
}

export async function putRecord<T>(storeName: StoreName, record: T) {
  const tx = await transaction([storeName], "readwrite");
  await requestToPromise(tx.objectStore(storeName).put(record));
}

export async function deleteRecord(storeName: StoreName, key: IDBValidKey) {
  const tx = await transaction([storeName], "readwrite");
  await requestToPromise(tx.objectStore(storeName).delete(key));
}

export async function clearStore(storeName: StoreName) {
  const tx = await transaction([storeName], "readwrite");
  await requestToPromise(tx.objectStore(storeName).clear());
}

export async function replaceAllStudyProgress(progress: QuestionProgress[], attempts: QuestionAttempt[]) {
  const tx = await transaction([QUESTION_PROGRESS_STORE, QUESTION_ATTEMPTS_STORE], "readwrite");
  tx.objectStore(QUESTION_PROGRESS_STORE).clear();
  tx.objectStore(QUESTION_ATTEMPTS_STORE).clear();

  await Promise.all([
    ...progress.map((item) => requestToPromise(tx.objectStore(QUESTION_PROGRESS_STORE).put(item))),
    ...attempts.map((item) => requestToPromise(tx.objectStore(QUESTION_ATTEMPTS_STORE).put(item))),
  ]);
}

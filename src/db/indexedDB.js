export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskMasterDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// export const addTaskToDB = async (task) => {
//   const db = await openDB();
//   const tx = db.transaction("tasks", "readwrite");
//   const store = tx.objectStore("tasks");
//   store.add(task);
//   return tx.complete;
// };

export const addTaskToDB = async (task) => {
  const db = await openDB();

  const taskToStore = { ...task };

  return new Promise((resolve, reject) => {
    if (task.image instanceof File) {
      const reader = new FileReader();

      reader.onload = () => {
        taskToStore.imageBlob = reader.result;
        delete taskToStore.image;

        // 🔄 نفتح الـ transaction هنا بعد ما تجهز الصورة
        const tx = db.transaction("tasks", "readwrite");
        const store = tx.objectStore("tasks");

        store.add(taskToStore);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(task.image);
    } else {
      const tx = db.transaction("tasks", "readwrite");
      const store = tx.objectStore("tasks");
      store.add(taskToStore);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    }
  });
};

export const getAllTasksFromDB = async () => {
  const db = await openDB();
  const tx = db.transaction("tasks", "readonly");
  const store = tx.objectStore("tasks");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// db/indexedDB.js

export const deleteTaskFromDB = async (taskId) => {
  const db = await openDB();
  const tx = db.transaction("tasks", "readwrite");
  const store = tx.objectStore("tasks");
  store.delete(taskId);
  return tx.complete;
};

export async function clearAllTasksFromDB() {
  const db = await openDB();
  const tx = db.transaction("tasks", "readwrite");
  const store = tx.objectStore("tasks");
  await store.clear();
  await tx.done;
}

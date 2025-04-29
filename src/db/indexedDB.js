export const openDB = () => {
  return new Promise((resolve, reject) => {
    //We tell the browser to open a database with this name.
    const request = indexedDB.open("TaskMasterDB", 1);

    //When the database is opened, whether it's the first time we've done so, or if we've changed the version number (for example, version 1 became version 2), this onupgradeneeded event will be fired.
    request.onupgradeneeded = (event) => {
      //Here we get the result from the request, and the result is the open database itself.
      const db = event.target.result;
      if (!db.objectStoreNames.contains("tasks")) {
        //creates a data store (such as a table). "tasks": اسم المخزن (object store).
        //keyPath: "id" means that every record in this store must have a primary key named id.
        //autoIncrement: true means if you do not provide an id manually, the db will generate one automatically (1, 2, 3, etc).
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      }
    };

    //After the opening succeeds (request.onsuccess), it gives us db, which is the database itself that was opened.
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const addTaskToDB = async (task) => {
  //We made a connection to the IndexedDB database via the openDB() function and waited for it to open.
  const db = await openDB();
  //We copied the task into a new variable called taskToStore using the spread operator so we could modify it as we pleased without changing the original version of the task.
  const taskToStore = { ...task };

  //FileReader does not support async/await directly, so new promise is used.
  return new Promise((resolve, reject) => {
    //Does the task contain an image? Is this image a real file type (meaning the user uploaded an image from their device)?
    if (task.image instanceof File) {
      //We created a FileReader object so we can read the image.
      const reader = new FileReader();
      //If the reader successfully reads the image, it will execute this internal code.
      reader.onload = () => {
        //We store the read image data (as a Base64 String) inside a new variable in the task named imageBlob.
        taskToStore.imageBlob = reader.result;
        //We removed the original image from the task so we wouldn't add it to the database (because we don't need the file itself, we just need its data).
        delete taskToStore.image;

        // We opened a transaction in read/write mode and fetched the task table.
        const tx = db.transaction("tasks", "readwrite");
        //Open the "tasks" table so I can work with it (add data, update data, delete data...).
        const store = tx.objectStore("tasks");

        store.add(taskToStore);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(task.image); //We tell the FileReader to "Read the file (image) in task.image, and convert it to a Data URL (base64 format), which is a text representation of the file." After the conversion is complete, the function we wrote above reader.onload will run and put the result of the reading (reader.result) into taskToStore.imageBlob.
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

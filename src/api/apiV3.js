/**
 * This file is used to define the API endpoints for the application.
 *
 * This will be a fake API, which will return the data from the local storage.
 *
 * Use the useApi hook to create the fake API object, passing the API tableName as the first argument.
 */

/**
 * useApi hook
 *
 * @param {string} tableName
 *
 * @example
 *
 * export const UserList = () => {
 *   const [users, setUsers] = useState([]);
 *   const usersApi = useApi('users');
 *
 *   useEffect(() => {
 *     const fetchData = async () => {
 *       const users = await usersApi.getAll();
 *      setUsers(users);
 *     };
 *
 *     fetchData();
 *   }, []);
 *
 *   return (
 *     <div>
 *       {users.map(user => (
 *         <div key={user.id}>
 *           <h1>{user.name}</h1>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 */
export const useApi = (tableName) => {
  return {
    /**
     * Get all items in the table
     *
     * @returns {Promise<object[]>}
     * @example
     * const usersApi = useApi('users');
     * const users = await usersApi.getAll();
     * console.log(users);
     * // Output: [{ id: '24530789', name: 'John Doe' }]
     */
    getAll: async () => {
      return getFromLocalStorageDB(tableName) || [];
    },
    /**
     * Get items grouped by field
     *
     * @param {string} field
     * @returns {Promise<object>}
     * @example
     * const usersApi = useApi('users');
     * const users = await usersApi.getAll();
     * console.log(users);
     * // Output: [{ id: '24530789', name: 'John Doe', isAdmin: true  }, { id: '24530790', name: 'Jane Doe', isAdmin: true }, { id: '24530791', name: 'James Doe', isAdmin: false }]
     * const users = await usersApi.getAllGroupedBy('isAdmin');
     * console.log(users);
     * // Output: { true: [{ id: '24530789', name: 'John Doe', isAdmin: true  }, { id: '24530790', name: 'Jane Doe', isAdmin: true }], false: [{ id: '24530791', name: 'James Doe', isAdmin: false }] }
     */
    getAllGroupedBy: async (field) => {
      const data = getFromLocalStorageDB(tableName) || [];
      return data.reduce((acc, d) => {
        if (!acc[d[field]]) {
          acc[d[field]] = [];
        }
        acc[d[field]].push(d);
        return acc;
      }, {});
    },
    /**
     * Get item by id
     *
     * @param {string} id
     * @returns {Promise<object>}
     * @example
     * const usersApi = useApi('users');
     * const user = await usersApi.getById('24530789');
     * console.log(user);
     * // Output: { id: '24530789', name: 'John Doe' }
     */
    getById: async (id) => {
      const data = getFromLocalStorageDB(tableName) || [];
      return data.find((d) => d.id === id);
    },
    /**
     * Get item by field
     *
     * @param {string} field
     * @param {string} value
     * @returns {Promise<object>}
     * @example
     * const usersApi = useApi('users');
     * const user = await usersApi.getByField('name', 'John Doe');
     * console.log(user);
     * // Output: { id: '24530789', name: 'John Doe' }
     */
    getByField: async (field, value) => {
      const data = getFromLocalStorageDB(tableName) || [];
      return data.find((d) => d[field] === value);
    },
    /**
     * Create item in the table
     *
     * @param {object} data
     * @returns {Promise<string>}
     * @example
     * const usersApi = useApi('users');
     * const newId = await usersApi.create({ name: 'John Doe' });
     * console.log(usersApi.getAll());
     * console.log(newId);
     * // Output: [{ id: '24530789', name: 'John Doe' }]
     * // Output: '24530789'
     */
    create: async (data) => {
      const id = String(Math.floor(Math.random() * 100000000));
      const items = getFromLocalStorageDB(tableName) || [];
      items.push({ id, ...data });
      saveToLocalStorageDB(tableName, items);
      return id;
    },
    /**
     * Bulk create items in the table
     *
     * @param {object[]} data
     * @returns {Promise<void>}
     * @example
     * const usersApi = useApi('users');
     * await usersApi.bulkCreate([{ name: 'John Doe' }, { name: 'Jane Doe' }]);
     * console.log(usersApi.getAll());
     * // Output: [{ id: '24530789', name: 'John Doe' }, { id: '24530790', name: 'Jane Doe' }]
     */
    bulkCreate: async (data) => {
      const items = getFromLocalStorageDB(tableName) || [];
      const newItems = data.map((d) => ({
        id: String(Math.floor(Math.random() * 100000000)),
        ...d,
      }));
      saveToLocalStorageDB(tableName, [...items, ...newItems]);
    },
    /**
     * Update item in the table
     *
     * @param {string} id
     * @param {object} data
     * @returns {Promise<void>}
     * @example
     * const usersApi = useApi('users');
     * await usersApi.create('24530789', { name: 'John Doe' });
     * console.log(usersApi.getAll());
     * // Output: [{ id: '24530789', name: 'John Doe' }]
     * await usersApi.update('24530789', { name: 'Jane Doe' });
     * console.log(usersApi.getAll());
     * // Output: [{ id: '24530789', name: 'Jane Doe' }]
     */
    update: async (id, data) => {
      const items = getFromLocalStorageDB(tableName) || [];
      const index = items.findIndex((d) => d.id === id);
      items[index] = { id, ...data };
      saveToLocalStorageDB(tableName, items);
    },
    /**
     * Delete item from the table
     *
     * @param {string} id
     * @returns {Promise<void>}
     * @example
     * const usersApi = useApi('users');
     * await usersApi.create('24530789', { name: 'John Doe' });
     * console.log(usersApi.getAll());
     * // Output: [{ id: '24530789', name: 'John Doe' }]
     * await usersApi.delete('24530789');
     * console.log(usersApi.getAll());
     * // Output: []
     */
    delete: async (id) => {
      const items = getFromLocalStorageDB(tableName) || [];
      const newItems = items.filter((d) => d.id !== id);
      saveToLocalStorageDB(tableName, newItems);
    },
    /**
     * Delete all items in the table
     *
     * @returns {Promise<void>}
     * @example
     * const usersApi = useApi('users');
     * await usersApi.create('24530789', { name: 'John Doe' });
     * console.log(usersApi.getAll());
     * // Output: [{ id: '24530789', name: 'John Doe' }]
     * await usersApi.deleteAll();
     * console.log(usersApi.getAll());
     * // Output: []
     */
    deleteAll: async () => {
      saveToLocalStorageDB(tableName, []);
    },
  };
};

/**
 * Example of a real API endpoint implementation
 */

// export const getAllUsers = () => {
//   return fetch("http://localhost:3001/users")
//     .then((res) => res.json())
//     .then((data) => data);
// };

// export const addUser = (user) => {
//   return fetch("http://localhost:3001/users", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   })
//     .then((res) => res.json())
//     .then((data) => data);
// }

// export const updateUser = (user) => {
//   return fetch(`http://localhost:3001/users/${user.id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   })
//     .then((res) => res.json())
//     .then((data) => data);
// }

// export const deleteUser = (id) => {
//   return fetch(`http://localhost:3001/users/${id}`, {
//     method: "DELETE",
//   })
//     .then((res) => res.json())
//     .then((data) => data);
// }

// Local Storage Datebase functions
export const getFromLocalStorageDB = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const saveToLocalStorageDB = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// NOTE: Reset Local Storage from the console if needed
window.resetLocalStorage = () => {
  localStorage.clear();
};

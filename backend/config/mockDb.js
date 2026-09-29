const fs = require('fs');
const path = require('path');

const MOCK_DB_FILE = path.join(__dirname, '../mock-data.json');

let mockData = {
  users: [],
  jobs: [],
  applications: [],
  referrals: [],
  reviews: [],
  interviewExperiences: [],
  messages: [],
  notifications: [],
  companies: [],
  studentProfiles: [],
  recruiterProfiles: [],
  alumniProfiles: []
};

const loadMockData = () => {
  try {
    if (fs.existsSync(MOCK_DB_FILE)) {
      const data = fs.readFileSync(MOCK_DB_FILE, 'utf8');
      mockData = JSON.parse(data);
    }
  } catch (error) {
    console.log('No existing mock data found, starting fresh');
  }
};

const saveMockData = () => {
  try {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(mockData, null, 2));
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const mockQuery = (collection) => {
  return {
    find: (query = {}) => {
      let results = mockData[collection] || [];
      if (query && Object.keys(query).length > 0) {
        results = results.filter(item => {
          return Object.keys(query).every(key => {
            if (typeof query[key] === 'object' && query[key].$regex) {
              return new RegExp(query[key].$regex, query[key].$options || 'i').test(item[key]);
            }
            return item[key] === query[key];
          });
        });
      }
      return {
        sort: (sortObj) => {
          const key = Object.keys(sortObj)[0];
          const order = sortObj[key] === 1 ? 1 : -1;
          results.sort((a, b) => {
            if (a[key] < b[key]) return -1 * order;
            if (a[key] > b[key]) return 1 * order;
            return 0;
          });
          return {
            skip: (num) => {
              results = results.slice(num);
              return {
                limit: (limitNum) => {
                  results = results.slice(0, limitNum);
                  return {
                    populate: (field) => {
                      return {
                        then: (fn) => fn(results),
                        exec: () => results
                      };
                    },
                    then: (fn) => fn(results),
                    exec: () => results
                  };
                }
              };
            }
          };
        },
        populate: (field) => {
          return {
            then: (fn) => fn(results),
            exec: () => results
          };
        },
        then: (fn) => fn(results),
        exec: () => results
      };
    },
    findOne: (query) => {
      const results = mockData[collection] || [];
      const found = results.find(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
      });
      return {
        populate: (field) => {
          return {
            then: (fn) => fn(found),
            exec: () => found
          };
        },
        then: (fn) => fn(found),
        exec: () => found
      };
    },
    findById: (id) => {
      const results = mockData[collection] || [];
      const found = results.find(item => item._id === id);
      return {
        populate: (field) => {
          return {
            then: (fn) => fn(found),
            exec: () => found
          };
        },
        select: (fields) => {
          return {
            populate: (field) => {
              return {
                then: (fn) => fn(found),
                exec: () => found
              };
            },
            then: (fn) => fn(found),
            exec: () => found
          };
        },
        then: (fn) => fn(found),
        exec: () => found
      };
    },
    create: (data) => {
      const newItem = { _id: generateId(), ...data, createdAt: new Date(), updatedAt: new Date() };
      if (!mockData[collection]) mockData[collection] = [];
      mockData[collection].push(newItem);
      saveMockData();
      return {
        populate: (field) => {
          return {
            then: (fn) => fn(newItem),
            exec: () => newItem
          };
        },
        then: (fn) => fn(newItem),
        exec: () => newItem
      };
    },
    findByIdAndUpdate: (id, data, options) => {
      const results = mockData[collection] || [];
      const index = results.findIndex(item => item._id === id);
      if (index !== -1) {
        results[index] = { ...results[index], ...data, updatedAt: new Date() };
        saveMockData();
        return {
          populate: (field) => {
            return {
              then: (fn) => fn(results[index]),
              exec: () => results[index]
            };
          },
          then: (fn) => fn(results[index]),
          exec: () => results[index]
        };
      }
      return {
        then: (fn) => fn(null),
        exec: () => null
      };
    },
    findByIdAndDelete: (id) => {
      const results = mockData[collection] || [];
      const index = results.findIndex(item => item._id === id);
      if (index !== -1) {
        const deleted = results.splice(index, 1)[0];
        saveMockData();
        return {
          then: (fn) => fn(deleted),
          exec: () => deleted
        };
      }
      return {
        then: (fn) => fn(null),
        exec: () => null
      };
    },
    deleteMany: (query) => {
      let results = mockData[collection] || [];
      if (query && Object.keys(query).length > 0) {
        results = results.filter(item => {
          return !Object.keys(query).every(key => item[key] === query[key]);
        });
      } else {
        results = [];
      }
      mockData[collection] = results;
      saveMockData();
      return {
        then: (fn) => fn({ deletedCount: 1 }),
        exec: () => ({ deletedCount: 1 })
      };
    },
    countDocuments: (query) => {
      let results = mockData[collection] || [];
      if (query && Object.keys(query).length > 0) {
        results = results.filter(item => {
          return Object.keys(query).every(key => item[key] === query[key]);
        });
      }
      return {
        then: (fn) => fn(results.length),
        exec: () => results.length
      };
    }
  };
};

loadMockData();

module.exports = { mockQuery, mockData, saveMockData, loadMockData };
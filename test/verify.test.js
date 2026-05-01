const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function runScriptAndReturnRows(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

describe('SQL SELECT exercise', () => {
  let db;
  let scriptPath;

  beforeAll(async () => {
    const dbPath = path.resolve(__dirname, '..', 'lesson30.db');
    db = new sqlite3.Database(dbPath);
    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

  test('Should select stores with revenue greater than the average', async () => {
    const studentRows = await runScriptAndReturnRows(db, scriptPath);

    const avgRevenue = await new Promise((resolve, reject) => {
      db.get("SELECT AVG(REVENUE) AS avgRevenue FROM Stores", (err, row) => {
        if (err) reject(err);
        else resolve(row.avgRevenue);
      });
    });

    studentRows.forEach(row => {
      expect(parseFloat(row.REVENUE)).toBeGreaterThan(avgRevenue);
    });
  });
});


const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const assignments = [
      {
        id: 1,
        title: "Find High Salary Employees",
        description: "List all employees earning more than 50,000",
        difficulty: "Easy",
        sampleTables: [
          {
            tableName: "employees",
            columns: [
              { columnName: "id", dataType: "INTEGER" },
              { columnName: "name", dataType: "TEXT" },
              { columnName: "salary", dataType: "INTEGER" },
              { columnName: "department", dataType: "TEXT" }
            ],
            rows: [
              { id: 1, name: "Alice", salary: 45000, department: "HR" },
              { id: 2, name: "Bob", salary: 60000, department: "Engineering" },
              { id: 3, name: "Charlie", salary: 75000, department: "Engineering" },
              { id: 4, name: "Diana", salary: 48000, department: "Sales" }
            ]
          }
        ]
      }
    ];

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const { connectMongoDB, getDB } = require('../config/database');

const sampleAssignments = [
  {
    title: "Find High Salary Employees",
    difficulty: "Easy",
    description: "List all employees earning more than 50,000",
    question: "List all employees earning more than 50,000",
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
  },
  {
    title: "Department-wise Employee Count",
    difficulty: "Medium",
    description: "Find the number of employees in each department",
    question: "Find the number of employees in each department",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "department", dataType: "TEXT" }
        ],
        rows: [
          { id: 1, name: "Alice", department: "HR" },
          { id: 2, name: "Bob", department: "Engineering" },
          { id: 3, name: "Charlie", department: "Engineering" },
          { id: 4, name: "Diana", department: "Sales" },
          { id: 5, name: "Eve", department: "Sales" }
        ]
      }
    ]
  },
  {
    title: "Total Order Value per Customer",
    difficulty: "Medium",
    description: "Find total order value for each customer using JOIN",
    question: "Find total order value for each customer using JOIN",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" }
        ],
        rows: [
          { id: 1, name: "Aman" },
          { id: 2, name: "Saurabh" }
        ]
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "amount", dataType: "REAL" }
        ],
        rows: [
          { id: 1, customer_id: 1, amount: 1200.5 },
          { id: 2, customer_id: 1, amount: 800.0 },
          { id: 3, customer_id: 2, amount: 1500.0 }
        ]
      }
    ]
  },
  {
    title: "Highest Paid Employee",
    difficulty: "Hard",
    description: "Find the employee(s) with the highest salary (may be multiple)",
    question: "Find the employee(s) with the highest salary (may be multiple)",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "salary", dataType: "INTEGER" }
        ],
        rows: [
          { id: 1, name: "Alice", salary: 70000 },
          { id: 2, name: "Bob", salary: 85000 },
          { id: 3, name: "Charlie", salary: 85000 }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await connectMongoDB();
    const db = getDB();
    const collection = db.collection('assignments');
    await collection.deleteMany({});
    console.log('Cleared existing assignments');
    const result = await collection.insertMany(sampleAssignments);
    console.log(`Inserted ${result.insertedCount} assignments`);
    console.log('Seed completed!');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
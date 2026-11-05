import AddEmployee from './components/AddEmployee'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5166/api/employees'

function App() {

  

  const [showForm, setShowForm] = useState(false)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingEmployee, setEditingEmployee] = useState(null)


  const handleAddEmployee = async (employeeData) => {
  const response = await axios.post(API_URL, employeeData)

  setEmployees(previousEmployees => [
    ...previousEmployees,
    response.data
  ])
}

const handleDeleteEmployee = async (id) => {
  console.log("Delete clicked. Employee ID:", id)

  if (!window.confirm('Are you sure you want to delete this employee?')) {
    return
  }

  try {
    await axios.delete(`${API_URL}/${id}`)

    setEmployees(previousEmployees =>
      previousEmployees.filter(emp => emp.employeeId !== id)
    )

  } catch (error) {
    console.error("Delete API Error:", error)
    alert('Unable to delete employee. Please try again.')
  }
}

const handleUpdateEmployee = async (employeeData) => {
  const id = editingEmployee.employeeId

  const updatedData = {
    ...employeeData,
    employeeId: id
  }

  await axios.put(`${API_URL}/${id}`, updatedData)

  setEmployees(previousEmployees =>
    previousEmployees.map(emp =>
      emp.employeeId === id ? updatedData : emp
    )
  )

  setEditingEmployee(null)
  setShowForm(false)
}

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setEmployees(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('API Error:', error)
        setError('Unable to load employees. Please check the API server.')
        setLoading(false)
      })
  }, [])

  const activeEmployees = employees.filter(emp => emp.isActive)
  const departments = [...new Set(
    employees.map(emp => emp.department).filter(Boolean)
  )]

  const averageSalary = employees.length
    ? employees.reduce((total, emp) => total + (emp.salary || 0), 0) / employees.length
    : 0

  const formatSalary = amount =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">EMS<span>.</span></h2>
        <p className="menu-title">MENU</p>

        <nav>
          <a href="#" className="active">Dashboard</a>
          <a href="#">Employees</a>
          <a href="#">Departments</a>
          <a href="#">Reports</a>
        </nav>

        <div className="sidebar-bottom">
          <p>Employee Management System</p>
          <small>Version 1.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back! Here's your organization overview.</p>
          </div>

          <div className="profile">
            <div className="avatar">VG</div>
            <span>Admin</span>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <p>Total Employees</p>
            <h1>{employees.length}</h1>
            <span>Registered employees</span>
          </div>

          <div className="stat-card">
            <p>Active Employees</p>
            <h1>{activeEmployees.length}</h1>
            <span>Currently active</span>
          </div>

          <div className="stat-card">
            <p>Departments</p>
            <h1>{departments.length}</h1>
            <span>Across organization</span>
          </div>

          <div className="stat-card">
            <p>Average Salary</p>
            <h1>{formatSalary(averageSalary)}</h1>
            <span>Monthly average</span>
          </div>
        </section>

        <section className="employee-section">
          <div className="section-header">
            <div>
              <h2>Recent Employees</h2>
              <p>Manage your organization's employees.</p>
            </div>

            <button
              className="add-button"
            onClick={() => setShowForm(true)}
>
  + Add Employee
</button>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <p>Loading employees...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.employeeId}>
                      <td>{emp.firstName} {emp.lastName}</td>
                      <td>{emp.department || '-'}</td>
                      <td>{emp.email}</td>
                      <td>{formatSalary(emp.salary || 0)}</td>
                      <td>
                        <span className="status">
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
  <button
    className="edit-button"
    onClick={() => {
      setEditingEmployee(emp)
      setShowForm(true)
    }}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => handleDeleteEmployee(emp.employeeId)}
  >
    Delete
  </button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
            </main>

      {showForm && (
  <AddEmployee
    key={editingEmployee?.employeeId ?? 'new'}
    onClose={() => {
      setShowForm(false)
      setEditingEmployee(null)
    }}
    onEmployeeAdded={
      editingEmployee ? handleUpdateEmployee : handleAddEmployee
    }
    initialData={editingEmployee}
  />
)}

    </div>
  )
}

export default App


import { useState } from 'react'

function AddEmployee({ onClose, onEmployeeAdded, initialData = null }) {
  const [formData, setFormData] = useState(
  initialData
    ? {
        ...initialData,
        salary: initialData.salary ?? '',
        joiningDate: initialData.joiningDate
          ? initialData.joiningDate.slice(0, 10)
          : ''
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        salary: '',
        joiningDate: '',
        isActive: true
      }
)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await onEmployeeAdded({
        ...formData,
        salary: Number(formData.salary),
        joiningDate: formData.joiningDate || null
      })

      onClose()
    } catch (error) {
      alert('Unable to add employee. Please try again.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="employee-modal">
        <div className="modal-header">
          <h2>Add New Employee</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="salary"
              placeholder="Monthly Salary"
              value={formData.salary}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            <label>
              Joining Date
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="add-button">
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployee

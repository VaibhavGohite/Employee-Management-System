using EmployeeAPI.Data;
using EmployeeAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly EmployeeDbContext _context;

    public EmployeesController(EmployeeDbContext context)
    {
        _context = context;
    }

    // GET: api/employees
    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _context.Employees.ToListAsync();
        return Ok(employees);
    }

    // GET: api/employees/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
            return NotFound();

        return Ok(employee);
    }

    // POST: api/employees
[HttpPost]
public async Task<IActionResult> CreateEmployee(Employee employee)
{
    _context.Employees.Add(employee);
    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetEmployee),
        new { id = employee.EmployeeId },
        employee
    );
}

// PUT: api/employees/1
[HttpPut("{id}")]
public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
{
    if (id != employee.EmployeeId)
        return BadRequest();

    var existingEmployee = await _context.Employees.FindAsync(id);

    if (existingEmployee == null)
        return NotFound();

    _context.Entry(existingEmployee).CurrentValues.SetValues(employee);
    await _context.SaveChangesAsync();

    return NoContent();
}

// DELETE: api/employees/1
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteEmployee(int id)
{
    var employee = await _context.Employees.FindAsync(id);

    if (employee == null)
        return NotFound();

    _context.Employees.Remove(employee);
    await _context.SaveChangesAsync();

    return NoContent();
}
}
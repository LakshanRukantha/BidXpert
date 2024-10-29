using BidXpert_Backend_API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;

namespace BidXpert_Backend_API.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CategoryController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("all")]
        public IActionResult ViewAllCategories()
        {
            List<Category> categories = new List<Category>();
            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Category", con);
                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    categories.Add(new Category
                    {
                        Category_id = Convert.ToInt32(row["Category_id"]),
                        Name = row["Name"].ToString(),
                        Value = row["Value"].ToString()
                    });
                }
            }

            var response = new Response();
            if (categories.Count > 0)
            {
                response.status = 200;
                response.message = "Categories retrieved successfully.";
                response.Data = categories;
                return Ok(response);
            }
            else
            {
                response.status = 404;
                response.message = "No categories found.";
                return NotFound(response);
            }
        }

        [HttpPost("add")]
        public IActionResult AddCategory([FromBody] Category category)
        {
            var response = new Response();

            if (string.IsNullOrWhiteSpace(category.Name))
            {
                response.status = 400;
                response.message = "Category Name is required.";
                return BadRequest(response);
            }

            if (string.IsNullOrWhiteSpace(category.Value) ||
                category.Value.Contains(" ") ||
                Regex.IsMatch(category.Value, @"^[^@\s]+@[^@\s]+\.[^@\s]+$")) 
            {
                response.status = 400;
                response.message = "Category Value must be a single word .";
                return BadRequest(response);
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "INSERT INTO Category (Name, Value) VALUES (@Name, @Value)";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Name", category.Name);
                        cmd.Parameters.AddWithValue("@Value", category.Value);

                        con.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            response.status = 200;
                            response.message = "Category added successfully.";
                            response.Data = category;
                            return Ok(response);
                        }
                        else
                        {
                            response.status = 400;
                            response.message = "Failed to add category.";
                            return BadRequest(response);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.status = 500;
                response.message = "Internal server error: " + ex.Message;
                return StatusCode(500, response);
            }
        }
    }
}
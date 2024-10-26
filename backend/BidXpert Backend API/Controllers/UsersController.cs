using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BidXpert_Backend_API.Models;

namespace BidXpert_Backend_API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UsersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        
        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            List<User> userList = new List<User>();
            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM [User]", con);
                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    userList.Add(new User
                    {
                        UserId = Convert.ToInt32(row["User_id"]),
                        Firstname = row["Firstname"].ToString(),
                        Lastname = row["Lastname"].ToString(),
                        Email = row["Email"].ToString(),
                        RegDate = Convert.ToDateTime(row["Reg_date"]),
                        IsAdmin = Convert.ToBoolean(row["Is_admin"]),
                    });
                }
            }

            if (userList.Count == 0)
            {
                var response = new Response { status = 404, message = "No users found." };
                return NotFound(response);
            }
            var successResponse = new Response { status = 200, message = "Users retrieved successfully.", Data = userList };
            return Ok(successResponse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            User user = null; 
            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [User] WHERE User_id = @UserId", con);
                cmd.Parameters.AddWithValue("@UserId", id); 

                con.Open();
                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync()) 
                {
                    user = new User
                    {
                        UserId = Convert.ToInt32(reader["User_id"]),
                        Firstname = reader["Firstname"].ToString(),
                        Lastname = reader["Lastname"].ToString(),
                        Email = reader["Email"].ToString(),
                        RegDate = Convert.ToDateTime(reader["Reg_date"]),
                        IsAdmin = Convert.ToBoolean(reader["Is_admin"]),
                    };
                }
            }

            if (user == null) 
            {
                var response = new Response { status = 404, message = "User not found." };
                return NotFound(response);
            }

            var successResponse = new Response { status = 200, message = "User retrieved successfully.", Data = user };
            return Ok(successResponse);
        }
        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> SignupUser([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Firstname) ||
                string.IsNullOrWhiteSpace(user.Lastname) ||
                string.IsNullOrWhiteSpace(user.Email) ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new Response { status = 400, message = "All fields are required." });
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "INSERT INTO [User] (Firstname, Lastname, Email, Password) VALUES (@Firstname, @Lastname, @Email, @Password)";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Firstname", user.Firstname);
                        cmd.Parameters.AddWithValue("@Lastname", user.Lastname);
                        cmd.Parameters.AddWithValue("@Email", user.Email);
                        cmd.Parameters.AddWithValue("@Password", user.Password); 

                        con.Open();
                        int result = await cmd.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            var response = new Response { status = 200, message = "User added successfully." };
                            return Ok(response);
                        }
                        else
                        {
                            var response = new Response { status = 400, message = "Failed to add user." };
                            return BadRequest(response);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var response = new Response { status = 500, message = "Internal server error: " + ex.Message };
                return StatusCode(500, response);
            }
        }




        
       
    }


}

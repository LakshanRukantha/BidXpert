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
                SqlDataAdapter da = new SqlDataAdapter("SELECT User_id, Firstname,Lastname,Email,Reg_date,Is_admin FROM [User];", con);
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
                    string checkEmailQuery = "SELECT COUNT(1) FROM [User] WHERE Email = @Email";
                    using (SqlCommand checkCmd = new SqlCommand(checkEmailQuery, con))
                    {
                        checkCmd.Parameters.AddWithValue("@Email", user.Email);

                        con.Open();
                        int emailExists = (int)await checkCmd.ExecuteScalarAsync();
                        con.Close();

                        if (emailExists > 0)
                        {
                            return Conflict(new Response { status = 409, message = "User already exists with this email." });
                        }
                    }

                    string insertQuery = "INSERT INTO [User] (Firstname, Lastname, Email, Password, Reg_date, Is_admin) VALUES (@Firstname, @Lastname, @Email, @Password, @Reg_date, @Is_admin)";
                    using (SqlCommand cmd = new SqlCommand(insertQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@Firstname", user.Firstname);
                        cmd.Parameters.AddWithValue("@Lastname", user.Lastname);
                        cmd.Parameters.AddWithValue("@Email", user.Email);
                        cmd.Parameters.AddWithValue("@Password", user.Password);
                        cmd.Parameters.AddWithValue("@Reg_date", user.RegDate);
                        cmd.Parameters.AddWithValue("@Is_admin", user.IsAdmin);

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


        [HttpPost]
        [Route("signin")]
        public async Task<IActionResult> SignInUser([FromBody] User user)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                   
                    string query = "SELECT User_id, Email, Firstname, Lastname, Reg_date, Is_admin FROM [User] WHERE Email = @Email AND Password = @Password";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Email", user.Email);
                        cmd.Parameters.AddWithValue("@Password", user.Password);

                        con.Open();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (reader.Read())
                            {
                                var response = new
                                {
                                    UserId = reader.GetInt32(0),
                                    Email = reader.GetString(1),
                                    Firstname = reader.GetString(2),
                                    Lastname = reader.GetString(3),
                                    RegDate = reader.GetDateTime(4),
                                    IsAdmin = reader.GetBoolean(5)
                                };

                                return Ok(response);
                            }
                            else
                            {
                                var response = new Response { status = 401, message = "Login failed: incorrect email or password." };
                                return Unauthorized(response);
                            }
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



        [HttpPut]
        [Route("update{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {

            if (user.UserId != id)
            {
                return BadRequest(new Response { status = 400, message = "User ID in the body must match the ID in the URL." });
            }


            if (string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest(new Response { status = 400, message = "The Email field is required." });
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    var updates = new List<string>();
                    var parameters = new List<SqlParameter>();

                    if (!string.IsNullOrWhiteSpace(user.Firstname))
                    {
                        updates.Add("Firstname = @Firstname");
                        parameters.Add(new SqlParameter("@Firstname", user.Firstname));
                    }

                    if (!string.IsNullOrWhiteSpace(user.Lastname))
                    {
                        updates.Add("Lastname = @Lastname");
                        parameters.Add(new SqlParameter("@Lastname", user.Lastname));
                    }


                    updates.Add("Email = @Email");
                    parameters.Add(new SqlParameter("@Email", user.Email));

                    if (updates.Count == 0)
                    {
                        return BadRequest(new Response { status = 400, message = "At least one field must be updated." });
                    }

                    string query = $"UPDATE [User] SET {string.Join(", ", updates)} WHERE User_id = @UserId";
                    parameters.Add(new SqlParameter("@UserId", user.UserId));

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddRange(parameters.ToArray());

                        con.Open();
                        int result = await cmd.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            var response = new Response { status = 200, message = "User updated successfully." };
                            return Ok(response);
                        }
                        else
                        {
                            var response = new Response { status = 404, message = "User not found or no updates made." };
                            return NotFound(response);
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


        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "DELETE FROM [User] WHERE User_id = @UserId";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@UserId", id);

                        con.Open();
                        int result = await cmd.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            var response = new Response { status = 200, message = "User deleted successfully." };
                            return Ok(response);
                        }
                        else
                        {
                            var response = new Response { status = 404, message = "User not found." };
                            return NotFound(response);
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

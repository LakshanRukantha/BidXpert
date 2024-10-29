using BidXpert_Backend_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace BidXpert_Backend_API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public NotificationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("add")]
        public IActionResult AddNotification([FromBody] Notification notification)
        {
            var response = new Response();

            if (string.IsNullOrWhiteSpace(notification.Content) || string.IsNullOrWhiteSpace(notification.Type) || notification.UserId <= 0)
            {
                response.status = 400;
                response.message = "Content, Type, and valid User ID are required.";
                return BadRequest(response);
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "INSERT INTO Notification (Content, Type, User_id) VALUES (@Content, @Type, @UserId)";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Content", notification.Content);
                        cmd.Parameters.AddWithValue("@Type", notification.Type);
                        cmd.Parameters.AddWithValue("@UserId", notification.UserId);

                        con.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            response.status = 200;
                            response.message = "Notification added successfully.";
                            response.Data = notification;
                            return Ok(response);
                        }
                        else
                        {
                            response.status = 400;
                            response.message = "Failed to add notification.";
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

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


        [HttpGet("all/{id}")]
        public IActionResult GetAllNotificationsByUserId(int userId)
        {
            var response = new Response();
            List<Notification> notifications = new List<Notification>();

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Notification WHERE User_id = @UserId", con);
                    da.SelectCommand.Parameters.AddWithValue("@UserId", userId);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        notifications.Add(new Notification
                        {
                            NotificationId = Convert.ToInt32(row["Notification_id"]),
                            Content = row["Content"].ToString(),
                            SentDate = Convert.ToDateTime(row["Sent_date"]),
                            Type = row["Type"].ToString(),
                            Status = row["Status"].ToString(),
                            UserId = Convert.ToInt32(row["User_id"])
                        });
                    }
                }

                if (notifications.Count > 0)
                {
                    response.status = 200;
                    response.message = "Notifications retrieved successfully.";
                    response.Data = notifications;
                    return Ok(response);
                }
                else
                {
                    response.status = 404;
                    response.message = "No notifications found for this user.";
                    return NotFound(response);
                }
            }
            catch (Exception ex)
            {
                response.status = 500;
                response.message = "Internal server error: " + ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteNotification(int notificationId)
        {
            var response = new Response();

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "DELETE FROM Notification WHERE Notification_id = @NotificationId";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@NotificationId", notificationId);

                        con.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            response.status = 200;
                            response.message = "Notification deleted successfully.";
                            return Ok(response);
                        }
                        else
                        {
                            response.status = 404;
                            response.message = "Notification not found.";
                            return NotFound(response);
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

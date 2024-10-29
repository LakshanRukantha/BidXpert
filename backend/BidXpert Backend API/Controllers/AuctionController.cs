using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BidXpert_Backend_API.Models;
using System.Data.SqlClient;

namespace BidXpert_Backend_API.Controllers
{
    [Route("api/auction")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuctionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAuctions()
        {
            List<Auction> auctionList = new List<Auction>();

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                string query = "SELECT a.*, u.Firstname AS ListerName,c.Name AS CategoryName FROM Auction a " +
                               "JOIN [User] u ON a.User_id = u.User_id " +
                               "JOIN Category c ON a.Category_id = c.Category_id";

                SqlDataAdapter da = new SqlDataAdapter(query, con);
                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    auctionList.Add(new Auction
                    {
                        Auction_id = Convert.ToInt32(row["Auction_id"]),
                        Name = row["Name"].ToString(),
                        Description = row["Description"].ToString(),
                        Start_bid = Convert.ToDecimal(row["Start_bid"]),
                        High_bid = Convert.ToDecimal(row["High_bid"]),
                        Image_url = row["Image_url"].ToString(),
                        Listed_on = Convert.ToDateTime(row["Listed_on"]),
                        End_date = Convert.ToDateTime(row["End_date"]),
                        Status = row["Status"].ToString(),
                        Lister_id = Convert.ToInt32(row["User_id"]),
                        Category_id = Convert.ToInt32(row["Category_id"]),
                        ListerName = row["ListerName"].ToString(),
                        CategoryName = row["CategoryName"].ToString()

                    });
                }
            }

            if (auctionList.Count == 0)
                return NotFound(new { status = 404, message = "No auctions found." });

            return Ok(new { status = 200, message = "Auctions retrieved successfully.", Data = auctionList });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuctionById(int id)
        {
            Auction auction = null;

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                string query = @"SELECT a.*, u.Firstname AS ListerName, c.Name AS CategoryName 
                         FROM Auction a 
                         JOIN [User] u ON a.User_id = u.User_id 
                         JOIN Category c ON a.Category_id = c.Category_id
                         WHERE a.Auction_id = @AuctionId";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@AuctionId", id);

                    con.Open();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            auction = new Auction
                            {
                                Auction_id = Convert.ToInt32(reader["Auction_id"]),
                                Name = reader["Name"].ToString(),
                                Description = reader["Description"].ToString(),
                                Start_bid = Convert.ToDecimal(reader["Start_bid"]),
                                High_bid = reader["High_bid"] as decimal?,
                                Image_url = reader["Image_url"].ToString(),
                                Listed_on = Convert.ToDateTime(reader["Listed_on"]),
                                End_date = Convert.ToDateTime(reader["End_date"]),
                                Status = reader["Status"].ToString(),
                                Lister_id = Convert.ToInt32(reader["User_id"]),
                                Category_id = Convert.ToInt32(reader["Category_id"]),
                                ListerName = reader["ListerName"].ToString(),
                                CategoryName = reader["CategoryName"].ToString()
                            };
                        }
                    }
                }
            }

            if (auction == null)
                return NotFound(new { status = 404, message = "Auction not found." });

            return Ok(new { status = 200, message = "Auction retrieved successfully.", Data = auction });
        }



        [HttpPost("add")]
        public async Task<IActionResult> AddAuction([FromBody] Auction auction)
        {   if (string.IsNullOrWhiteSpace(auction.Name) )
            { return BadRequest(new { status = 400, message = "Invalid Auction Name" }); 
            }
            if (auction.Start_bid <= 0 ||
                auction.Lister_id <= 0 ||
                auction.Category_id <= 0)
            {
                return BadRequest(new { status = 400, message = "Invalid auction data." });
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "INSERT INTO Auction (Name, Description, Start_bid, High_bid, Image_url, Listed_on, End_date, Status, User_id, Category_id) " +
                "VALUES (@Name, @Description, @Start_bid, @High_bid, @Image_url, @Listed_on, @End_date, @Status, @User_id, @Category_id)";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Name", auction.Name);
                        cmd.Parameters.AddWithValue("@Description", auction.Description);
                        cmd.Parameters.AddWithValue("@Start_bid", auction.Start_bid);
                        cmd.Parameters.AddWithValue("@High_bid", auction.High_bid);
                        cmd.Parameters.AddWithValue("@Image_url", auction.Image_url ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Listed_on", auction.Listed_on);
                        cmd.Parameters.AddWithValue("@End_date", auction.End_date);
                        cmd.Parameters.AddWithValue("@Status", auction.Status);
                        cmd.Parameters.AddWithValue("@User_id", auction.Lister_id);
                        cmd.Parameters.AddWithValue("@Category_id", auction.Category_id);

                        con.Open();
                        int result = await cmd.ExecuteNonQueryAsync();

                        if (result > 0)
                            return Ok(new { status = 200, message = "Auction added successfully." });

                        return BadRequest(new { status = 400, message = "Failed to add auction." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Internal server error: " + ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(int id, [FromBody] Auction auction)
        {
            
            if (id != auction.Auction_id)
            {
                return BadRequest(new { status = 400, message = "ID mismatch between URL and request body." });
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    
                    var updates = new List<string>();
                    var parameters = new List<SqlParameter>();

                   
                    if (!string.IsNullOrWhiteSpace(auction.Name))
                    {
                        updates.Add("Name = @Name");
                        parameters.Add(new SqlParameter("@Name", auction.Name));
                    }
                    if (!string.IsNullOrWhiteSpace(auction.Description))
                    {
                        updates.Add("Description = @Description");
                        parameters.Add(new SqlParameter("@Description", auction.Description));
                    }
                    if (auction.Start_bid > 0)
                    {
                        updates.Add("Start_bid = @Start_bid");
                        parameters.Add(new SqlParameter("@Start_bid", auction.Start_bid));
                    }
                    if (auction.High_bid.HasValue)
                    {
                        updates.Add("High_bid = @High_bid");
                        parameters.Add(new SqlParameter("@High_bid", auction.High_bid.Value));
                    }
                    if (!string.IsNullOrWhiteSpace(auction.Image_url))
                    {
                        updates.Add("Image_url = @Image_url");
                        parameters.Add(new SqlParameter("@Image_url", auction.Image_url));
                    }
                    if (auction.Listed_on != default(DateTime))
                    {
                        updates.Add("Listed_on = @Listed_on");
                        parameters.Add(new SqlParameter("@Listed_on", auction.Listed_on));
                    }
                    if (auction.End_date != default(DateTime))
                    {
                        updates.Add("End_date = @End_date");
                        parameters.Add(new SqlParameter("@End_date", auction.End_date));
                    }
                    if (!string.IsNullOrWhiteSpace(auction.Status))
                    {
                        updates.Add("Status = @Status");
                        parameters.Add(new SqlParameter("@Status", auction.Status));
                    }
                    if (auction.Lister_id > 0)
                    {
                        updates.Add("User_id = @User_id");
                        parameters.Add(new SqlParameter("@User_id", auction.Lister_id));
                    }
                    if (auction.Category_id > 0)
                    {
                        updates.Add("Category_id = @Category_id");
                        parameters.Add(new SqlParameter("@Category_id", auction.Category_id));
                    }

                   
                    if (updates.Count == 0)
                    {
                        return BadRequest(new { status = 400, message = "At least one field must be updated." });
                    }

                    
                    string query = $"UPDATE Auction SET {string.Join(", ", updates)} WHERE Auction_id = @Auction_id";
                    parameters.Add(new SqlParameter("@Auction_id", id));

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddRange(parameters.ToArray());

                        con.Open();
                        int result = await cmd.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            return Ok(new { status = 200, message = "Auction updated successfully." });
                        }
                        else
                        {
                            return NotFound(new { status = 404, message = "Auction not found." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Internal server error: " + ex.Message });
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "DELETE FROM Auction WHERE Auction_id = @AuctionId";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@AuctionId", id);

                        con.Open();
                        int result = await cmd.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            var response = new { status = 200, message = "Auction deleted successfully." };
                            return Ok(response);
                        }
                        else
                        {
                            var response = new { status = 404, message = "Auction not found." };
                            return NotFound(response);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var response = new { status = 500, message = "Internal server error: " + ex.Message };
                return StatusCode(500, response);
            }
        }

    }
}


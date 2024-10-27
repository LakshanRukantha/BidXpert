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

        // GET: api/auction/all
[HttpGet("all")]
public async Task<IActionResult> GetAllAuctions()
{
    List<Auction> auctionList = new List<Auction>();

    using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
    {
        string query = "SELECT a.*, u.Firstname AS UserName, c.Name AS CategoryName FROM Auction a " +
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
                User_id = Convert.ToInt32(row["User_id"]),
                Category_id = Convert.ToInt32(row["Category_id"]),
                
                // Populating new fields for user and category details
                UserName = row["UserName"].ToString(),
                CategoryName = row["CategoryName"].ToString()

            });
        }
    }

    if (auctionList.Count == 0)
        return NotFound(new { status = 404, message = "No auctions found." });

    return Ok(new { status = 200, message = "Auctions retrieved successfully.", Data = auctionList });
}

        // POST: api/auction/add
        [HttpPost("add")]
        public async Task<IActionResult> AddAuction([FromBody] Auction auction)
        {
            if (string.IsNullOrWhiteSpace(auction.Name) ||
                auction.Start_bid <= 0 ||
                auction.User_id <= 0 || 
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
                        cmd.Parameters.AddWithValue("@User_id", auction.User_id);
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
            if (id != auction.Auction_id || string.IsNullOrWhiteSpace(auction.Name) || auction.Start_bid <= 0)
            {
                return BadRequest(new { status = 400, message = "Invalid auction data." });
            }

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                string query = "UPDATE Auction SET Name = @Name, Description = @Description, Start_bid = @Start_bid, High_bid = @High_bid, " +
                               "Image_url = @Image_url, Listed_on = @Listed_on, End_date = @End_date, Status = @Status, " +
                               "User_id = @User_id, Category_id = @Category_id WHERE Auction_id = @Auction_id";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Auction_id", auction.Auction_id);
                    cmd.Parameters.AddWithValue("@Name", auction.Name);
                    cmd.Parameters.AddWithValue("@Description", auction.Description);
                    cmd.Parameters.AddWithValue("@Start_bid", auction.Start_bid);
                    cmd.Parameters.AddWithValue("@High_bid", auction.High_bid);
                    cmd.Parameters.AddWithValue("@Image_url", auction.Image_url ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Listed_on", auction.Listed_on);
                    cmd.Parameters.AddWithValue("@End_date", auction.End_date);
                    cmd.Parameters.AddWithValue("@Status", auction.Status);
                    cmd.Parameters.AddWithValue("@User_id", auction.User_id);
                    cmd.Parameters.AddWithValue("@Category_id", auction.Category_id);

                    con.Open();
                    int result = await cmd.ExecuteNonQueryAsync();

                    if (result > 0)
                        return Ok(new { status = 200, message = "Auction updated successfully." });

                    return NotFound(new { status = 404, message = "Auction not found." });
                }
            }
        }

    }
}


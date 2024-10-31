using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using BidXpert_Backend_API.Models;
using System.Data.SqlClient;

namespace BidXpert_Backend_API.Controllers
{
    [Route("api/bid")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public BidController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("{bidderId}")]
        public async Task<IActionResult> GetBidsByBidder(int bidderId)
        {
            List<Bid> bids = new List<Bid>();

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                await con.OpenAsync();

                string query = @"SELECT b.Bid_id, b.Amount, b.Placed_on, b.Auction_id, b.Bidder_id, b.Status, a.Name AS Auction_Title, a.End_date, a.High_bid FROM Bid b JOIN Auction a ON b.Auction_id = a.Auction_id WHERE b.Bidder_id = @Bidder_id;";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Bidder_id", bidderId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Bid bid = new Bid
                            {
                                Bid_id = reader.GetInt32(reader.GetOrdinal("Bid_id")),
                                Amount = reader.GetDecimal(reader.GetOrdinal("Amount")),
                                Placed_on = reader.GetDateTime(reader.GetOrdinal("Placed_on")),
                                Auction_id = reader.GetInt32(reader.GetOrdinal("Auction_id")),
                                Bidder_id = reader.GetInt32(reader.GetOrdinal("Bidder_id")),
                                Auction_title = reader.GetString(reader.GetOrdinal("Auction_Title")),
                                End_date = reader.GetDateTime(reader.GetOrdinal("End_date")),
                                High_bid = reader.GetDecimal(reader.GetOrdinal("High_bid")),
                                Status = reader.GetString(reader.GetOrdinal("Status"))
                            };

                            bids.Add(bid);
                        }
                    }
                }
            }

            if (bids.Count == 0)
            {
                return NotFound(new { status = 404, message = "No bids found for this bidder." });
            }

            return Ok(new { status = 200, message = "Bids retrieved successfully.", data = bids });
        }


        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> GetAllBids()
        {
            List<Bid> bids = new List<Bid>();

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                await con.OpenAsync();

                string query = "SELECT b.Bid_id, b.Amount, b.Placed_on, b.Auction_id, b.Bidder_id, b.Status, a.Name AS Auction_Title, a.Listed_on, a.High_bid FROM Bid b JOIN Auction a ON b.Auction_id = a.Auction_id;";


                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Bid bid = new Bid
                            {
                                Bid_id = reader.GetInt32(reader.GetOrdinal("Bid_id")),
                                Amount = reader.GetDecimal(reader.GetOrdinal("Amount")),
                                Placed_on = reader.GetDateTime(reader.GetOrdinal("Placed_on")),
                                Auction_id = reader.GetInt32(reader.GetOrdinal("Auction_id")),
                                Bidder_id = reader.GetInt32(reader.GetOrdinal("Bidder_id")),
                                Auction_title = reader.GetString(reader.GetOrdinal("Auction_Title")),
                                End_date = reader.GetDateTime(reader.GetOrdinal("Listed_on")),
                                High_bid = reader.GetDecimal(reader.GetOrdinal("High_bid")),
                                Status = reader.GetString(reader.GetOrdinal("Status"))
                            };

                            bids.Add(bid);
                        }
                    }
                }
            }

            if (bids.Count == 0)
            {
                return NotFound(new { status = 404, message = "No bids found." });
            }

            return Ok(new { status = 200, message = "Bids retrieved successfully.", data = bids });
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateBid([FromBody] Bid newBid)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { status = 400, message = "Invalid bid data." });
            }

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                con.Open();


                using (SqlTransaction transaction = con.BeginTransaction())
                {
                    try
                    {

                        string insertBidQuery = "INSERT INTO Bid (Amount, Placed_on, Auction_id, Bidder_id, Status) " +
                                                "VALUES (@Amount, @Placed_on, @Auction_id, @Bidder_id, @Status);" +
                                                "SELECT CAST(scope_identity() AS int);";
                        using (SqlCommand cmd = new SqlCommand(insertBidQuery, con, transaction))
                        {
                            cmd.Parameters.AddWithValue("@Amount", newBid.Amount);
                            cmd.Parameters.AddWithValue("@Placed_on", newBid.Placed_on);
                            cmd.Parameters.AddWithValue("@Auction_id", newBid.Auction_id);
                            cmd.Parameters.AddWithValue("@Bidder_id", newBid.Bidder_id);
                            cmd.Parameters.AddWithValue("@Status", newBid.Status);

                            newBid.Bid_id = (int)await cmd.ExecuteScalarAsync();
                        }


                        string updateAuctionQuery = "UPDATE Auction SET High_bid = @High_bid WHERE Auction_id = @Auction_id AND (High_bid IS NULL OR High_bid < @High_bid);";
                        using (SqlCommand cmd = new SqlCommand(updateAuctionQuery, con, transaction))
                        {
                            cmd.Parameters.AddWithValue("@High_bid", newBid.Amount);
                            cmd.Parameters.AddWithValue("@Auction_id", newBid.Auction_id);
                            await cmd.ExecuteNonQueryAsync();
                        }


                        transaction.Commit();

                        return Ok(new { status = 201, message = "Bid created successfully.", data = newBid });
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return StatusCode(500, new { status = 500, message = "An error occurred while creating the bid.", error = ex.Message });
                    }
                }
            }
        }
        [HttpDelete]
        [Route("delete/{bidId}")]
        public async Task<IActionResult> DeleteBid(int bidId)
        {
            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                await con.OpenAsync();

                string query = "DELETE FROM Bid WHERE Bid_id = @BidId";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@BidId", bidId);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();

                    if (rowsAffected == 0)
                    {
                        return NotFound(new { status = 404, message = "Bid not found." });
                    }
                }
            }

            return Ok(new { status = 200, message = "Bid deleted successfully." });
        }
    }
}

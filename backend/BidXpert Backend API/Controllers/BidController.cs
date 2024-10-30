using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using BidXpert_Backend_API.Models;
using System.Data.SqlClient;

namespace BidXpert_Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public BidController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("api/bid/bids-by-bidder/{bidderId}")]
        public async Task<IActionResult> GetBidsByBidder(int bidderId)
        {
            List<Bid> bids = new List<Bid>();

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                await con.OpenAsync();

                string query = "SELECT Bid_id, Amount, Placed_on, Auction_id, User_id AS Bidder_id " +
                               "FROM Bid WHERE User_id = @Bidder_id;";

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
                                Bidder_id = reader.GetInt32(reader.GetOrdinal("Bidder_id"))
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
        [Route("api/bid/all")]
        public async Task<IActionResult> GetAllBids()
        {
            List<Bid> bids = new List<Bid>();

            using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
            {
                await con.OpenAsync();

                string query = "SELECT Bid_id, Amount, Placed_on, Auction_id, User_id AS Bidder_id FROM Bid;";

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
                                Bidder_id = reader.GetInt32(reader.GetOrdinal("Bidder_id"))
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
                        
                        string insertBidQuery = "INSERT INTO Bid (Amount, Placed_on, Auction_id, User_id) " +
                                                "VALUES (@Amount, @Placed_on, @Auction_id, @User_id);" +
                                                "SELECT CAST(scope_identity() AS int);";
                        using (SqlCommand cmd = new SqlCommand(insertBidQuery, con, transaction))
                        {
                            cmd.Parameters.AddWithValue("@Amount", newBid.Amount);
                            cmd.Parameters.AddWithValue("@Placed_on", newBid.Placed_on);
                            cmd.Parameters.AddWithValue("@Auction_id", newBid.Auction_id);
                            cmd.Parameters.AddWithValue("@User_id", newBid.Bidder_id); 

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
    }
}
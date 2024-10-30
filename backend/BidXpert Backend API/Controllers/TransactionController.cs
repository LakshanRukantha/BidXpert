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
    [Route("api/transactions")]
    public class TransactionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TransactionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("all")]
        public IActionResult GetAllTransactions()
        {
            var response = new Response();
            List<Transaction> transactions = new List<Transaction>();

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM [Transaction]", con);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        transactions.Add(new Transaction
                        {
                            TransactionId = Convert.ToInt32(row["Transaction_id"]),
                            Date = Convert.ToDateTime(row["Date"]),
                            Amount = Convert.ToDecimal(row["Amount"]),
                            Status = row["Status"].ToString(),
                            AuctionId = Convert.ToInt32(row["Auction_id"]),
                            UserId = Convert.ToInt32(row["User_id"])
                        });
                    }
                }

                response.status = 200;
                response.message = "All transactions retrieved successfully.";
                response.Data = transactions;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.status = 500;
                response.message = "Internal server error: " + ex.Message;
                return StatusCode(500, response);
            }
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetTransactionsByUserId(int userId)
        {
            var response = new Response();
            List<Transaction> transactions = new List<Transaction>();

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM [Transaction] WHERE User_id = @UserId", con);
                    da.SelectCommand.Parameters.AddWithValue("@UserId", userId);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        transactions.Add(new Transaction
                        {
                            TransactionId = Convert.ToInt32(row["Transaction_id"]),
                            Date = Convert.ToDateTime(row["Date"]),
                            Amount = Convert.ToDecimal(row["Amount"]),
                            Status = row["Status"].ToString(),
                            AuctionId = Convert.ToInt32(row["Auction_id"]),
                            UserId = Convert.ToInt32(row["User_id"])
                        });
                    }
                }

                if (transactions.Count > 0)
                {
                    response.status = 200;
                    response.message = "Transactions retrieved successfully.";
                    response.Data = transactions;
                    return Ok(response);
                }
                else
                {
                    response.status = 404;
                    response.message = "No transactions found for the specified user.";
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

        [HttpPost("add")]
        public IActionResult AddTransaction([FromBody] Transaction transaction)
        {
            var response = new Response();

            if (transaction.Amount <= 0 || string.IsNullOrWhiteSpace(transaction.Status) || transaction.AuctionId <= 0 || transaction.UserId <= 0)
            {
                response.status = 400;
                response.message = "Amount, Status, Auction ID, and User ID are required and must be valid.";
                return BadRequest(response);
            }

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "INSERT INTO [Transaction] (Amount, Status, Auction_id, User_id) VALUES (@Amount, @Status, @AuctionId, @UserId)";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Amount", transaction.Amount);
                        cmd.Parameters.AddWithValue("@Status", transaction.Status);
                        cmd.Parameters.AddWithValue("@AuctionId", transaction.AuctionId);
                        cmd.Parameters.AddWithValue("@UserId", transaction.UserId);

                        con.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            response.status = 200;
                            response.message = "Transaction added successfully.";
                            response.Data = transaction;
                            return Ok(response);
                        }
                        else
                        {
                            response.status = 400;
                            response.message = "Failed to add transaction.";
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

        [HttpDelete("delete/{transactionId}")]
        public IActionResult DeleteTransaction(int transactionId)
        {
            var response = new Response();

            try
            {
                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("BidXpertAppCon")))
                {
                    string query = "DELETE FROM [Transaction] WHERE Transaction_id = @TransactionId";

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@TransactionId", transactionId);

                        con.Open();
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            response.status = 200;
                            response.message = "Transaction deleted successfully.";
                            return Ok(response);
                        }
                        else
                        {
                            response.status = 404;
                            response.message = "Transaction not found.";
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
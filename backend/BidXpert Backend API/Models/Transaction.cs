using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace BidXpert_Backend_API.Models
{
    public class Transaction
    {
        public int TransactionId { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public int AuctionId { get; set; }
        public int UserId { get; set; }
    }
}

namespace BidXpert_Backend_API.Models
{
    public class Bid
    {
        public int Bid_id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Placed_on { get; set; }
        public int Auction_id { get; set; }
        public int Bidder_id { get; set; }
        public string? Auction_title { get; set; }

    }
}

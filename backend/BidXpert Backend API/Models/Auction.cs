namespace BidXpert_Backend_API.Models
{
    public class Auction
    {
        public int Auction_id {  get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Start_bid { get; set; }
        public decimal? High_bid { get; set; }
        public string? Image_url { get; set; }
        public DateTime Listed_on {  get; set; }
        public DateTime End_date { get; set; }
        public string? Status { get; set; }
        public int Lister_id { get; set; }
        public int Category_id { get; set; }
        public string? ListerName { get; set; }
        public string? CategoryName { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BidXpert_Backend_API.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public string Content { get; set; }
        public DateTime SentDate { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BidXpert_Backend_API.Models
{
    public class Response
    {
        public int status { get; set; }
        public string message { get; set; }
        public object Data { get; set; }
    }
}

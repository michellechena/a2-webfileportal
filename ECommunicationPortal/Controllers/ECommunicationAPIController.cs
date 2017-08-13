using ECommunicationPortal.Models.DBContext;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ECommunicationPortal.Controllers
{
    public class ECommunicationAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(EcommunicationDB.Users.ToList());
        }

        public HttpResponseMessage Post([FromBody]User value)
        {
            EcommunicationDB.Users.Add(value);
            return ToJson(EcommunicationDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]User value)
        {
            EcommunicationDB.Entry(value).State = EntityState.Modified;
            return ToJson(EcommunicationDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            EcommunicationDB.Users.Remove(EcommunicationDB.Users.FirstOrDefault(x => x.UserId == id));
            return ToJson(EcommunicationDB.SaveChanges());
        }
    }
}

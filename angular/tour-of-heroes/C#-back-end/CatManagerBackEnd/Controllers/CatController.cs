using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CatManagerBackEnd.Models;
using CatManagerBackEnd.Services;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;

namespace CatManagerBackEnd.Controllers
{
    [Route("api/cats")]
    [ApiController]
    public class CatController : ControllerBase
    {
        private CatService _catService;

        public CatController(CatService catService)
        {
            _catService = catService;
        }

        [HttpGet("all")]
        public List<Cat> Get()
        {
            return _catService.getAllCats();
        }

        [HttpGet("{id}")]
        public Cat Get(int id)
        {
            return _catService.getCat(id);
        }

        [HttpPost]
        public void Post([FromBody] string name, string fur)
        {
            _catService.saveCat(name, fur);
        }

        [HttpPut]
        public void Put([FromBody] Cat cat)
        {
            _catService.updateCat(cat);
        }

        // DELETE api/cats/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

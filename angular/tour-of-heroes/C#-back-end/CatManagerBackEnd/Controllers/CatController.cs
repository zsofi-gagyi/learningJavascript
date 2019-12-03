using CatManagerBackEnd.Models;
using CatManagerBackEnd.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

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
        public void Post([FromBody] CatWithoutId cat)
        {
            _catService.saveCat(cat.name, cat.fur);
        }

        [HttpPut]
        public void Put([FromBody] Cat cat)
        {
            _catService.updateCat(cat);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _catService.delete(id);
        }
    }
}

using CatManagerBackEnd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatManagerBackEnd.Services
{
    public class CatService
    {
        private int _idCounter = 0;
        private List<Cat> _catList = new List<Cat>();

        public CatService()
        {
            saveCat("Garfield", "orange-black striped");
            saveCat("Fluffy", "long gray");
            saveCat("Void", "shiny black");
            saveCat("Safranek", fur: "dull orange");
            saveCat("Mr. Teufel", fur: "short gray");
            saveCat("Cicu", fur: "white with black patches");
        }

        public void saveCat(string name, string fur)
        {
            _catList.Add(new Cat(_idCounter++, name, fur));
        }

        public List<Cat> getAllCats()
        {
            return _catList;
        }

        public List<Cat> getCatsWith(string? name, string? fur)
        {
            if (name != null & fur != null)
            {
                return _catList.Where(cat => cat.name.ToLower().Contains(name.ToLower()) && 
                                             cat.fur.ToLower().Contains(fur.ToLower())).ToList();
            }

            if (name != null)
            {
                return _catList.Where(cat => cat.name.ToLower().Contains(name.ToLower())).ToList();
            }

            return _catList.Where(cat => cat.fur.ToLower().Contains(fur.ToLower())).ToList();
        }

        public Cat getCat(int id)
        {
            return _catList.Where(cat => cat.id == id).FirstOrDefault();
        }

        public void updateCat(Cat updatedCat)
        {
            var oldCat = _catList.Where(c => c.id == updatedCat.id).FirstOrDefault();
            oldCat.name = updatedCat.name;
            oldCat.fur = updatedCat.fur;
        }

        public void delete(int id)
        {
            var cat = _catList.Where(c => c.id == id).FirstOrDefault();
            _catList.Remove(cat);
        }
    }
}
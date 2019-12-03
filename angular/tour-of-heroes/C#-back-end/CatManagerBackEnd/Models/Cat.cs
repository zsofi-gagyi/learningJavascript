using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatManagerBackEnd.Models
{
    public class Cat
    {
        public int id;
        public string name;
        public string fur;

        public Cat(int id, string name, string fur) {
            this.id = id;
            this.name = name;
            this.fur = fur;
        }
    }
}

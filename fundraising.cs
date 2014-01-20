using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Speech.Recognition.SrgsGrammar;

namespace SRGS2XML
{
    class Fundraising : ISRGSSpec
    {
        private SrgsDocument doc;

        public Fundraising()
        {
            doc = new SrgsDocument();

            SrgsRule howmuch = new SrgsRule("howmuch");
            SrgsItem question1 = new SrgsItem("Mycroft how much");
            SrgsOneOf isare = new SrgsOneOf("is", "are");

            SrgsRule products = new SrgsRule("products");
            SrgsOneOf productsChoices = new SrgsOneOf("capri sun", "pepsi", "mountain dew", "coke", "coca cola", "snapple",
                "doctor pepper", "arnold palmer", "root beer", "IBC root beer", "freeze pops", "air heads", "hershey bar",
                "hershey chocolate", "reese's peanut butter cup", "peanut butter cup", "starburst", "m and m", "m&m's", 
                "peanut m and m", "peanut m&m's", "skittles", "snickers", "three muskateers", "chips", "doritos", "fritos",
                "potato chips", "rice crispy treats", "pringles", "fruit snacks", "cereal", "granola bar", "chips ahoy",
                "ritz bits", "oreos", "teddy grahams", "nutter butter", "sandwich crackers", "peanut butter crackers", 
                "cookies", "famous amos cookies", "chocolate chip cookies", "fruit by the foot", "fruit roll up", "coffee", 
                "popcorn", "polo", "polos", "tee shirt", "tee shirts", "tie", "ties", "sticker", "stickers", "padfolio");
            products.Add(productsChoices);
            products.Scope = SrgsRuleScope.Private;

            SrgsRuleRef productsRef = new SrgsRuleRef(products);

            howmuch.Add(question1);
            howmuch.Add(isare);
            howmuch.Add(productsRef);
            howmuch.Add(new SrgsSemanticInterpretationTag("out.item=rules.products"));
            howmuch.Scope = SrgsRuleScope.Public;

            doc.Rules.Add(howmuch);
            doc.Rules.Add(products);

            doc.Root = howmuch;


        }

        public SrgsDocument SRGS()
        {
            return doc;
        }
    }
}
        
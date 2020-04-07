const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodeOverride = require('method-override')

const app = express();


//Method-override
app.use(methodeOverride("_method"));
//Handlebars
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs')

//BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));

//MongoDB
mongoose.connect("mongodb://localhost:27017/ApiClub", {useNewUrlParser: true, useUnifiedTopology: true})

const clubSchema = {
    defense: String,
    milieu: String,
    attaque: String,
    equipe: String
};

const club = mongoose.model("club", clubSchema)


//Routes
app.route("/")

.get((req,res) => {
    //MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});
    club.find(function(err, equipe) {
        if(!err) {
            res.render("index", {
                club : equipe
            })
        } else {
            res.send(err)
        }
    })
})


.post((req, res) => {
    const newClub = new club({
        defense: req.body.defense,
        milieu: req.body.milieu,
        attaque: req.body.attaque,
        equipe: req.body.equipe
    });
    newClub.save(function(err){
        if(!err){
            res.send("save ok !")
        } else {
            res.send(err)
        }
    })
    
})


app.route("/ajouter-un-joueur")
.get((req, res) => {
    club.find(function(err, equipe) {
        if(!err) {
            res.render("ajouter-un-joueur", {
                club : equipe
            })
        } else {
            res.send(err)
        }
    })
})

      
              

   app.route("/sortie-joueur/:id")
      .get(function(req,res) {
          club.findOne(
              {_id : req.params.id},
              function(err, equipe){
                  if(!err){
                      res.render("sortie-joueur", {
                          _id: equipe.id,
                          defense: equipe.defense,
                          milieu: equipe.milieu,
                          attaque : equipe.attaque,
                          equipe : equipe.equipe
                      })
                  } else {
                      res.send(err)
                  }
              }
          )
      })

     /* app.route("/supprimer/:id")
      .get((req, res) => {
          club.find(function(err, equipe) {
              if(!err) {
                  res.render("supprimer", {
                      club : equipe
                  })
              } else {
                  res.send(err)
              }
          })
      })
      */
      
      
app.put("/sortie-joueur/:id", function(req, res) {
    club.update(
        //condition
        {_id: req.params.id},
        //Update
        {
            defense: req.body.defense,
            milieu: req.body.milieu,
            attaque: req.body.attaque,
            equipe : req.body.equipe

        },
        //OPtion
        {multi: true},
        //exec
        function(err) {
            if(!err) {
                res.send("update ok !")
            } else {
                res.send(err)
            }
        }
    )
})

      
app.delete("/sortie-joueur/:id", function (req,res) {
        club.deleteOne({_id:req.params.id}, function(err) {
            if(!err){
                res.send("deleted")
            } else {
                res.send(err)
            }
        } )
})

/*app.delete("/supprimer/:id", function(req, res) {
    club.deleteOne({id: req.params.id}, function(err) {
        if(!err) {
            res.send("yes !")
        } else {
            res.send(err)
        }
    })
})
*/




app.listen(6600, function() {
    console.log("le port 6600");
    
})
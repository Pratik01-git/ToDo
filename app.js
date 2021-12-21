const express = require('express');
const bodyParser = require('body-parser');
const time = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const capitalize = require('lodash.capitalize');
const app = express();

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://patrick-sinova:test123@cluster0.dher7.mongodb.net/todolistDB");

const itemSchema = {
    name:String
}
const Item = mongoose.model("Item",itemSchema);

const first = new Item({
    name : "Welcome to this ToDo list web app"
})
const second = new Item({
    name : "hit the > button to add an item"
})
const third = new Item({
    name : "Check the checkbox to remove an item"
})
const fourth = new Item({
    name : "hit on + in nav to create new list"
})
const fifth = new Item({
    name : "If the list with same name is present you will be directed to the public existing list"
})
const sixth = new Item({
    name : "Please login to get personalised experience"
})
const seventh = new Item({
    name : "Home list can not be eptied"
})

const defaultItems = [first,second,third,fourth,fifth,sixth,seventh];

const listSchema = {
    name:String,
    items:[itemSchema]
}

const List = mongoose.model("List",listSchema);

// Day and Date
const day = time.getDay();
const date = time.getDate();

app.get("/",function(req,res){
    Item.find({},function(err,founditems){
        if(founditems.length ===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log("Oops we ran into some error!")
                }
                else{
                    console.log("Done with this task");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("index",{Heading:"HOME",tasklist:founditems,day:day,date:date});
        }
    });
});

app.post("/find",function(req,res){
    const listname = (req.body.input);
    res.redirect("/"+listname);
})

app.get("/:listname",function(req,res){
    const listname = capitalize(req.params.listname);
    List.findOne({name: listname}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: listname,
                    items: []
                });

                list.save();
                res.redirect("/"+listname);
            }
            else{
                res.render("index",{Heading:foundList.name,tasklist:foundList.items,day:day,date:date});
            }
        }
    });
})

app.post("/",function(req,res){

    const newtask = req.body.newtask;
    const listName = req.body.list;
    const newitem = new Item({
        name:newtask
    });  

    if(listName==="HOME"){
        newitem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(newitem);
            foundList.save();
            res.redirect("/"+listName);
        })
    }

}); 

app.post("/delete",function(req,res){
    const checkeditem = (req.body.checkbox);
    const listName = req.body.listName;

    if(listName==="HOME"){
        Item.findByIdAndRemove(checkeditem,function(err){
            if(!err){
                console.log("is sucessfully removed");
                res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkeditem}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("server is up and running sucessfully:");
});
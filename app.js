var express=require("express"),
	methodOverride=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
	app=express(),
	bodyparser=require("body-parser"),
	mongoose=require("mongoose");

// mongoose connection setup

mongoose.connect("mongodb+srv://watansahu:watan123@cluster0-d9tzr.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("error!",err.message);
});




//schema of the blog 1. title:string image:string body:string created:date
				 			 
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type: Date, default: Date.now}
	});

var blog = mongoose.model("blog",blogSchema);


//otherexpress setups.........
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
		
app.use(methodOverride("_method"));		

// RESTful /ndex route....

app.get("/",function(req,res){
	res.redirect("/blogs");
});


// RESTful /new routes...


app.get("/blogs/new",function(req,res){
	res.render("new");
});



app.get("/blogs/:id",function(req,res){
	
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}
		else
			{
				res.render("show",{blog:foundblog});
			}
	});
	
});




// RESTful  CREATE routes..
app.get("/blogs",function(req,res){

		blog.find({},function(err,blogs){
			if(err){
				console.log(err);
		}
	else
		{
			res.render("index",{blogs:blogs});
		}
	});
});



app.post("/blogs",function(req,res){
	
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new");
		}
		else
			{
				res.redirect("/blogs");
			}
	});
	
});

//EDIT ROUTES

app.get("/blogs/:id/edit",function(req,res){
	
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit",{blog: foundblog});
		}
			
	});	
});
 

//UPDATE ROUTES
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
	
})

// DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
	
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000,function(){
	console.log("server started!");
});

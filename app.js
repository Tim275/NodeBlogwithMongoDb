// with npm installed
let express = require("express");
let bodyParser = require("body-parser");
const ejs = require('ejs');
const fs = require('fs');
const multer = require('multer'); // für images
/* We will upload the file on server local directory, 
not in database. We will store the directory path into the database. */
const path = require("path");



// constructs , see src
let blogEntry = require("./src/blogEntry");
let commentEntry = require("./src/commentEntry");
const mongo = require("./src/MongoDB.js");


const app = express();

// ejs nutzbar
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public")); // makes the file "public" accecable
app.use('/uploads', express.static('uploads')); // makes the file "uploads" accecable
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())




// Funktion zur Verbindung mit MongoDB
async function connect() {
    await mongoose.connect(uri)
    console.log("Verbunden mit Flamurs MongoDB")}


// Die Verbindung mit MongoDB
mongo.connect()


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  await mongo.registerUser(username, password);
  res.send('<p>Registrierung erfolgreich.</p><a href="/login">Zum Login.</a>');
});

// Login von "User"
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await mongo.loginUser(username, password);
  if (user) {
    res.redirect("/index");
  } else {
    res.send("Falscher Benutzername oder Passwort.");
  }
});



// Die Startseite
app.get("/", (req, res) => {
    res.send('<a href="/register">Zur Registrierung</a><a href="/login">Zum Login</a>')})

// login.html mit dem Server verbinden
app.get("/login", function (req, res) {
    res.sendFile("login.html", { root: "./" })})

// register.html mit dem Server verbinden
app.get("/register", function (req, res) {
    res.sendFile("register.html", { root: "./" })})

// "User" erstellen mit MongoDB


//const User = mongoose.model("User", {
   // username: String,
    //password: String,})

// Registrierung von "User"
app.post("/register", async (req, res) => {
    const { username, password } = req.body
    await User.create({ username, password })
    res.send('Registrierung erfolgreich.<a href="/login">Zum Login.</a>')})

// Login von "User"
app.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username, password })
    if (user) {
      res.redirect("/index")
    } else {
      res.send('Falscher Benutzername oder Passwort.<a href="/login">Versuche erneut.</a>')}})

// Ende



// i want to create  on server side a image upload with multer that display the images on my ejs file     

let entries = [   // list for entrys ( see src)
    new blogEntry(1,"Blog Titel", " HEEEELOOOOOOO WOOORLD!" ),
      // Constructer defined on Guestbook entry
];  

//


app.get("/index", (req, res) => {           
    res.render("index", 
    {entries: entries,title: "BlogApplication"  });   // Objekt mit daten damit kann index.ejs entries nutzen
                // seperat z.B title: BLOG  mit <%= title });                    
});


// beim run wird ein image Ordner erstellt
//app.use(multer({ dest: 'uploads' }).single('image'))
// WIRD aufgerufen durch image im index.ejs und destination images
//app.use(multer({ dest: 'uploads' }).single('image'));


// uploads the images in the uploads folder
const upload = multer({
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.includes('image')) {   // /image\//) --> alle dateien
      cb(new Error('Only image files are allowed!'));
      return;
    }
    cb(null, true);
  }
});





// upload function is included there
app.post("/blog/new", upload.single('image') , async  (req,res) =>{ // 

  let content = req.body.content;
  let title = req.body.title;
  let image = req.file ? req.file.filename : null; // Ausdruck(c#?) wenn req.file dann req.file.filename sonst null
  
    // Save the image file to the server
   
    const newId = parseInt(entries.length + 1); // zählt die id hoch zur zuordnung
    let newEntry = new blogEntry(newId,title, content,image);
    entries.push(newEntry);

    res.redirect("/index");
   
    });
    
    
   
// how delete works?
// id is given, nvm works without we

app.post("/blog/delete/", (req, res) => {

    const toDelete = parseInt(req.body.entryId); // nimmt Die id von der HTML die ich löschen möchte              
    const entryIndex = entries.findIndex((entry) => entry.id === toDelete); // zu welchem objekt gehört die id?
                                                                                            //einzige Funktion von ChatG
entries.splice(entryIndex, 1);   // eintrag wird entfernt                                       
    res.redirect("/index");
});


app.post("/blog/:id/add-comment", (req, res) => {  // :id der Liste entry

    const entryId = parseInt(req.params.id);
    const comment = req.body.comment;
    const visitor = req.body.visitor;

    const entry = entries.find((entry) => entry.id === entryId); // Filtert wie beim Delete die Id herau
        const newComment = new commentEntry(comment, visitor);
        entry.comments.push(newComment);
    res.redirect("/index");
});


app.post("/blog/edit/:id", (req, res) => {
  const entryId = parseInt(req.params.id);

  const entryToEdit = entries.find((entry) => entry.id === entryId);  // sucht nachdem eintrag der übereinstimmt

  const updatedContent = req.body.content; //  aktualisierung des inhalts von content
  entryToEdit.content = updatedContent;  

  res.redirect("/index"); // Redirect to the main page or wherever you want after editing.
});

app.get("/blog/edit/:id", (req, res) => { // render, nimmt sich den geposteten text
    const entryId = parseInt(req.params.id); // wandelt id in int um
    const entryToEdit = entries.find((entry) => entry.id === entryId); //sucht nachdem eintrag der übereinstimmt
    res.render("edit", { entry: entryToEdit }); // rendert die ansicht
  });

app.listen(3000, () => {
    console.log("App wurde gestartet auf localhost:3000");
})
// Daten vom Browser zum Server schicken


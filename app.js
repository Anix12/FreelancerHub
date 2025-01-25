const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const sampleWorks = require("./data/posted_work");
const mongoUrl = "mongodb://127.0.0.1:27017/freelancer";
const Work=require('./models/work');
const multer = require('multer');
const Freelancer=require('./models/freelancer');
const methodOverride = require('method-override');

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    mongoose.connect(mongoUrl);

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(methodOverride('_method'));



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
  });

app.get("/", (req, res) => {
    res.render("Home.ejs");
});


app.get("/about-us", (req, res) => {
    res.render("aboutUs.ejs");
});

app.get("/profile", (req, res) => {
    res.render("profile.ejs", { sampleWorks });
});

app.get("/login", (req, res)=>{
    res.render("login.ejs")
})

app.get("/signup", (req, res)=>{
    res.render("signup.ejs")
})

app.get("/new_work", (req, res)=>{
    res.render("work.ejs");
});

app.post('/work', upload.single('image'), async (req, res) => {
    try {
      // Extract and validate fields from the request body
      const { 
        title, 
        description, 
        budget, 
        deadline, 
        skills, 
        postedby 
      } = req.body;
  
      if (!title || !description || !budget?.min || !budget?.max || !deadline || !skills) {
        return res.status(400).send('Missing required fields');
      }
  
      // Prepare the work data object
      const workData = {
        title,
        description,
        profile_image: req.file
          ? { url: `/uploads/${req.file.filename}` }
          : { url: "/assets/profile_pic.jpg" }, // Default image if no file uploaded
        budget: {
          currency: budget.currency || 'USD',
          min: parseFloat(budget.min),
          max: parseFloat(budget.max),
        },
        deadline: new Date(deadline),
        skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
        postedby: postedby || 'Anonymous',
        createdAt: new Date(),
      };
  
      // Create and save the work document
      const work = new Work(workData);
      await work.save();
  
      console.log('Uploaded File:', req.file);
      console.log('Work saved successfully:', work);
  
      res.redirect('/posted_work');
    } catch (error) {
      console.error('Error posting work:', error);
      res.status(500).send('An error occurred while saving the work. Please try again.');
    }
  });

  app.get("/posted_work", async (req, res) => {
    try {
        const allWork = await Work.find({});
  
        const sanitizedWork = allWork.map(work => ({
            ...work.toObject(),
            budget: work.budget && work.budget.min !== undefined && work.budget.max !== undefined 
                ? work.budget 
                : {
                    currency: work.currency || "USD", // Use work.currency if present
                    min: work.minBudget || 0,       // Fallback to minBudget
                    max: work.maxBudget || 0        // Fallback to maxBudget
                },
        }));
  
        // console.log(sanitizedWork) Debug output for validation
        res.render("posted_work.ejs", { allWork: sanitizedWork });
    } catch (error) {
        console.error("Error fetching works:", error);
    }
  });

  //FreeLanecre
  app.get('/freelancer', async(req, res) => {
    const freelancers = await Freelancer.find({});
  
    res.render('freelancer.ejs', { freelancers });
  });
  
  app.get("/create_profilr", (req, res)=>{
    res.render("create_profile.ejs");
  })
  
  app.get('/freelancer/:id', async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.params.id);
        console.log(freelancer.image.url)
        res.render('freelancer_profile', { sampleData: freelancer });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving freelancer data');
    }
  });
  
  // POST route handler
  app.post('/new_freelancer', upload.single('image'), async (req, res) => {
      try {
          // Validate required fields
          if (!req.body.name || !req.body.email) {
              return res.status(400).json({
                  success: false,
                  message: 'Name and email are required fields'
              });
          }
          // Prepare skills array
          const skills = req.body.skills ? 
              req.body.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : 
              [];
               // Create Freelancer document
          const freelancer = new Freelancer({
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone || null,
              role: req.body.role,
              skills: skills,
              image: req.file ? {
                  url: `/uploads/${req.file.filename}`,
                  filename: req.file.filename
              } : null, 
              rate: req.body.rate || 50,
          });
          await freelancer.save();
          console.log(freelancer);
          res.redirect('/freelancer');
  
      } catch (error) {
          console.error('Error creating freelancer profile:', error);
  
          // Delete uploaded file if there was an error
          if (req.file) {
              const filePath = path.join(__dirname, 'uploads', req.file.filename);
              fs.unlink(filePath, (err) => {
                  if (err) console.error('Error deleting file:', err);
              });
          }
  
          if (error.code === 11000) {
              return res.status(400).json({
                  success: false,
                  message: 'A freelancer with this email already exists'
              });
          }
      }
  });

//   Destroy the Freelancer Profile
  app.delete("/freelancer/:id", async(req, res,)=>{
    let {id} = req.params;
    const deletedFreelancer = await Freelancer.findByIdAndDelete(id);
    console.log("deleted freelancer:",deletedFreelancer);
    res.redirect("/freelancer");

  });

  // Update the Freelancer Profile
  app.put("/freelancer/:id",upload.single('image'), async(req, res)=>{
     const { id } = req.params; 
    const data = req.body; 

    const updatedFreelancer = await Freelancer.findByIdAndUpdate(id, data, { new: true });

    //if file uploaded
    if (req.file) {
      const { path: url, filename } = req.file;

      updatedFreelancer.image = {
        url,
        filename,
      };
      await updatedFreelancer.save();
    }
    console.log("Updated Freelancer:", updatedFreelancer);
    res.redirect(`/freelancer/${id}`);
  });

  //edite form render
  app.get("/freelancer/:id/edit", async(req, res)=>{
    let {id} = req.params;
    const oldFreelancer = await Freelancer.findById(id);
    // let originalImageUrl = profile_image.url;
    // originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
   res.render("profile_edit.ejs", {oldFreelancer})
  });
  
  const findFreelancerById = async (id) => {
    try {
        const freelancer = await Freelancer.findById(id);
        if (freelancer) {
            console.log(freelancer);
        } else {
            console.log('Freelancer not found');
        }
    } catch (error) {
        console.error('Error finding freelancer:', error);
    }
  };


// app.get("/freelancer_profile", (req, res) => {
//     const sampleData =  {
//       name: "om darade",
//       image: {
//         url:  "/images/profile_pic.jpg",
//         filename: "alice_johnson.jpg",
//       },
//       email: "alice.johnson@example.com",
//       phone: 7517316362, // No phone provided
//       skills: ["Java", "Spring Boot", "Kubernetes"],
//       portfolio: [],
//       experience: ["64a7f22c91892d0003234569"],
//       certification: [],
//     }
//     res.render("freelancer_profile.ejs", { sampleData });
//   });

app.listen("1200", (req, res) => {
    console.log("Port Listening at 1200");
});
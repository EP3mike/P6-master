const Sauce = require('../models/sauce');
const fs = require('fs');

// endpoint for get request for all sauces on database
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => {
      res.status(200).json(sauces);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
};

//endpoint to retrieve a single Sauce post by its id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
    .then(sauce => {
      res.status(200).json(sauce);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
};

//endpoint to create a Sauce post
exports.createSauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  req.body.sauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + "/images/" + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce saved successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        message: error
      });
    });
};

//endpoint to modify existing sauce but ony if auth user
// handles case if user doesn't update image and if user updates image & post details
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({_id: req.params._id});
    //case for modify req has new image file to update
    if(req.file) {
        const url = req.protocol + "://" + req.get("host");
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
          _id: req.params.id,
          userId: req.body.sauce.userId,
          name: req.body.sauce.name,
          manufacturer: req.body.sauce.manufacturer,
          description: req.body.sauce.description,
          mainPepper: req.body.sauce.mainPepper,
          imageUrl: url + "/images/" + req.file.filename,
          heat: req.body.sauce.heat,
          likes: req.body.sauce.likes,
          dislikes: req.body.sauce.dislikes,
          usersLiked: req.body.sauce.usersLiked,
          usersDisliked: req.body.sauce.usersDisliked
        }; 
        //case for the req just has post body updates
    } else {
        sauce = {
          _id: req.params.id,
          userId: req.body.userId,
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          imageUrl: req.body.imageUrl,
          heat: req.body.heat,
          likes: req.body.likes,
          dislikes: req.body.dislikes,
          usersLiked: req.body.usersLiked,
          usersDisliked: req.body.usersDisliked
        };
    }
    // depending on case 1 or 2 of the updated sauce mongoose call to update specific post in database
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch (
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

//endpoint to delete a sauce post but only if auth user
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(sauce => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Deleted!"
          });
        })
        .catch(error => {
          res.status(400).json({
            error: error
          });
        });
    });
  });
};

//endpoint to modify the like status for a sauce post
exports.setLike = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id }).lean().then(sauce => {
        //case if like req is a 1(user likes sauce)
     if (req.body.like === 1) {
       const copyOfUserLikedArray = [...sauce.usersLiked];
       copyOfUserLikedArray.push(req.body.userId);
       sauce = {
         _id: req.params.id, 
         userId: req.body.userId, 
         likes: sauce.likes + 1, 
         usersLiked:copyOfUserLikedArray                           
        };
        //case if like req is a -1(user dislikes sauce)
     } else if (req.body.like === -1) {
       const copyOfUserDislikedArray = [...sauce.usersDisliked];
       copyOfUserDislikedArray.push(req.body.userId);
       sauce = {
         _id: req.params.id, 
         userId: req.body.userId, 
         dislikes: sauce.dislikes + 1, 
         usersDisliked: copyOfUserDislikedArray 
        };
        //case if user undoes their like (goes back to neutral)
     } else {
        //if neutral req comes from a like checks array of liked users to see if userID is included
       if (sauce.usersLiked.includes(req.body.userId)) {
         const indexOfUserLiked = sauce.usersLiked.indexOf(`${req.body.userId}`);
         const copyOfUserLikedArray = [...sauce.usersLiked];
         copyOfUserLikedArray.splice(indexOfUserLiked, 1);
         sauce = {
             _id: req.params.id, 
             userId: req.body.userId, 
             likes: sauce.likes - 1, 
             usersLiked: copyOfUserLikedArray 
            };
       }
        else if (sauce.usersDisliked.includes(req.body.userId)) {
         const indexOfUserDisliked = sauce.usersDisliked.indexOf(req.body.userId);
         const copyOfUserDislikedArray = [...sauce.usersDisliked];
         copyOfUserDislikedArray.splice(indexOfUserDisliked, 1);
         sauce = {
             _id: req.params.id, 
             userId: req.body.userId, 
             dislikes: sauce.dislikes - 1, 
             usersDisliked: copyOfUserDislikedArray 
            };
       }
     }
     Sauce.updateOne({ _id: req.params.id }, sauce)
       .then(() => {
         res
           .status(201)
           .json({
             message: "Sauce like status submitted successfully!"
           });
       })
       .catch(error => {
         res.status(400).json({ error: error });
       });
   });
};

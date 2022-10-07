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
          userId: req.body.sauce.userId,
          name: req.body.sauce.name,
          manufacturer: req.body.sauce.manufacturer,
          description: req.body.sauce.description,
          mainPepper: req.body.sauce.mainPepper,
          imageUrl: req.file.imageUrl,
          heat: req.body.sauce.heat,
          likes: req.body.sauce.likes,
          dislikes: req.body.sauce.dislikes,
          usersLiked: req.body.sauce.usersLiked,
          usersDisliked: req.body.sauce.usersDisliked
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

};

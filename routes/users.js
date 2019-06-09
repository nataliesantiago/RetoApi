import express from 'express';
import userModel from './../models/user';
import hobbieModel from './../models/hobbie';
import moment from 'moment';
import mapErrorsLib from './../lib/mapErrors'
import _ from 'lodash';

var router = express.Router();

router.post('/create-user', async (req, res) =>  {
  console.log("body",req.body)
  let birthDay  = new moment(req.body.birthDay, 'DD-MM-YYYY');
  let user = new userModel({...req.body, birthDay});
  console.log("user",user)
  try {
    await user.save();
  } catch (error) {
      let errors = mapErrorsLib.mapErrors(error);
    return res.send({
      success: false,
      errors,
      message: 'user not saved!'
    });
  }
  res.send({
    success: true,
    message: 'user saved successful!'
  });
});

router.post('/edit-user/:id', async (req, res) =>  {
  let editUser = await userModel.findById(req.params.id);
  if(req.body.password){
    editUser.password = req.body.password;
  }

  editUser.firstName = req.body.firstName;
  editUser.lastName = req.body.lastName;
  editUser.documentId = req.body.documentId;
  editUser.birthDay = new moment(req.body.birthDay, 'DD-MM-YYYY');
  editUser.hobbies = req.body.hobbies;

  try {
    await editUser.save();
  } catch (error) {
      let errors = mapErrorsLib.mapErrors(error);
    return res.send({
      success: false,
      errors,
      message: 'user not saved!'
    });
  }
  res.send({
    success: true,
    message: 'user saved successful!'
  });
});

router.post('/delete-user/:id', async (req, res) =>  {
  try {
    await userModel.findOneAndRemove(req.params.id);
  } catch (error) {
      let errors = mapErrorsLib.mapErrors(error);
    return res.send({
      success: false,
      errors,
      message: 'user not deleted!'
    });
  }
  res.send({
    success: true,
    message: 'user deleted successful!'
  });
});

router.get('/get-users', async (req, res) =>  {
  let getUser = await userModel.find();
  res.send({
    success: true,
    message: 'user successful!',
    data: getUser
  });
});

router.get('/get-user/:id', async (req, res) =>  {
  let getUser = await userModel.findById(req.params.id);
  res.send({
    success: true,
    message: 'user successful!',
    data: getUser
  });
});

router.post('/search-hobbie-user', async (req, res) =>  {
  let regexName = new RegExp(req.body.firstName);
  let regexLast = new RegExp(req.body.lasttName);
  let findUser = await userModel.find({firstName: { $regex: regexName }, lastName: { $regex: regexLast }})
                        .populate({path: 'hobbies'});
  res.send({
    success: true,
    message: 'user successful!',
    data: findUser
  });
});

router.post('/search-hobbie/:id', async (req, res) =>  {
  let findUser = await userModel.findById(req.params.id,'hobbies').populate({path: 'hobbies'});
  res.send({
    success: true,
    message: 'user successful!',
    data: findUser
  });
});

router.post('/search-user', async (req, res) =>  {
  let regexName = new RegExp(req.body.firstName);
  let regexLast = new RegExp(req.body.lasttName);
  let findUser = await userModel.find({firstName: { $regex: regexName }, lastName: { $regex: regexLast }});
  res.send({
    success: true,
    message: 'user successful!',
    data: findUser
  });
});

router.post('/add-hobbies/:id', async (req, res) =>  {
  let editUser = await userModel.findById(req.params.id);
  editUser.hobbies = req.body.hobbies;
  try {
    await editUser.save();
  } catch (error) {
      let errors = mapErrorsLib.mapErrors(error);
    return res.send({
      success: false,
      errors,
      message: 'user not saved!'
    });
  }
  res.send({
    success: true,
    message: 'user saved successful!'
  });
});

router.post('/search-hobbies-user/:id', async (req, res) =>  {
  let findHobbies = await userModel.findById(req.params.id).populate({path: 'hobbies'}).lean();
  let hobbies = findHobbies.hobbies;
  let allHobbies = await hobbieModel.find().lean();
  
  allHobbies = _.map(allHobbies, (hobbie) => {
    hobbie.checked = _.findIndex(hobbies, (hobbieUser) => {
      return hobbieUser._id.equals(hobbie._id)
    }) > -1 
    return hobbie;
  });
  res.send({
    success: true,
    message: 'hobbies successful!',
    data: {allHobbies, hobbies}
  });
});


module.exports = router;

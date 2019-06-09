import express from 'express';
import HobbieModel from './../models/hobbie';
import mapErrorsLib from './../lib/mapErrors'

var router = express.Router();

router.post('/create-hobbie', async (req, res) =>  {
  let hobbie = new HobbieModel(req.body);
  try {
    await hobbie.save();
  } catch (error) {
      let errors = mapErrorsLib.mapErrors(error);
    return res.send({
      success: false,
      errors,
      message: 'hobbie not saved!'
    });
  }
  res.send({
    success: true,
    message: 'hobbie saved successful!'
  });
});

router.get('/get-hobbies', async (req, res) =>  {
  let getHobbie = await HobbieModel.find();
  res.send({
    success: true,
    message: 'hobbie successful!',
    data: getHobbie
  });
});


module.exports = router;

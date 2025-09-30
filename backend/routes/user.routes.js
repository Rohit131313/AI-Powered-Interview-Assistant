const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
});

router.post('/', upload.single("resume"), userController.uploadResume);

router.post('/addinfo', userController.addUserInfo);

router.post('/saveinterview', userController.saveInterviewQuestionAnswer);

router.get('/getcandidates', userController.getAllCandidates);


module.exports = router;
import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    // Handle file upload logic here
    // You can use middleware like multer to process the uploaded file
    res.send('Home!');
});

export default router;
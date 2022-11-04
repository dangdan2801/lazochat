const router = require('express').Router();

router.get('', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Hello world'
    });
});

module.exports = router;

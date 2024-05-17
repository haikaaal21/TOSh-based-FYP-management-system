const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createMulterInstance(dest) {
    const saveto = 'public/' + dest;
    
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            let dir = saveto;
            if(req.params.multerid) {
                dir = saveto + '/' + req.params.multerid
            }
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
    return multer({storage: storage});
}

module.exports = createMulterInstance;
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, avatar, cb) {
    cb(null, './temp/files')
  },
  filename: function (req, avatar, cb) {
    cb(null, avatar.originalname)
  }
})

const upload = multer({ storage: storage })
export default upload;
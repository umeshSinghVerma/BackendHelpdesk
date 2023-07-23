const express = require('express')
const router = express.Router();
const {
    addBlog,
    addMenu,
    addContent,
    getAllBlogsList,
    getAllBlogsList_user,
    deleteBlog,
    blogRequested,
    menuRequested,
    deleteMenu,
    deleteContent,
    profileUploadfn
} = require('../controllers/helpdeskController');
const multer = require('multer');
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("Invalid image File!", false);
    }
}
const upload = multer({ storage, fileFilter });
const RequireAuth = require('../middlewares/requireAuth');

router.get('/allBlogs', getAllBlogsList);
router.get('/:blogindex/getBlog', blogRequested);
router.get('/:blogindex/:menuindex/getMenu', menuRequested)

router.use(RequireAuth);

router.get('/allUserBlogs', getAllBlogsList_user);

router.post('/:blogIndex/:menuIndex/addContent', addContent)
router.post('/:blogIndex/addMenu', addMenu);
router.post('/addBlog', addBlog);


router.delete('/:blogindex/deleteBlog', deleteBlog)
router.delete('/:blogindex/:menuindex/deleteMenu', deleteMenu)
router.delete('/:blogIndex/:menuId/:contentId/deleteContent', deleteContent)

router.post("/ProfilePicture", upload.single('profile'), profileUploadfn)
module.exports = router;
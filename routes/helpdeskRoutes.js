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
    deleteContent
} = require('../controllers/helpdeskController');
const RequireAuth = require('../middlewares/requireAuth');

router.get('/allBlogs',getAllBlogsList);
router.get('/:blogindex/getBlog',blogRequested);
router.get('/:blogindex/:menuindex/getMenu',menuRequested)

router.use(RequireAuth);

router.get('/allUserBlogs',getAllBlogsList_user);

router.post('/:blogIndex/:menuIndex/addContent',addContent)
router.post('/:blogIndex/addMenu', addMenu);
router.post('/addBlog',addBlog);


router.delete('/:blogindex/deleteBlog',deleteBlog)
router.delete('/:blogindex/:menuindex/deleteMenu',deleteMenu)
router.delete('/:blogIndex/:menuId/:contentId/deleteContent',deleteContent)
module.exports = router;
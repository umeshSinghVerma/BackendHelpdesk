const express = require('express')
const router = express.Router();
const {
    addBlog,
    addMenu,
    addContent,
    getAllBlogsList,
    deleteBlog,
    blogRequested,
    menuRequested,
    deleteMenu,
    deleteContent
} = require('../controllers/helpdeskController');

router.post('/:blogIndex/:menuIndex/addContent',addContent)
router.post('/:blogIndex/addMenu', addMenu);
router.post('/addBlog',addBlog);

router.get('/allBlogs',getAllBlogsList);
router.get('/:blogindex/getBlog',blogRequested);
router.get('/:blogindex/:menuindex/getMenu',menuRequested)

router.delete('/:blogindex/deleteBlog',deleteBlog)
router.delete('/:blogindex/:menuindex/deleteMenu',deleteMenu)
router.delete('/:blogIndex/:menuId/:contentId/deleteContent',deleteContent)
module.exports = router;
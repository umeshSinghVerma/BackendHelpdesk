const HelpdeskModle = require('../Modles/helpdeskModle');
const userModle = require('../Modles/userModle');
const cloudinary = require('../utils/cloudinary');

const addBlog = async (req, res) => {
    const recievedArray = req.body;
    const userId = req.user._id.toString();
    let blog = recievedArray[0];
    blog = { ...blog, userId: userId };
    console.log("blog recieved", blog);
    let LocalArray = recievedArray[1].map(key => {
        return (Number(key));
    })
    LocalArray = [...LocalArray, blog.blogindex];
    console.log("LocalArray", LocalArray);
    try {
        const blogCreated = await HelpdeskModle.findOneAndUpdate(
            { blogindex: blog.blogindex },
            blog,
            { new: true, upsert: true }
        );
        if (blogCreated) {
            const allBlogs = await HelpdeskModle.find({ userId });
            const allBlogIndexes = allBlogs.map(obj => obj.blogindex);
            console.log("allBlogIndexes", allBlogIndexes);
            console.log("allBlogs", allBlogs);
            if (allBlogs) {
                console.log("came in");
                const MissingBlogs = allBlogIndexes.filter(index => !LocalArray.includes(index));
                console.log("Numbered Missing Blog", MissingBlogs);

                if (MissingBlogs.length !== 0) {
                    const MissingBlogDetails = allBlogs.filter(obj => MissingBlogs.includes(obj.blogindex));
                    console.log("blogCreated", blogCreated);
                    console.log("Missing Blogs", MissingBlogs);
                    console.log("Missing Blog details", MissingBlogDetails);
                    res.status(201).json([blogCreated, MissingBlogDetails]);
                } else {
                    res.status(200).json(blogCreated);
                }
            }
        } else {
            res.status(503).json('Some error has occurred');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addMenu = async (req, res) => {
    const menu = req.body;
    const blogid = req.params.blogIndex;
    const requestUserId = req.user._id.toString();
    console.log("menu", menu);
    try {
        let Blogrequired = await HelpdeskModle.find({ blogindex: blogid });
        const BlogUserId = Blogrequired[0].userId;
        if (BlogUserId !== requestUserId) {
            return res.status(400).json("You are not the creator of this content");
        }
        const blog = await HelpdeskModle.findOne({ blogindex: blogid });
        if (blog) {
            const blogCopy = JSON.parse(JSON.stringify(blog));
            if (blogCopy.blogMenus) {
                let id = menu.blogMenuId;
                const existingBlog = blogCopy.blogMenus[id];
                if (existingBlog) {
                    for (const key in menu) {
                        if (menu.hasOwnProperty(key)) {
                            existingBlog[key] = menu[key];
                        }
                    }
                    const menuCreated = await HelpdeskModle.findOneAndUpdate(
                        { blogindex: blogid },
                        { $set: { [`blogMenus.${menu.blogMenuId}`]: existingBlog } },
                        { new: true, upsert: true }
                    );
                    if (menuCreated) {
                        const menuCreatednew = JSON.parse(JSON.stringify(menuCreated));
                        const MenuArray = Object.values(menuCreatednew.blogMenus).map(obj => {
                            return ({
                                blogMenuId: obj.blogMenuId,
                                title: obj.title
                            })
                        })
                        MenuArray.reverse();
                        return res.status(200).json(MenuArray);
                    } else {
                        return res.status(404).json({ error: 'Blog not found' });
                    }
                } else {
                    console.log("I have came here");
                    const menuCreated = await HelpdeskModle.findOneAndUpdate(
                        { blogindex: blogid },
                        { $set: { [`blogMenus.${menu.blogMenuId}`]: req.body } },
                        { new: true, upsert: true }
                    );
                    if (menuCreated) {
                        const menuCreatednew = JSON.parse(JSON.stringify(menuCreated));
                        const MenuArray = Object.values(menuCreatednew.blogMenus).map(obj => {
                            return ({
                                blogMenuId: obj.blogMenuId,
                                title: obj.title
                            })
                        })
                        MenuArray.reverse();
                        return res.status(200).json(MenuArray);
                    } else {
                        return res.status(404).json({ error: 'Blog not found' });
                    }
                }
            } else {
                // console.log("I have came here outside blogMenus");
                const menuCreated = await HelpdeskModle.findOneAndUpdate(
                    { blogindex: blogid },
                    { $set: { [`blogMenus.${menu.blogMenuId}`]: req.body } },
                    { new: true, upsert: true }
                );
                if (menuCreated) {
                    const menuCreatednew = JSON.parse(JSON.stringify(menuCreated));
                    const MenuArray = Object.values(menuCreatednew.blogMenus).map(obj => {
                        return ({
                            blogMenuId: obj.blogMenuId,
                            title: obj.title
                        })
                    })
                    MenuArray.reverse();
                    return res.status(200).json(MenuArray);
                } else {
                    return res.status(404).json({ error: 'Blog not found' });
                }

            }
        }

    }
    catch (error) {
        console.log(error.message)
    }
}

const addContent = async (req, res) => {
    const blogIndex = req.params.blogIndex;
    const menuIndex = req.params.menuIndex;
    let content = req.body;
    console.log("content", content);
    const userId = req.user._id.toString();
    content = { ...content, userId: userId }
    const { index, type, text } = req.body;

    if (!index || !type || !text) {
        return res.status(400).json({ error: 'Missing required properties' });
    }


    try {
        const Blog = await HelpdeskModle.find({ blogindex: blogIndex });
        const BlogUserId = Blog[0].userId;

        if (BlogUserId !== userId) {
            return res.status(400).json("You are not the creator of this content");
        }

        const contentCreated = await HelpdeskModle.findOneAndUpdate(
            { blogindex: blogIndex },
            { $set: { [`blogMenus.${menuIndex}.content.${content.index}`]: content } },
            { new: true, upsert: true }
        )
        if (contentCreated) {
            const menuCreatednew = JSON.parse(JSON.stringify(contentCreated));
            const MenuArray = Object.values(menuCreatednew.blogMenus[menuIndex].content).map(obj => {
                return ({
                    index: obj.index,
                    type: obj.type,
                    text: obj.text
                })
            })
            return res.status(200).json(MenuArray);
        } else {
            return res.status(400).json("Please check if the menuid and the blog id is correct or not")
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const getAllBlogsList_user = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const blogs = await HelpdeskModle.find({ userId });
        console.log("blogs", blogs);
        const blogsDetails = blogs.map(obj => {
            return ({
                blogindex: obj.blogindex,
                blogHeading: obj.blogHeading,
                blogOwner: obj.userId
            })
        })
        blogsDetails.reverse();
        if (blogs) {
            res.status(200).json(blogsDetails);
        } else {
            res.status(503).json('No Blogs Found');
        }
    }
    catch (error) {
        console.log(error.message);
    }

}
const getAllBlogsList = async (req, res) => {
    try {
        const blogs = await HelpdeskModle.find();
        const blogsDetails = blogs.map(obj => {
            return ({
                blogindex: obj.blogindex,
                blogHeading: obj.blogHeading,
                blogOwner: obj.userId
            })
        })
        blogsDetails.reverse();
        if (blogs) {
            res.status(200).json(blogsDetails);
        } else {
            res.status(503).json('No Blogs Found');
        }
    }
    catch (error) {
        console.log(error.message);
    }

}

const blogRequested = async (req, res) => {
    const blogId = req.params.blogindex;
    try {
        const completeBlog = await HelpdeskModle.find({ blogindex: blogId })
        console.log("comb", completeBlog);
        if (completeBlog.length > 0) {
            const wholeBlog = JSON.parse(JSON.stringify(completeBlog[0]))
            const blogMenus = wholeBlog.blogMenus;
            if (blogMenus) {
                const alpha = JSON.parse(JSON.stringify(blogMenus));
                const allMenus = Object.values(alpha).map(obj => {
                    return ({
                        blogMenuId: obj.blogMenuId,
                        title: obj.title
                    })
                })
                allMenus.reverse();
                const firstMenuItem = alpha[allMenus[0].blogMenuId]
                res.status(200).json([wholeBlog.blogHeading, allMenus, firstMenuItem, wholeBlog.userId])
            } else {
                res.status(201).json([wholeBlog.blogHeading, "", "", wholeBlog.userId]);
            }
        } else {
            res.status(404).json("No Blog found");
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const menuRequested = async (req, res) => {
    const blogId = req.params.blogindex;
    const MenuId = req.params.menuindex;
    try {
        const completeBlog = await HelpdeskModle.find({ blogindex: blogId });
        if (completeBlog) {
            const wholeBlog = JSON.parse(JSON.stringify(completeBlog[0]))
            const blogMenus = wholeBlog.blogMenus;
            if (blogMenus) {
                const alpha = JSON.parse(JSON.stringify(blogMenus));
                const allMenus = Object.values(alpha).map(obj => {
                    return ({
                        blogMenuId: obj.blogMenuId,
                        title: obj.title
                    })
                })
                const menuItem = alpha[MenuId]
                res.status(200).json([allMenus, menuItem, completeBlog[0].userId])
            } else {
                res.status(200).json("Menu Does not exist")
            }
        } else {
            res.status(404).json("No Blog found");
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const deleteBlog = async (req, res) => {
    const blogId = req.params.blogindex;
    try {
        const deletedBlog = await HelpdeskModle.findOneAndDelete({ blogindex: blogId })
        if (deletedBlog) {
            const blogs = await HelpdeskModle.find();
            const blogsDetails = blogs.map(obj => {
                return ({
                    blogindex: obj.blogindex,
                    blogHeading: obj.blogHeading
                })
            })
            blogsDetails.reverse();
            if (blogs) {
                res.status(200).json(blogsDetails);
            } else {
                res.status(503).json('No Blogs Found');
            }
        } else {
            res.status(404).json("No blog found");
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const deleteMenu = async (req, res) => {
    const { blogindex, menuindex } = req.params;

    try {
        const blog = await HelpdeskModle.findOne({ blogindex: blogindex });

        if (blog && blog.blogMenus && blog.blogMenus.has(menuindex)) {
            blog.blogMenus.delete(menuindex);
            const updatedBlog = await blog.save();

            if (updatedBlog) {
                const menuCreatednew = JSON.parse(JSON.stringify(updatedBlog));
                const MenuArray = Object.values(menuCreatednew.blogMenus).map(obj => {
                    return ({
                        blogMenuId: obj.blogMenuId,
                        title: obj.title
                    })
                })
                MenuArray.reverse();
                return res.status(200).json(MenuArray);
            } else {
                return res.status(500).json({ error: 'Failed to delete menu from blog' });
            }
        } else {
            return res.status(404).json({ error: 'Blog or menu not found' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteContent = async (req, res) => {
    const { blogIndex, menuId, contentId } = req.params;

    try {
        const blog = await HelpdeskModle.findOne({ blogindex: blogIndex });

        if (blog && blog.blogMenus && blog.blogMenus.has(menuId)) {
            const menu = blog.blogMenus.get(menuId);

            if (menu.content && menu.content.has(contentId)) {
                menu.content.delete(contentId);
                const updatedBlog = await blog.save();

                if (updatedBlog) {
                    const menuCreatednew = JSON.parse(JSON.stringify(updatedBlog));
                    const MenuArray = Object.values(menuCreatednew.blogMenus[menuId].content).map(obj => {
                        return ({
                            index: obj.index,
                            type: obj.type,
                            text: obj.text
                        })
                    })
                    return res.status(200).json(MenuArray);
                } else {
                    return res.status(500).json({ error: 'Failed to delete content from menu' });
                }
            } else {
                return res.status(404).json({ error: 'Content not found in menu' });
            }
        } else {
            return res.status(404).json({ error: 'Blog or menu not found' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const profileUploadfn = async (req, res) => {
    const userId = req.user._id.toString();
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${userId}_profile`,
            width: 500,
            height: 500,
            crop: 'fill'
        })
        const user = await userModle.findOneAndUpdate(
            { _id: userId },
            { $set: { profile: result.secure_url } },
            { new: true, upsert: true }
        )
        if (user && result) {
            res.status(200).json(result.secure_url);
        }
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}


module.exports = { addBlog, addMenu, addContent, getAllBlogsList, getAllBlogsList_user, deleteBlog, blogRequested, menuRequested, deleteMenu, deleteContent, profileUploadfn };
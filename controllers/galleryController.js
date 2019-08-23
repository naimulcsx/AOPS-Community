const {Gallery} = require('../models');
const fs = require('fs');


const showAllGalleries = async (req, res) => {
    const galleriesPerPage = res.locals.AOPSInfo.numberOfGalleryOnGalleryPage;
    let skipCount = 0, currentPage = 1;

    const documentCount = await Gallery.countDocuments({});
    const paginateCount = Math.ceil(documentCount / galleriesPerPage);

    if (req.query.page && parseInt(req.query.page) > 0) {
        currentPage = parseInt(req.query.page);
        skipCount = currentPage - 1;
    }

    const galleries = 
        await Gallery
            .find()
            .sort({created: -1})
            .limit(galleriesPerPage)
            .skip(skipCount * galleriesPerPage);

    res.render('gallery/index', {
        galleries,
        paginateCount,
        currentPage,
    });
}

const showSingleGallery = async (req, res) => {
    try {
        let gallery = await Gallery.findOne({_id: req.params.id})
        res.render('gallery/single', {
            gallery
        });
    } catch(err) { console.log(err) }
}   

const createNewGallery = (req, res) => {
    req.body.images = [];
    req.body.createdBy = req.user._id;

    // put all images into array for req.body
    for (let i = 0; i < req.files.length; ++i)
        req.body.images.push( req.files[i].path );
    
    let newGallery = new Gallery(req.body);
    newGallery
        .save()
        .then(gallery => {
            req.flash('success', 'Successfully created album.')
            res.redirect('/dashboard/gallery');
        })
        .catch(err => {
            // delete the uploaded files
            for (let i = 0; i < req.body.images.length; ++i) {
                let image = req.body.images[i];
                fs.unlinkSync(`.\\${image}`);
            }
            
            // handle validation errors
            
            let fields = ['name', 'images'];
            let validationErrors = [];
            for (let i = 0; i < fields.length; ++i) {
                if (err.errors[fields[i]]) 
                    validationErrors.push( err.errors[fields[i]].message );
            }

            res.render('dashboard/gallery/new', {
                validationErrors
            })
        });
}


const updateSingleGallery = async(req, res) => {
    try {
        let gallery = await Gallery.findOne({_id: req.params.id})
        
        if (!gallery) {
            res.error('error', 'Album doesn\'t exist.');
            res.redirect("/dashboard/gallery");
        }

        // validate form data
        let validationErrors = [];
        
        if ( !req.body.name ) validationErrors.push('<li>Album name is required</li>');
        if ( req.body.fileSelected == 'on' && req.files.length < 1 ) validationErrors.push(`<li>You must include at least 1 photo</li>`);

        if ( validationErrors.length > 0 ) {
            let errorString = '';
            for(let i = 0; i < validationErrors.length; ++i) errorString = errorString.concat(validationErrors[i]);
            req.flash('error', errorString);
            return res.redirect(`/dashboard/gallery/update/${req.params.id}`);
        }

        if ( req.body.fileSelected == 'on' ) {
            // if gallery if found with the id, delete the images
            for (let i = 0; i < gallery.images.length; ++i) {
                let path = gallery.images[i];
                fs.unlinkSync(`.\\${path}`);
            }

            // set up the updated object
            req.body.images = [];
            // put all images into array for req.body
            for (let i = 0; i < req.files.length; ++i)
                req.body.images.push( req.files[i].path );
        }

        await Gallery.findOneAndUpdate({_id: req.params.id}, req.body);

        req.flash('success', 'Album updated successfully');
        res.redirect("/dashboard/gallery");
    } catch(err) { console.log(err) } 
}

const deleteSingleGallery = async(req, res) => {
    try {
        let gallery = await Gallery.findOne({ _id: req.params.id });
        // if gallery doesn't exists
        if ( !gallery ) {
            res.error('error', 'Album doesn\'t exist.');
            res.redirect("/dashboard/gallery");
        }

        // if gallery if found with the id, delete the images
        for (let i = 0; i < gallery.images.length; ++i) {
            let path = gallery.images[i];
            fs.unlinkSync(`.\\${path}`);
        }

        // finally delete the gallery
        await Gallery.findByIdAndDelete(req.params.id);

        req.flash('success', 'Album deleted successfully');
        res.redirect("/dashboard/gallery");
    } catch( err ) { console.log(err); }
}

module.exports = {
    showSingleGallery,
    createNewGallery,
    deleteSingleGallery,
    updateSingleGallery,
    showAllGalleries
}
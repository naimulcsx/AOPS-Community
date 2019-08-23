const {Gallery} = require('../../models');

const renderDashboardGalleryNew = (req, res) => {
    res.render('dashboard/gallery/new');
}

const renderDashboardGallery = async(req, res) => {
    try {
        let galleries = await Gallery.find({}).sort({created: -1}).populate('createdBy');
        res.render('dashboard/gallery/index', {
            galleries
        });
    } catch (err) {  }
}

const renderDashboardGalleryUpdate = async(req, res) => {
    try {
        let gallery = await Gallery.findOne({_id: req.params.id});

        if (!gallery) {
            req.flash('error', 'Album doesn\'t exists.');
            res.redirect('/dashboard/gallery');
        }

        res.render('dashboard/gallery/update', {
            gallery
        });
    } catch(err) { console.log(err); }
}

module.exports = {
    renderDashboardGallery,
    renderDashboardGalleryNew,
    renderDashboardGalleryUpdate
}
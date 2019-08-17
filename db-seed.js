const {Notice, AOPS} = require('./models');

const {noticeSeeds, AOPSSeed} = require('./seeds');

const seedDatabase = () => {
    Notice // remove all notices
        .deleteMany({})
        .then( () => console.log('Removed all notices') )
        .catch( () => console.log('Couldn\'t remove the notices') );

    noticeSeeds.forEach(async (notice) => {
        await new Notice(notice).save();
        console.log('Notice created!');
    });

    // remove AOPSInfo
    AOPS
        .deleteMany({})
        .then( () => console.log('Reset config') )
        .catch( () => console.log('Couldn\'t remove the notices') );

    // create AOPSInfo
    let AOPSConfig = new AOPS(AOPSSeed);
    AOPSConfig
        .save()
        .then(data => console.log('Created AOPS Info'))
        .catch(err => console.log(err) );
}

module.exports = seedDatabase;
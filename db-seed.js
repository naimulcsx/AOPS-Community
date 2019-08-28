const mongoose = require('mongoose');
const {Notice, AOPS, Member, Achievement, Gallery, Event} = require('./models');
const {noticeSeeds, AOPSSeed, memberSeed, AchievementSeed, GallerySeed, eventSeed, executiveSeed} = require('./seeds');

const seedDatabase = () => {
    AOPS // remove AOPSInfo and insert
        .deleteMany({})
        .then( () => {
            console.log('Reset config') 
            return new AOPS(AOPSSeed).save();
        })
        .then( data => {
            console.log('Created AOPSInfo!');
        })
        .catch( () => console.log('Couldn\'t remove the notices') );

    
    Member // Remove all members and insert
        .deleteMany({})
        .then(async () => {
            console.log('Removed All Members');

            try {
                let user = await Member.create(memberSeed);

                let userData = {
                    noticesPosted: [],
                    achievementsPosted: [],
                    galleriesPosted: [],
                    eventsPosted: []
                };

                console.log('Created superadmin.');

                Notice // remove all notices and insert seed
                    .deleteMany({})
                    .then( () => {
                        console.log('Removed all notices') 

                        noticeSeeds.forEach(async (notice) => {
                            try {
                                notice.createdBy = user._id;
                                let data = await new Notice(notice).save();                                
                                Member
                                    .findById(user._id)
                                    .then(async (user) =>{
                                        user.noticesPosted.push(data);
                                        await user.save();
                                    });

                                console.log('Notice created!');
                            } catch(err) { console.log(err)  }
                        });
                    
                    })
                    .catch( () => console.log('Couldn\'t remove the notices') );

                Achievement
                    .deleteMany({})
                    .then( () => {
                        console.log('Remove all achievements');

                        AchievementSeed.forEach(async (achievement) => {
                            try {
                                achievement.createdBy = user._id;
                                let data = await new Achievement(achievement).save();
                                Member
                                    .findById(user._id)
                                    .then(async (user) =>{
                                        user.achievementsPosted.push(data);
                                        await user.save();
                                    });
                            } catch(err) { console.log(err) }
                        });
                    });

                Gallery
                    .deleteMany({})
                    .then( () => {
                        console.log('Remove all albums');
                        // insert new albums
                        GallerySeed.forEach(async (gallery) => {
                            try {
                                gallery.createdBy = user._id;
                                let data = await new Gallery(gallery).save();
                                Member
                                    .findById(user._id)
                                    .then(async (user) =>{
                                        user.galleriesPosted.push(data);
                                        await user.save();
                                    });
                            } catch( err ) { console.log(err) }
                        })
                    });

                // delete all the events
                Event
                    .deleteMany({})
                    .then(() => {
                        console.log('Events deleted');
                        eventSeed.forEach(async (event) => {
                            try {
                                event.createdBy = user._id;
                                let data = await new Event(event).save();
                                Member
                                    .findById(user._id)
                                    .then(async (user) =>{
                                        user.eventsPosted.push(data);
                                        await user.save();
                                    });

                                console.log('Event saved');
                            } catch(err) { console.log(err) }
                        })
                    })
                    .catch(err => console.log(err));
                

                

            } catch(err) { console.log(err); }


            

        })
        .catch(err => console.log('Member coundn\'t be created'));    

    executiveSeed.forEach(async (executive) => {
        try {
            let data = await Member.create(executive);
        console.log('Created executive!');
        } catch(err) {
            console.log(err);
        }
    });
}

module.exports = seedDatabase;
const mongoose = require('mongoose');
const {Notice, AOPS, Member, Achievement} = require('./models');
const {noticeSeeds, AOPSSeed, memberSeed, AchievementSeed} = require('./seeds');

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
                console.log('Created superadmin.');

                Notice // remove all notices and insert seed
                    .deleteMany({})
                    .then( () => {
                        console.log('Removed all notices') 

                        noticeSeeds.forEach(async (notice) => {
                            try {
                                notice.createdBy = user._id;
                                await new Notice(notice).save();
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
                                await new Achievement(achievement).save();
                                console.log('Achievement created!');
                            } catch(err) { console.log(err) }
                        });
                    });

            } catch(err) { console.log(err); }

        })
        .catch(err => console.log('Member coundn\'t be created'));    
}

module.exports = seedDatabase;
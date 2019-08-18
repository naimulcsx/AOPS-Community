const mongoose = require('mongoose');
const {Notice, AOPS, Member} = require('./models');
const {noticeSeeds, AOPSSeed, memberSeed} = require('./seeds');

const seedDatabase = () => {
    Notice // remove all notices and insert seed
        .deleteMany({})
        .then( () => {
            console.log('Removed all notices') 

            noticeSeeds.forEach(async (notice) => {
                try {
                    await new Notice(notice).save();
                    console.log('Notice created!');
                } catch(err) { console.log(err)  }
            });
        
        })
        .catch( () => console.log('Couldn\'t remove the notices') );


    
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
        .then(() => {
            console.log('Removed All Members');

            memberSeed.forEach(async (member) => {
                try {
                    await Member.create(member);
                    console.log('Member created!');
                } catch(err) { console.log(err); }
            })

        })
        .catch(err => console.log('Member coundn\'t be created'));    
}

module.exports = seedDatabase;
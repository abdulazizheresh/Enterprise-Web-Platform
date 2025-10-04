const User = require('./user');

// Sync all models
const syncModels = async () => {
    try {
        await User.sync();
        console.log('Models synced successfully');
    } catch (error) {
        console.error('Model sync failed:', error);
    }
};

module.exports = {
    User,
    syncModels
};
import _ from 'lodash'

let mapErrors = (error) => {
    if(error.name === 'MongoError' && error.code === 11000 ){
        let propertie = error.errmsg.split(':')[2].split('_')[0];
        return [{ propertie, message: `${propertie}_unique`}]
    }else{
        let keys = Object.keys(error.errors);
        let errors = [];
        _.forEach(keys, key => {
            errors.push({ propertie: key, message: error.errors[key].message});
        });
        return errors;
    }
};

module.exports = {
    mapErrors
}
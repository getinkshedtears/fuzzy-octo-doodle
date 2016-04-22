import Alt from './alt';
import request from 'superagent';

class Actions {
    
    updateSearch(search){
        return search;
        
    }
    
    updateError(error) {
        return error;
    }
    
    updateLocations(locations) {
        return locations;
    }
    
    updateUser(user) {
        console.log(user)
        return user;
    }
    
    updateAttending(obj) {
        return obj;
    }
    
    addAttending(id) {
        request
            .post('/api/addAttending')
            .send({id:id})
            .end(function(err, data){
                this.updateAttending(data.body);
            }.bind(this))
    }
    
    removeAttending(id) {
        request
            .post('/api/removeAttending')
            .send({id:id})
            .end(function(err, data){
                this.updateAttending(data.body);
            }.bind(this))
    }
    
    fetchLocations(search) {
        return (dispatch) => {
            dispatch();
            request.post('./api/yelp')
                .send({location: search})
                .end(function(err, data){
                    if (data.body.locations) {
                        this.updateLocations(data.body.locations);
                    }
                        else this.updateError(data.body.error);
            }.bind(this))
        }
    }
    
    fetchUser() {
        console.log('fetching user')
        request
            .post('./api/getUser')
            .end(function(err, data){
                if (data.body) {
                    if (data.body.lastSearch) {
                        this.fetchLocations(data.body.lastSearch)
                    }
                }
                this.updateUser(data.body);
            }.bind(this))
    }
    
    setLastSearch(search) {
        request
            .post('/api/setLastSearch')
            .send({search: search})
            .end(function(err, data){
                console.log(data);
            })
    }
}

export default Alt.createActions(Actions);

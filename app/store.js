import Alt from './alt';
import Actions from './actions';

class Store {
    constructor() {
        this.search = '';
        this.locations = [];
        this.loading = false;
        this.user = null;
        this.error = null;
        
        this.bindListeners({
            handleUpdateSearch: Actions.UPDATE_SEARCH,
            handleFetchLocations: Actions.FETCH_LOCATIONS,
            handleUpdateLocations: Actions.UPDATE_LOCATIONS,
            handleUpdateUser: Actions.UPDATE_USER,
            handleUpdateAttending: Actions.UPDATE_ATTENDING,
            handleUpdateError: Actions.UPDATE_ERROR
        });
    }
    
    handleUpdateSearch(search) {
        this.search = search;
    }
    
    handleUpdateLocations(data) {
        this.loading = false;
        this.locations = data;
    }
    
    handleFetchLocations() {
        this.error = null;
        this.loading = true;
    }
    
    handleUpdateUser(user) {
        this.user = user;
    }
    
    handleUpdateError(error) {
        this.error = error;
        this.locations = [];
        this.loading = false;
    }
    
    handleUpdateAttending(obj) {
        console.log('update attending');
        this.user = obj.user;
        var id = obj.id;
        var type = obj.type;
            console.log(id);
        
        var newLocations = this.locations.map(function(location) {
            if (location.id === id) {
                if (type === 'add') {
                    location.attending++;
                }
                if (type === 'remove') {
                    location.attending--;
                }
            }
            return location;
        })
        
        console.log(newLocations);
    }
    
}

export default Alt.createStore(Store, 'Store');
import React from 'react';
import ReactDOM from 'react-dom';
import Store from './store';
import Actions from './actions';

class App extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = Store.getState();
        Actions.fetchUser();
        
        this._onChange = this._onChange.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        
        Store.listen(this._onChange);
    }
    
    componentWillUnmount() {
        Store.unlisten(this._onChange);
    }
    
    _onChange() {
        this.setState(Store.getState());
    }
    
    render() {
        return (<div className = 'big-wrapper'>
        
            <Topbar user = {this.state.user} />
            
            <div className = 'wrapper'>
            
            <Search location = {this.state.search} user = {this.state.user} error = {this.state.error}/>
            
            <Display locations = {this.state.locations} loading = {this.state.loading} user = {this.state.user}/>
            
            </div>
            
        </div>);
    }
}

class Login extends React.Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
            open: false
        }
        
        this.getClass = this.getClass.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
    }
    
    getClass() {
        if (this.state.open) {
            return 'login-box-open'
        }
        else return 'login-box-closed'
    }
    
    toggleLogin() {
        console.log('toggle')
        this.setState({open: !this.state.open})
    }
    
    testFB() {
        console.log('click')
    }
    
    render() {
        return (<div>
        
                <div className = 'login-wrapper'>
                    <div className = 'login' onClick = {this.toggleLogin}>
                    
                        Login
                    
                    </div>
                </div>
                
                <div className = {this.getClass()}>
                
                    <a href ='/auth/facebook'><div className = 'facebook'>You can only log in with Facebook ...</div></a>
                
                </div>
            </div>)
    }
    
}

class Topbar extends React.Component {
    
    render() {
        return (<div className = 'topbar'>
            <Login />
            <div className = 'text-title'>THE NIGHTLIFE</div>
        </div>)
    }
    
}

class Search extends React.Component {
    
    constructor(props) {
        super(props)
        
        this.updateSearch = this.updateSearch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    updateSearch(e) {
        Actions.updateSearch(e.target.value);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        Actions.fetchLocations(this.props.location);
        
        if (this.props.user) {
            Actions.setLastSearch(this.props.location)
        }
    }
    
    placeholder() {
        if (this.props.user) {
            if (this.props.user.lastSearch) {
                return this.props.user.lastSearch
            }
        }
        else return 'City, state, or zip code'
    }
    
    render() {
        return (<div className = 'search'>
            <form onSubmit = {this.handleSubmit}>
                <span className = 'text-youarehere'>You are here: </span>
                <input type = 'text' placeholder = {this.placeholder()}  onChange = {this.updateSearch}/>
                <input type = 'submit' value = 'find me bars'/>
            </form>
            <div className = 'err'>{this.props.error}</div>
        </div>)
    }
}

class Display extends React.Component {
    
    constructor(props) {
        super(props)
        
        this.showLocations = this.showLocations.bind(this);
        
    }
    
    showLocations() {
        return this.props.locations.map(function(location){
            return <Location location = {location} user ={this.props.user} />
        }.bind(this))
    }
    
    render() {
        return(

            <div className = 'display'>
            
                {this.props.loading ? <div className = 'loader'/> : this.showLocations()}
            
            </div>

            )
    }
}

class Location extends React.Component {
    constructor(props) {
        super(props)
        
        this.showAttending = this.showAttending.bind(this);
    }
    
    showAttending() {
        if (this.props.user) {
            if (this.props.user.attending.indexOf(this.props.location.id) >= 0) {
                return <div className = 'add-attending' onClick = {Actions.removeAttending.bind(null, this.props.location.id)}>Never mind</div>
            }
            else return <div className = 'add-attending' onClick = {Actions.addAttending.bind(null, this.props.location.id)}>I'm going!</div>
        }
        else return null
    }
    
    getAttending() {
        
    }
    
    render() {
        return(
            <div className = 'location'>
            
            <div className = 'top'>
                <div className = 'location-name'>
                    <div>{this.props.location.name}</div>
                    <img src = {this.props.location.rating_img_url}/>
                </div>
            </div>
            
            <div className = 'middle'>
                <div className = 'location-review'>{this.props.location.snippet_text}</div>
            </div>
            
            <div className = 'bottom'>
                <div className = 'attending'><span className = 'number'>{this.props.location.attending}</span><br/>tonight</div>
                
                    {this.showAttending()}
            </div>
            </div>
            )
    }
}

ReactDOM.render(<App />, document.getElementById('anchor'));
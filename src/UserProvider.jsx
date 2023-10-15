import React, { Component, createContext } from "react";
import {auth}  from "./firebase.js";
import {generateUserDocument} from "./firebase.js"

export const UserContext = createContext({ user: null });
class UserProvider extends Component {
    constructor() {
        super()
        this.state = {
            user: null
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged( userAuth => {
            const user =  generateUserDocument(userAuth);
            this.setState({ user });
        });
    };
    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}
export default UserProvider;
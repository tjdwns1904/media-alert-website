import React from 'react'

export default class Test extends React.Component{

    constructor(){
        super()
        this.state = {
            students: [],
            isLoading: true
        }

        fetch('http://bestlab.us:8080/students')
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            console.log(data)
            this.setState({isLoading: false, students: data})
        }.bind(this))

    }

    render(){
        if(this.state.isLoading){
            return(
            <div>
                Loading
              
            </div>
            )
        }
        else{
            return(
                <div>
                    {this.state.students.map(function(s){
                        return s.name
                    })}
                </div>
            ) 
            
        }
    }

}
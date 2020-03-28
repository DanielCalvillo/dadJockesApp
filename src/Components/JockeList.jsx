import React, { Component } from 'react'
import '../Assets/JockeList.css' 
import JockeLine from './JockeLine';
import axios from 'axios'

class JockeList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    };

    constructor(props) {
        super(props)
        this.state = {
            jockes: []
        }
    }

    async componentDidMount() {
        const jockeUrl = `https://icanhazdadjoke.com/`

        let jokes = [];

        while(jokes.length < this.props.numJokesToGet) {
            let response = await axios.get(jockeUrl, {
                headers: { Accept: 'application/json' }
            });
            jokes.push(response.data.joke)
        }

        this.setState(st => ({
            jockes: jokes
        }))
    }

    render() {

        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='jockeList-getmore'>New Jockes</button>
                </div>

                <div className="JokeList-jokes">
                    {this.state.jockes.map( j => (
                        <div>{j}</div>
                    ))}
                </div>
            </div>
        )
    }
}
export default JockeList
import React, { Component } from 'react' 
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
            jockes: [...st.jockes, jokes]
        }))
    }

    render() {

        return(
            <div>
                <div className="JokeList">
                    <h1>Dad Jokes</h1>
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
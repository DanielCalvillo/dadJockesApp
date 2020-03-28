import React, { Component } from 'react'
import '../Assets/JockeList.css' 
import JokeLine from './JokeLine';
import uuid from 'uuid/v4'
import axios from 'axios'

class JockeList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    };

    constructor(props) {
        super(props)
        this.state = {
            jokes: []
        }
        this.handleVote = this.handleVote.bind(this)
    }

    async componentDidMount() {
        const jokeUrl = `https://icanhazdadjoke.com/`

        let jokes = [];

        while(jokes.length < this.props.numJokesToGet) {
            let response = await axios.get(jokeUrl, {
                headers: { Accept: 'application/json' }
            });
            jokes.push({id: uuid(), text: response.data.joke, votes: 0})
        }

        this.setState(st => ({
            jokes: jokes
        }))
    }

    handleVote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? {...j, votes: j.votes + delta} : j
                )
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
                    <button className='jockeList-getmore'>New Jokes</button>
                </div>

                <div className="JokeList-jokes">
                    {this.state.jokes.map( j => (
                        <JokeLine 
                            key={j.id} 
                            votes={j.votes} 
                            text={j.text} 
                            upvote={() => this.handleVote(j.id, 1)} 
                            downvote={() => this.handleVote(j.id, -1)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}
export default JockeList
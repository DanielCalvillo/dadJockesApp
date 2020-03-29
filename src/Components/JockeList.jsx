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
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
        }
        this.seenJokes = new Set(this.state.jokes.map( j => j.text));

        this.handleVote = this.handleVote.bind(this)
        this.getJokes = this.getJokes.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        if(this.state.jokes.length === 0) {
            this.getJokes();
        }
    }

    async getJokes() {
        try {
            const jokeUrl = `https://icanhazdadjoke.com/`
            let jokes = [];
            while(jokes.length < this.props.numJokesToGet) {
                let response = await axios.get(jokeUrl, {
                    headers: { Accept: 'application/json' }
                });
                let newJoke = response.data.joke
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({id: uuid(), text: newJoke, votes: 0})
                } else {
                    console.log("Founded a duplicate!", newJoke);
                }
                
            }

            this.setState(st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }),
            () =>  window.localStorage.setItem("jokes", JSON.stringify
            (this.state.jokes))
            )
        } catch(e) {
           alert(e) 
           this.setState({
               loading: false
           })
        }
    }

    handleVote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? {...j, votes: j.votes + delta} : j
                )
        }), 
        () =>  window.localStorage.setItem("jokes", JSON.stringify
        (this.state.jokes))
        )
    }

    handleClick() {
        this.setState({loading:true}, this.getJokes);
    }

    render() {

        if(this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin" />
                    <h1 className="JokeList-title">loading...</h1>
                </div>
            )
        }

        let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes)

        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='JokeList-getmore' onClick={this.handleClick}>New Jokes</button>
                </div>

                <div className="JokeList-jokes">
                    {jokes.map( j => (
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
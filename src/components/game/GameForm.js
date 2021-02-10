import React, { useContext, useState, useEffect } from "react"
import { GameContext } from "./GameProvider.js"
import { useHistory } from 'react-router-dom'


export const GameForm = props => {
    const history = useHistory()
    const { createGame, getGameTypes, gameTypes, getGame, game, editGame } = useContext(GameContext)
    const playerNumArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    /*
        Since the input fields are bound to the values of
        the properties of this state variable, you need to
        provide some default values.
    */
    const [currentGame, setCurrentGame] = useState({
        skillLevel: 1,
        numberOfPlayers: 0,
        title: "",
        maker: "",
        gameTypeId: 0
    })

    /*
        Get game types on initialization so that the <select>
        element presents game type choices to the user.
    */
    useEffect(() => {
        getGameTypes()
    }, [])

    useEffect(() => {
        if (props.match.params.gameId) {
            getGame(props.match.params.gameId).then(() => {
                setCurrentGame({
                    skillLevel: game.skill_level,
                    numberOfPlayers: game.number_of_players,
                    title: game.title,
                    maker: game.maker,
                    gameTypeId: game.gametype.id
                })
            })
        }
    }, [props.match.params.gameId])

    /*
        Update the `currentGame` state variable every time
        the state of one of the input fields changes.
    */
    const changeGameState = (domEvent) => {
        const newGameState = Object.assign({}, currentGame)
        newGameState[domEvent.target.name] = domEvent.target.value
        setCurrentGame(newGameState)
    }

    return (
        <form className="gameForm">
            {props.match.params.gameId ? <h2 className="gameForm__title">Edit Game</h2>: <h2 className="gameForm__title">Register New Game</h2>}
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame.title}
                        onChange={changeGameState}
                    />
                    <label htmlFor="title">Maker: </label>
                    <input type="text" name="maker" required autoFocus className="form-control"
                        value={currentGame.maker}
                        onChange={changeGameState}
                    />
                    <h3>Skill Level:</h3>
                    <select name="skillLevel" value={currentGame.skillLevel} onChange={changeGameState}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <h3>Number of Players: </h3>
                    <select name="numberOfPlayers" value={currentGame.numberOfPlayers} onChange={changeGameState}>
                        {playerNumArray.map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                    <h3>Game Type:</h3>
                    <select name="gameTypeId" onChange={changeGameState} value={currentGame.gameTypeId}>
                        <option value="0">Please select an option</option>
                        {gameTypes.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
                    </select>
                </div>
            </fieldset>

            { props.match.params.gameId ? 
            <button type="submit"
            onClick={evt => {
                evt.preventDefault()

                const game = {
                    id: parseInt(props.match.params.gameId),
                    maker: currentGame.maker,
                    title: currentGame.title,
                    numberOfPlayers: parseInt(currentGame.numberOfPlayers),
                    skillLevel: parseInt(currentGame.skillLevel),
                    gameTypeId: parseInt(currentGame.gameTypeId),
                }

                // Send PUT request to your API
                editGame(game)
                    .then(() => history.push("/"))
            }}
            className="btn btn-primary">Edit</button>
            :
            <button type="submit"
                onClick={evt => {
                    // Prevent form from being submitted
                    evt.preventDefault()

                    const game = {
                        maker: currentGame.maker,
                        title: currentGame.title,
                        numberOfPlayers: parseInt(currentGame.numberOfPlayers),
                        skillLevel: parseInt(currentGame.skillLevel),
                        gameTypeId: parseInt(currentGame.gameTypeId),
                    }

                    // Send POST request to your API
                    createGame(game)
                        .then(() => history.push("/"))
                }}
                className="btn btn-primary">Create</button>
            }
        </form>
    )
}
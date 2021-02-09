import React, { useContext, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { GameContext } from "../game/GameProvider.js"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export const EventForm = () => {
    const history = useHistory()
    const { getGames, games } = useContext(GameContext)

    const [currentEvent, setEvent] = useState({})
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        getGames()
    }, [])

    const changeEventState = (domEvent) => {
        const newEventState = Object.assign({}, currentEvent)
        newEventState[domEvent.target.name] = domEvent.target.value
        setEvent(newEventState)
    }
    return (
        <form className="eventForm">
            <h2 className="eventForm__title">Schedule New Event</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameId">Game: </label>
                    <select name="gameId" className="form-control"
                        value={currentEvent.gameId}
                        onChange={changeEventState}>
                        <option value="0">Select a game...</option>
                        {
                            games.map(game => (
                                <option value={game.id} key={game.id}>{game.title}</option>
                            ))
                        }
                    </select>
                    <DatePicker
                            selected={startDate}
                            onChange={date => {
                                setStartDate(date)
                                console.log(startDate)
                            }}
                            timeInputLabel="Time:"
                            showTimeInput
                            dateFormat="yyyy-MM-dd h:mm aa"
                        />
                </div>
            </fieldset>

            {/* Create the rest of the input fields */}

            <button type="submit"
                onClick={evt => {
                    evt.preventDefault()

                    // Create the event


                    // Once event is created, redirect user to event list
                }}
                className="btn btn-primary">Create Event</button>
        </form>
    )
}
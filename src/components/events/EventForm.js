import React, { useContext, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { GameContext } from "../game/GameProvider.js"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EventContext } from "./EventProvider.js";



export const EventForm = () => {
    const history = useHistory()
    const { getGames, games } = useContext(GameContext)
    const { createEvent } = useContext(EventContext)

    const [currentEvent, setEvent] = useState({})
    const [startDate, setStartDate] = useState(new Date());

    // Converts date to desired format while accounting for timezone so that it does not jump a day ahead/behind.
    const dateConverter = date => {
        const offset = date.getTimezoneOffset()
        date = new Date(date.getTime() - (offset*60*1000))
        return date.toISOString().split('T')
    }

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
                    <label htmlFor="description">Description: </label>
                    <input type="text" name="description" required autoFocus className="form-control"
                        value={currentEvent.description}
                        onChange={changeEventState}
                    />
                    <h3>Date and Time:</h3>
                    <DatePicker
                            selected={startDate}
                            onChange={date => {
                                setStartDate(date)
                                console.log(dateConverter(startDate)[1].split('.')[0])
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
                    // Prevent form from being submitted
                    evt.preventDefault()

                    // Method in time gets the time with timezone info and then splits it to exclude that for uniformity's sake

                    const event = {
                        gameId: parseInt(currentEvent.gameId),
                        description: currentEvent.description,
                        date: dateConverter(startDate)[0],
                        time: dateConverter(startDate)[1].split('.')[0]
                    }

                    // Send POST request to your API
                    createEvent(event)
                        .then(() => history.push("/events"))
                }}
                className="btn btn-primary">Create Event</button>
        </form>
    )
}
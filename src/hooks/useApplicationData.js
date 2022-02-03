import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const updateSpots = (day, appointments) =>
    day.appointments.length -
    day.appointments.reduce(
      (count, id) => (appointments[id].interview ? count + 1 : count),
      0
    );

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = state.days.map((day) => {
      if (day.appointments.includes(id)) {
        return { ...day, spots: updateSpots(day, appointments) };
      }
      return day;
    });

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(
        setState({
          ...state,
          appointments,
          days,
        })
      );
  }

  function cancelInterview(id) {
    const days = state.days.map((day) => {
      if (day.appointments.includes(id)) {
        return { ...day, spots: updateSpots(day, appointments) };
      }
      return day;
    });

    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        console.log("We made it here");
        setState({
          ...state,
          appointments,
          days,
        });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}

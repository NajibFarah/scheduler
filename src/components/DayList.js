import React from "react";
import DayListItem from "components/DayListItem";

export default function Daylist(props) {
  const days = props.days
    ? props.days.map((day) => {
        return (
          <DayListItem
            key={day.id}
            name={day.name}
            spots={day.spots}
            selected={day.name === props.value}
            setDay={props.onChange}
          />
        );
      })
    : [];
  return <ul>{days}</ul>;
}

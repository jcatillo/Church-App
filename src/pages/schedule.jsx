import React, { useEffect, useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";
import { Box, Flex, VStack, Button, Spinner } from "@chakra-ui/react";
import { getCalendar } from "@/data/calendar";

export function Schedule() {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  // Initialize the calendar app
  const calendar = useCalendarApp({
    calendars: {
      mass: {
        colorName: "mass",
        lightColors: {
          main: "#f9d71c",
          container: "#fff5aa",
          onContainer: "#594800",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#a29742",
        },
      },
      event: {
        colorName: "event",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
    },
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [], // Initialize empty; update dynamically
    plugins: [createEventModalPlugin()],
    defaultView: "week",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const calendarsData = await getCalendar();
        setCalendars(calendarsData);

        const formattedEvents = calendarsData.map((calendar) => ({
          id: calendar.id,
          title: calendar.title,
          start: calendar.start,
          end: calendar.end,
          description: calendar.description || "No description",
          calendarId: calendar.calendarType === "mass" ? "mass" : "event",
        }));

        setEvents(formattedEvents);
        if (calendar) {
          calendar.events.set(formattedEvents); // Set events in ScheduleX
        }
      } catch (err) {
        console.error("Failed to fetch calendars:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [calendar]); // Depend on calendar

  return (
    <VStack spacing={5} align="center" justify="center" p={4} minH="100vh">
      <Flex
        bg="white"
        boxShadow="xl"
        borderRadius="xl"
        p={6}
        flexDirection="column"
        align="center"
        justify="center"
        w="100%"
        maxW="1200px"
      >
        <Box w="100%" h={["400px", "600px"]} overflow="auto">
          {loading ? (
            <Flex justify="center" align="center" h="100%">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <ScheduleXCalendar calendarApp={calendar} />
          )}
        </Box>
      </Flex>
    </VStack>
  );
}

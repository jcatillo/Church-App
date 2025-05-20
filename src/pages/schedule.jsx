import React, { useEffect, useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence";
import "@schedule-x/theme-default/dist/index.css";
import { Box, Flex, VStack, Spinner } from "@chakra-ui/react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

export function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    events: [],
    plugins: [
      createEventModalPlugin(),
      createEventRecurrencePlugin({
        maxInstances: 100, // Limit recurring event instances
      }),
    ],
    defaultView: "week",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Calendar"), (snapshot) => {
      setLoading(true);
      try {
        const calendarsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Filter for mass and event only
        const filteredCalendars = calendarsData.filter(
          (calendar) => calendar.calendarId === "mass" || calendar.calendarId === "event"
        );

        const formattedEvents = filteredCalendars.map((calendar) => ({
          id: calendar.id,
          title: calendar.title,
          start: calendar.start,
          end: calendar.end,
          description: calendar.description || "No description",
          calendarId: calendar.calendarId,
          rrule: calendar.rrule || null,
        }));

        setEvents(formattedEvents);

        if (calendar) {
          // Add events in batches to prevent blocking
          const batchSize = 50;
          for (let i = 0; i < formattedEvents.length; i += batchSize) {
            const batch = formattedEvents.slice(i, i + batchSize);
            calendar.events.set([...calendar.events.getAll(), ...batch]);
            // Yield to the event loop
            setTimeout(() => {}, 0);
          }
        }
      } catch (err) {
        console.error("Failed to process calendars:", err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error("Failed to fetch calendars:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [calendar]);

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

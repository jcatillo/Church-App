import React from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";
import { Box, Flex, VStack } from "@chakra-ui/react";

export function Schedule() {
  const calendar = useCalendarApp({
    calendars:{
      mass: {
      colorName: 'mass',
      lightColors: {
        main: '#f9d71c',
        container: '#fff5aa',
        onContainer: '#594800',
      },
      darkColors: {
        main: '#fff5c0',
        onContainer: '#fff5de',
        container: '#a29742',
      },
    },

    event: {
      colorName: 'event',
      lightColors: {
        main: '#f91c45',
        container: '#ffd2dc',
        onContainer: '#59000d',
      },
      darkColors: {
        main: '#ffc0cc',
        onContainer: '#ffdee6',
        container: '#a24258',
      },
    },
    },

    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: "1",
        title: "Sunday Mass",
        start: "2025-05-17 09:00",
        end: "2025-05-17 10:00",
        description: "Weekly parish mass",
        customClass: "mass-event",
        calendarId: "mass"
      },
      {
        id: "2",
        title: "Team Meeting",
        start: "2025-05-17 14:00",
        end: "2025-05-17 16:00",
        description: "Quarterly planning session",
        customClass: "meeting-event",
      },
      {
        id: "3",
        title: "Workshop",
        start: "2025-05-18 10:00",
        end: "2025-05-18 12:30",
        description: "React advanced patterns",
      },
    ],
    plugins: [createEventModalPlugin()],
    defaultView: "week",
  });

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
          <ScheduleXCalendar calendarApp={calendar} />
        </Box>
      </Flex>
    </VStack>
  );
}

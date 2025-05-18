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

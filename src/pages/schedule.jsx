import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import React from 'react'
import { createEventModalPlugin } from '@schedule-x/event-modal'


import '@schedule-x/theme-default/dist/index.css'
import { Box, Flex, VStack } from '@chakra-ui/react'

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
        id: '1',
        title: 'Mass 1',
        start: '2025-05-17 01:00',
        end: '2025-05-17 05:00',
        description: 'Mass',
    },
    {
        id: '2',
        title: 'Event 1',
        start: '2025-05-17 01:00',
        end: '2025-05-17 05:00',
        description: 'Event',
    },
    ],

    plugins:[
        createEventModalPlugin()
    ],
  })

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Flex
        bg="white"
        boxShadow="md"
        borderRadius="md"
        p={4}
        flexDirection="column"
      >
        <Box w="100%" h="100%">
          <ScheduleXCalendar calendarApp={calendar} />
        </Box>
      </Flex>
    </VStack>
  )
}

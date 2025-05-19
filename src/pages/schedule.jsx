import React, { useState, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import {
  Box,
  Flex,
  VStack,
  Button,
  Heading,
  Text,
  Input,
  Textarea,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { SimpleModal } from "@/components/SimpleModal";
import { getCalendar } from "@/data/calendar";

export function Schedule() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventsServicePlugin] = useState(() => createEventsServicePlugin());
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    calendarId: "",
  });

  // Initialize calendar with empty events
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
    plugins: [createEventModalPlugin(), eventsServicePlugin],
    defaultView: "week",
  });

  // Fetch calendar events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await getCalendar();
      setCalendarEvents(data);
      console.log("Calendar data loaded:", data);
    } catch (error) {
      console.error("Error loading calendar data:", error);
      setCalendarEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial events
  useEffect(() => {
    fetchEvents();
  }, []);

  // Add events to calendar
  useEffect(() => {
    if (calendarEvents.length > 0) {
      // Clear existing events to avoid duplicates
      eventsServicePlugin.clear();
      calendarEvents.forEach((event) => {
        eventsServicePlugin.add(event);
      });
    }
  }, [calendarEvents, eventsServicePlugin]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newId = String(Date.now());
    const newEvent = {
      id: newId,
      title: formData.title,
      start: formData.start.replace("T", " "), // Convert to "YYYY-MM-DD HH:mm"
      end: formData.end.replace("T", " "),
      description: formData.description,
      calendarId: formData.calendarId || undefined,
    };

    try {
      // Placeholder: Replace with your actual API call to save the event
      // Example: await saveCalendarEvent(newEvent);
      console.log("Saving event to database:", newEvent);

      // Immediately add to calendar for instant feedback
      eventsServicePlugin.add(newEvent);

      // Re-fetch events from database to ensure consistency
      await fetchEvents();

      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({
        title: "",
        start: "",
        end: "",
        description: "",
        calendarId: "",
      });
    } catch (error) {
      console.error("Error saving event:", error);
      // Optionally show error to user
    }
  };

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
          <Button mb={5} onClick={() => setIsModalOpen(true)} isDisabled={isLoading}>
            Add Schedule
          </Button>

          {isLoading ? (
            <Center h="400px">
              <VStack>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text mt={4}>Loading calendar data...</Text>
              </VStack>
            </Center>
          ) : (
            <ScheduleXCalendar calendarApp={calendar} />
          )}

          <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Heading size="md" mb={4} textAlign="center">
              Add New Schedule
            </Heading>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  Start:
                  <input
                    type="datetime-local"
                    name="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  End:
                  <input
                    type="datetime-local"
                    name="end"
                    value={formData.end}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  Description:
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-1"
                    rows="3"
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  Calendar:
                  <select
                    name="calendarId"
                    value={formData.calendarId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Default</option>
                    <option value="mass">Mass</option>
                    <option value="event">Event</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </SimpleModal>
        </Box>
      </Flex>
    </VStack>
  );
}
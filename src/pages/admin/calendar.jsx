import React, { useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";
import { Box, Flex, VStack, Button, Heading } from "@chakra-ui/react";
import { SimpleModal } from "@/components/SimpleModal";

export function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    calendarId: ""
  });

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
    events: [
      {
        id: "1",
        title: "Sunday Mass",
        start: "2025-05-17 09:00",
        end: "2025-05-17 10:00",
        description: "Weekly parish mass",
        customClass: "mass-event",
        calendarId: "mass",
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a unique ID for the new event
    const newId = String(Date.now());
    
    // Create a new event object
    const newEvent = {
      id: newId,
      title: formData.title,
      start: formData.start.replace("T", " "),
      end: formData.end.replace("T", " "),
      description: formData.description,
      calendarId: formData.calendarId || undefined
    };
    
    // Add the event to the calendar
    // calendar.api.events.add(newEvent);
    
    // Log the new event data
    console.log("New event created:", newEvent);
    
    // Close the modal and reset the form
    setIsModalOpen(false);
    setFormData({
      title: "",
      start: "",
      end: "",
      description: "",
      calendarId: ""
    });
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
          <Button mb={5} onClick={() => setIsModalOpen(true)}>
            Add Schedule
          </Button>

          <ScheduleXCalendar calendarApp={calendar} />

          <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Heading size="md" mb={4} textAlign="center">Add New Schedule</Heading>
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
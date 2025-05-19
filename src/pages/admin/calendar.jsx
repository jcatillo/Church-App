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
  HStack,
  IconButton,
  Input,
  Textarea,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { SimpleModal } from "@/components/SimpleModal";
import { CiEdit } from "react-icons/ci";
import { LuCalendarClock } from "react-icons/lu";
import { TiDocumentText } from "react-icons/ti";
import { MdSave, MdCancel, MdDelete } from "react-icons/md";
import { getCalendar, addToCalendar, updateCalendarEvent, deleteCalendarEvent } from "@/data/calendar";

export function Calendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [eventsServicePlugin] = useState(() => createEventsServicePlugin());
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    calendarId: "",
  });

  function toLocalDatetimeInputValue(date) {
    const pad = (n) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Initialize calendar at the top level with empty events
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

  // Load calendar data
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  // Add loaded events to the calendar
  useEffect(() => {
    // Remove all existing events to prevent duplicates
    const currentEvents = eventsServicePlugin.getAll();
    currentEvents.forEach((event) => {
      eventsServicePlugin.remove(event.id);
    });
    // Add new events
    if (calendarEvents.length > 0) {
      calendarEvents.forEach((event) => {
        eventsServicePlugin.add(event);
      });
    }
  }, [calendarEvents, eventsServicePlugin]);

  const customComponents = {
    eventModal: ({ calendarEvent }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedEvent, setEditedEvent] = useState({
        ...calendarEvent,
      });

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
          try {
            // Remove from Firestore
            await deleteCalendarEvent(calendarEvent.id);
            // Remove from calendar
            eventsServicePlugin.remove(calendarEvent.id);
            // Refresh events
            const updatedEvents = await getCalendar();
            setCalendarEvents(updatedEvents);
          } catch (error) {
            console.error("Error deleting event:", error);
            // Optionally show error toast
          }
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleDateChange = (field, value) => {
        setEditedEvent((prev) => ({
          ...prev,
          [field]: toLocalDatetimeInputValue(new Date(value)).replace('T', " "),
        }));
      };

      const handleSave = () => {
        updateCalendarEvent(calendarEvent.id, editedEvent);
        // Update in-memory calendar
        eventsServicePlugin.update({
          title: editedEvent.title,
          start: editedEvent.start,
          end: editedEvent.end,
          id: calendarEvent.id,
          description: editedEvent.description || "",
          calendarId: editedEvent.calendarId || undefined,
        });
        // TODO: Persist changes to Firestore
        // Example: await updateCalendarEvent(calendarEvent.id, editedEvent);
        console.log("Event updated locally:", editedEvent);
        setIsEditing(false);
      };

      const handleCancel = () => {
        setEditedEvent({ ...calendarEvent });
        setIsEditing(false);
      };

      return (
        <Flex direction="column" boxShadow="lg" p={3} borderRadius="md" bg="white">
          <Flex justifyContent="flex-end">
            {isEditing ? (
              <HStack>
                <IconButton
                  aria-label="Save"
                  colorScheme="green"
                  size="sm"
                  color={"green"}
                  onClick={handleSave}
                >
                  <MdSave />
                </IconButton>
                <IconButton
                  aria-label="Cancel"
                  colorScheme="red"
                  size="sm"
                  color={"red"}
                  onClick={handleCancel}
                >
                  <MdCancel />
                </IconButton>
              </HStack>
            ) : (
              <HStack>
                <IconButton
                  aria-label="Edit"
                  size="sm"
                  color={"black"}
                  onClick={() => setIsEditing(true)}
                >
                  <CiEdit />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  size="sm"
                  color={"red"}
                  onClick={handleDelete}
                >
                  <MdDelete />
                </IconButton>
              </HStack>
            )}
          </Flex>

          <Flex justifyContent="center" my={2}>
            {isEditing ? (
              <Input
                name="title"
                value={editedEvent.title}
                onChange={handleChange}
                textAlign="center"
                fontWeight="bold"
                fontSize="lg"
              />
            ) : (
              <Heading size="md" textAlign="center">
                {calendarEvent.title}
              </Heading>
            )}
          </Flex>

          <HStack mt={3} align="flex-start">
            <LuCalendarClock size={18} style={{ marginTop: "8px" }} />
            {isEditing ? (
              <Flex direction="column" w="100%" gap={2}>
                <Text fontSize="sm" fontWeight="medium">
                  Start:
                </Text>
                <Input
                  type="datetime-local"
                  value={toLocalDatetimeInputValue(new Date(editedEvent.start))}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  size="sm"
                />
                <Text fontSize="sm" fontWeight="medium" mt={2}>
                  End:
                </Text>
                <Input
                  type="datetime-local"
                  value={toLocalDatetimeInputValue(new Date(editedEvent.end))}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  size="sm"
                />
              </Flex>
            ) : (
              <Text fontSize="sm">
                {new Date(calendarEvent.start).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                to{" "}
                {new Date(calendarEvent.end).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            )}
          </HStack>

          <HStack mt={4} align="flex-start">
            <TiDocumentText size={18} style={{ marginTop: "5px" }} />
            {isEditing ? (
              <Textarea
                name="description"
                value={editedEvent.description || ""}
                onChange={handleChange}
                size="sm"
                resize="vertical"
                rows={3}
              />
            ) : (
              <Text fontSize="sm">
                {calendarEvent.description || "No description"}
              </Text>
            )}
          </HStack>
        </Flex>
      );
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const newEvent = {
      title: formData.title,
      start: formData.start.replace("T", " "),
      end: formData.end.replace("T", " "),
      description: formData.description,
      calendarId: formData.calendarId || undefined,
    };

    try {
      // Save to Firestore and get the event with auto-generated ID
      const savedEvent = await addToCalendar(newEvent);

      // Add the saved event to the calendar for instant feedback
      eventsServicePlugin.add(savedEvent);

      // Re-fetch events from database to ensure consistency
      const updatedEvents = await getCalendar();
      setCalendarEvents(updatedEvents);

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
      // Optionally notify user, e.g., using Chakra UI Toast
    } finally {
      setIsSaving(false);
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
          <Button color={'white'} bg={'black'} mb={5} onClick={() => setIsModalOpen(true)} isDisabled={isLoading}>
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
            <ScheduleXCalendar customComponents={customComponents} calendarApp={calendar} />
          )}

          <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="relative bg-white rounded-lg shadow-xl max-w-xl w-full mx-auto p-8">
    {isSaving && (
      <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-base font-medium">Adding Schedule. Please wait...</p>
        </div>
      </div>
    )}

    <Heading as="h2" size="xl" textAlign="center" mb={6} fontWeight="semibold" color="gray.800">Add New Schedule</Heading>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
        <input
          type="datetime-local"
          name="start"
          value={formData.start}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
        <input
          type="datetime-local"
          name="end"
          value={formData.end}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Calendar</label>
        <select
          name="calendarId"
          value={formData.calendarId}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Default</option>
          <option value="mass">Mass</option>
          <option value="event">Event</option>
        </select>
      </div>

      <HStack justify="flex-end" spacing={3} pt={4}>
        <Button
            variant="outline"
            colorScheme="gray"
            onClick={() => setIsModalOpen(false)}
            isDisabled={isSaving}
            bg={'red'}
            color={'white'}
        >
            Cancel
        </Button>
        <Button
            colorScheme="blue"
            type="submit"
            isLoading={isSaving}
            loadingText="Saving"
            bg={'green'}
        >
            Save
        </Button>
        </HStack>
    </form>
  </div>
</SimpleModal>

        </Box>
      </Flex>
    </VStack>
  );
}
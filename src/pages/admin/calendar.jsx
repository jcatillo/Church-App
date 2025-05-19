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
import { MdSave, MdCancel } from "react-icons/md";
import { getCalendar, addToCalendar, updateCalendarEvent } from "@/data/calendar";

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
              <IconButton
                aria-label="Edit"
                size="sm"
                color={"black"}
                onClick={() => setIsEditing(true)}
              >
                <CiEdit />
              </IconButton>
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
            <ScheduleXCalendar customComponents={customComponents} calendarApp={calendar} />
          )}

          <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Box position="relative">
              {isSaving && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="rgba(0, 0, 0, 0.5)"
                  zIndex="10"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VStack bg="white" p={6} borderRadius="md" boxShadow="lg">
                    <Spinner size="lg" color="blue.500" thickness="4px" />
                    <Text fontSize="lg" fontWeight="medium">
                      Adding Schedule. Please Wait.
                    </Text>
                  </VStack>
                </Box>
              )}
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
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={isSaving}
                  >
                    Save
                  </button>
                </div>
              </form>
            </Box>
          </SimpleModal>
        </Box>
      </Flex>
    </VStack>
  );
}